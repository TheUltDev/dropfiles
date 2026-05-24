import {Platform, PermissionsAndroid} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import type {AccessConfig} from '@/lib/access';
import type {PickedFile} from '@/lib/pickers';
import {hashFile} from '@/lib/hash';
import {loadSettings} from '@/lib/settings';
import {
  insertUpload,
  listUploads,
  updateUpload,
  type LocalUpload,
} from '@/lib/db/local';
import {
  addFile,
  attachFileToBlob,
  buildStoragePath,
  claimBlob,
  createDrop,
  failFile,
  finalizeUpload,
  updateFileProgress,
} from '@/lib/db/remote';
import {patchUploadInStore, setUploads} from '@/lib/storage/store';

type ActiveController = {
  pause: () => void | Promise<void>;
  resume: () => void | Promise<void>;
  cancel: () => void | Promise<void>;
};

class UploadManager {
  private active = new Map<string, ActiveController>();
  private queue: string[] = [];
  private initialized = false;
  private netUnsubscribe: (() => void) | null = null;

  async init(): Promise<void> {
    if (this.initialized) return;
    const uploads = await listUploads();
    setUploads(uploads);
    this.queue = uploads
      .filter((item) => ['pending', 'paused', 'uploading'].includes(item.status))
      .map((item) => item.id);
    this.initialized = true;
    this.netUnsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        void this.processQueue();
      }
    });
    void this.processQueue();
  }

  async createDropWithFiles(access: AccessConfig, files: PickedFile[]): Promise<string> {
    if (files.length === 0) {
      throw new Error('Select at least one file.');
    }
    if (files.length > access.maxFiles) {
      throw new Error(`This drop allows at most ${access.maxFiles} file(s).`);
    }

    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    if (access.maxBytes != null && totalBytes > access.maxBytes) {
      throw new Error('Selected files exceed the maximum size for this drop.');
    }

    const drop = await createDrop(access);
    const now = new Date().toISOString();

    for (const file of files) {
      let hash: string | null = null;
      if (access.hashAlgo === 'blake3') {
        hash = await hashFile(file.stagedUri, access.hashAlgo);
      }

      const remoteFile = await addFile({
        dropId: drop.id,
        name: file.name,
        size: file.size,
        mime: file.mime,
        hash,
      });

      if (hash) {
        const blob = await claimBlob(hash);
        if (blob.exists) {
          await attachFileToBlob(remoteFile.id, hash);
          continue;
        }
      }

      const storagePath = hash ? buildStoragePath(hash) : buildStoragePath(file.id);

      const localUpload: LocalUpload = {
        id: crypto.randomUUID(),
        drop_id: drop.id,
        file_id: remoteFile.id,
        uri: file.stagedUri,
        name: file.name,
        size: file.size,
        mime: file.mime,
        storage_path: storagePath,
        hash,
        bytes_uploaded: 0,
        status: 'pending',
        upload_id: null,
        s3_key: null,
        error: null,
        hash_algo: access.hashAlgo,
        created_at: now,
        updated_at: now,
      };

      await insertUpload(localUpload);
      this.queue.push(localUpload.id);
    }

    const uploads = await listUploads();
    setUploads(uploads);
    void this.processQueue();
    return drop.id;
  }

  async pause(localId: string): Promise<void> {
    const entry = this.active.get(localId);
    if (entry) {
      await entry.pause();
      this.active.delete(localId);
    }
    await updateUpload(localId, {
      status: 'paused',
      updated_at: new Date().toISOString(),
    });
    const record = await this.getLocal(localId);
    if (record) {
      await updateFileProgress(record.file_id, {status: 'paused'});
      patchUploadInStore(localId, {status: 'paused'});
    }
  }

  async resume(localId: string): Promise<void> {
    const record = await this.getLocal(localId);
    if (!record) return;
    if (!this.queue.includes(localId)) {
      this.queue.push(localId);
    }
    await updateUpload(localId, {
      status: 'pending',
      error: null,
      updated_at: new Date().toISOString(),
    });
    patchUploadInStore(localId, {status: 'pending', error: null});
    void this.processQueue();
  }

  async cancel(localId: string): Promise<void> {
    const entry = this.active.get(localId);
    if (entry) {
      await entry.cancel();
      this.active.delete(localId);
    }
    this.queue = this.queue.filter((id) => id !== localId);
    await updateUpload(localId, {
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    });
    patchUploadInStore(localId, {status: 'cancelled'});
  }

  private async getLocal(id: string): Promise<LocalUpload | null> {
    const uploads = await listUploads();
    return uploads.find((upload) => upload.id === id) ?? null;
  }

  private async processQueue(): Promise<void> {
    const settings = await loadSettings();
    const net = await NetInfo.fetch();
    if (!net.isConnected) return;
    if (settings.wifiOnly && net.type !== 'wifi') return;

    while (this.queue.length > 0) {
      const localId = this.queue[0];
      if (this.active.has(localId)) {
        this.queue.shift();
        continue;
      }

      const record = await this.getLocal(localId);
      if (!record || ['completed', 'cancelled', 'failed'].includes(record.status)) {
        this.queue.shift();
        continue;
      }

      try {
        await this.startUpload(record);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed';
        await updateUpload(localId, {
          status: 'failed',
          error: message,
          updated_at: new Date().toISOString(),
        });
        await failFile(record.file_id, message);
        patchUploadInStore(localId, {status: 'failed', error: message});
      }

      this.queue.shift();
      if (this.active.size > 0) {
        break;
      }
    }
  }

  private async startUpload(record: LocalUpload): Promise<void> {
    if (Platform.OS !== 'web') {
      await requestUploadNotificationPermission();
    }

    await updateUpload(record.id, {
      status: 'uploading',
      updated_at: new Date().toISOString(),
    });
    await updateFileProgress(record.file_id, {status: 'uploading'});
    patchUploadInStore(record.id, {status: 'uploading'});

    if (Platform.OS === 'web') {
      const {startWebUpload} = await import('@/lib/storage/uploader.web');
      const fingerprint = `${record.drop_id}:${record.file_id}:${record.storage_path}`;
      const controller = await startWebUpload(
        {
          uri: record.uri,
          name: record.name,
          size: record.size,
          mime: record.mime,
          storagePath: record.storage_path,
          fingerprint,
        },
        {
          onProgress: (bytesUploaded) => {
            void updateUpload(record.id, {
              bytes_uploaded: bytesUploaded,
              updated_at: new Date().toISOString(),
            });
            void updateFileProgress(record.file_id, {
              bytes_uploaded: bytesUploaded,
              status: 'uploading',
            });
            patchUploadInStore(record.id, {bytes_uploaded: bytesUploaded});
          },
          onSuccess: async () => {
            this.active.delete(record.id);
            if (record.hash) {
              await finalizeUpload(
                record.file_id,
                record.hash,
                record.size,
                record.mime,
              );
            } else {
              await updateFileProgress(record.file_id, {status: 'completed'});
            }
            await updateUpload(record.id, {
              status: 'completed',
              updated_at: new Date().toISOString(),
            });
            patchUploadInStore(record.id, {status: 'completed'});
          },
          onError: async (error) => {
            this.active.delete(record.id);
            await updateUpload(record.id, {
              status: 'failed',
              error: error.message,
              updated_at: new Date().toISOString(),
            });
            await failFile(record.file_id, error.message);
            patchUploadInStore(record.id, {status: 'failed', error: error.message});
          },
        },
      );
      this.active.set(record.id, controller);
      return;
    }

    if (!record.hash) {
      throw new Error('Native uploads require BLAKE3 hash');
    }

    const {startNativeUpload} = await import('@/lib/storage/uploader.native');
    const controller = await startNativeUpload(
      {
        localId: record.id,
        fileId: record.file_id,
        uri: record.uri,
        name: record.name,
        size: record.size,
        mime: record.mime,
        hash: record.hash,
      },
      {
        onProgress: (bytesUploaded) => {
          void updateUpload(record.id, {
            bytes_uploaded: bytesUploaded,
            updated_at: new Date().toISOString(),
          });
          void updateFileProgress(record.file_id, {
            bytes_uploaded: bytesUploaded,
            status: 'uploading',
          });
          patchUploadInStore(record.id, {bytes_uploaded: bytesUploaded});
        },
        onSuccess: async () => {
          this.active.delete(record.id);
          await updateUpload(record.id, {
            status: 'completed',
            updated_at: new Date().toISOString(),
          });
          patchUploadInStore(record.id, {status: 'completed'});
        },
        onError: async (error) => {
          this.active.delete(record.id);
          await updateUpload(record.id, {
            status: 'failed',
            error: error.message,
            updated_at: new Date().toISOString(),
          });
          await failFile(record.file_id, error.message);
          patchUploadInStore(record.id, {status: 'failed', error: error.message});
        },
      },
    );

    this.active.set(record.id, controller);
  }
}

export async function requestUploadNotificationPermission(): Promise<void> {
  if (Platform.OS !== 'android' || Platform.Version < 33) return;

  try {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  } catch {
    // uploads continue without notifications
  }
}

export const uploadManager = new UploadManager();

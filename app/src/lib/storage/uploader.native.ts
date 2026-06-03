import {CloudUploader} from 'react-native-nitro-cloud-uploader';
import {stripFileScheme} from '@/lib/pickers';
import {saveUploadParts} from '@/lib/db/local';
import {
  singleUpload,
  createMultipartUpload,
  completeMultipartUpload,
  abortMultipartUpload,
} from '@/lib/db/remote';

const MULTIPART_THRESHOLD = 5 * 1024 * 1024;
const CHUNK_SIZE = 6 * 1024 * 1024;

export type NativeUploadTarget = {
  localId: string;
  fileId: string;
  uri: string;
  name: string;
  size: number;
  mime: string;
  hash: string;
};

export type NativeUploadHandlers = {
  onProgress?: (bytesUploaded: number, bytesTotal: number) => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export type NativeUploadController = {
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  cancel: () => Promise<void>;
};

function normalizeEtag(etag: string, index: number): {partNumber: number; etag: string} {
  const cleaned = etag.replace(/^"|"$/g, '');
  return {partNumber: index + 1, etag: cleaned};
}

export async function startUpload(
  target: NativeUploadTarget,
  handlers: NativeUploadHandlers = {},
): Promise<NativeUploadController> {
  const filePath = stripFileScheme(target.uri);

  const progressListener = (event: {
    uploadId?: string;
    bytesUploaded?: number;
    totalBytes?: number;
    progress?: number;
    errorMessage?: string;
  }) => {
    if (event.errorMessage) {
      handlers.onError?.(new Error(event.errorMessage));
      return;
    }
    if (event.bytesUploaded != null && event.totalBytes != null) {
      handlers.onProgress?.(event.bytesUploaded, event.totalBytes);
    } else if (event.progress != null) {
      handlers.onProgress?.(
        Math.round((event.progress / 100) * target.size),
        target.size,
      );
    }
  };

  CloudUploader.addListener('upload-progress', progressListener);

  try {
    if (target.size < MULTIPART_THRESHOLD) {
      const single = await singleUpload({
        fileId: target.fileId,
        hash: target.hash,
        mime: target.mime,
        fileSize: target.size,
      });

      if (single.deduplicated) {
        handlers.onSuccess?.();
        return {
          pause: async () => {},
          resume: async () => {},
          cancel: async () => {},
        };
      }

      const uploadId = single.uploadId;
      await CloudUploader.startUpload(uploadId, filePath, [single.url], 1, true);

      await completeMultipartUpload({
        uploadId,
        key: single.key,
        fileId: target.fileId,
        hash: target.hash,
        mime: target.mime,
        fileSize: target.size,
        parts: [],
      });

      handlers.onSuccess?.();
      return {
        pause: () => CloudUploader.pauseUpload(uploadId),
        resume: () => CloudUploader.resumeUpload(uploadId),
        cancel: async () => {
          await CloudUploader.cancelUpload(uploadId);
          await abortMultipartUpload({
            uploadId,
            key: single.key,
            fileId: target.fileId,
          });
        },
      };
    }

    const created = await createMultipartUpload({
      fileId: target.fileId,
      hash: target.hash,
      fileSize: target.size,
      chunkSize: CHUNK_SIZE,
      mime: target.mime,
    });

    if (created.deduplicated) {
      handlers.onSuccess?.();
      return {
        pause: async () => {},
        resume: async () => {},
        cancel: async () => {},
      };
    }

    const uploadId = created.uploadId;
    const result = await CloudUploader.startUpload(
      uploadId,
      filePath,
      created.urls,
      3,
      true,
    );

    const parts = result.etags.map((etag, index) => normalizeEtag(etag, index));
    await saveUploadParts(
      parts.map((part) => ({
        upload_id: uploadId,
        part_number: part.partNumber,
        etag: part.etag,
      })),
    );

    await completeMultipartUpload({
      uploadId,
      key: created.key,
      fileId: target.fileId,
      hash: target.hash,
      mime: target.mime,
      fileSize: target.size,
      parts,
    });

    handlers.onSuccess?.();

    return {
      pause: () => CloudUploader.pauseUpload(uploadId),
      resume: () => CloudUploader.resumeUpload(uploadId),
      cancel: async () => {
        await CloudUploader.cancelUpload(uploadId);
        await abortMultipartUpload({
          uploadId,
          key: created.key,
          fileId: target.fileId,
        });
      },
    };
  } catch (error) {
    handlers.onError?.(error instanceof Error ? error : new Error(String(error)));
    throw error;
  } finally {
    CloudUploader.removeListener('upload-progress');
  }
}

export async function pauseNativeUpload(uploadId: string): Promise<void> {
  await CloudUploader.pauseUpload(uploadId);
}

export async function resumeNativeUpload(uploadId: string): Promise<void> {
  await CloudUploader.resumeUpload(uploadId);
}

export async function cancelNativeUpload(
  uploadId: string,
  key: string,
  fileId: string,
): Promise<void> {
  await CloudUploader.cancelUpload(uploadId);
  await abortMultipartUpload({uploadId, key, fileId});
}

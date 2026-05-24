import {get, set, del, keys} from 'idb-keyval';
import type {PreviousUpload, UrlStorage} from 'tus-js-client';
import type {LocalUpload, LocalUploadStatus, UploadPart} from '@/lib/db/local.types';

export type {LocalUpload, LocalUploadStatus, UploadPart} from '@/lib/db/local.types';

const UPLOADS_KEY = 'dropfiles:uploads';
const TUS_URLS_KEY = 'dropfiles:tus_urls';
const PARTS_KEY = 'dropfiles:upload_parts';

async function readUploads(): Promise<LocalUpload[]> {
  return (await get<LocalUpload[]>(UPLOADS_KEY)) ?? [];
}

async function writeUploads(uploads: LocalUpload[]): Promise<void> {
  await set(UPLOADS_KEY, uploads);
}

export async function insertUpload(upload: LocalUpload): Promise<void> {
  const uploads = await readUploads();
  uploads.push(upload);
  await writeUploads(uploads);
}

export async function updateUpload(
  id: string,
  patch: Partial<
    Pick<
      LocalUpload,
      | 'bytes_uploaded'
      | 'status'
      | 'upload_id'
      | 's3_key'
      | 'error'
      | 'hash'
      | 'updated_at'
    >
  >,
): Promise<void> {
  const uploads = await readUploads();
  const index = uploads.findIndex((upload) => upload.id === id);
  if (index === -1) return;
  uploads[index] = {...uploads[index], ...patch};
  await writeUploads(uploads);
}

export async function getUpload(id: string): Promise<LocalUpload | null> {
  const uploads = await readUploads();
  return uploads.find((upload) => upload.id === id) ?? null;
}

export async function listUploads(filter?: {
  status?: LocalUploadStatus[];
  dropId?: string;
}): Promise<LocalUpload[]> {
  let uploads = await readUploads();
  if (filter?.dropId) {
    uploads = uploads.filter((upload) => upload.drop_id === filter.dropId);
  }
  if (filter?.status?.length) {
    uploads = uploads.filter((upload) => filter.status!.includes(upload.status));
  }
  return uploads.sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export async function deleteUpload(id: string): Promise<void> {
  const uploads = (await readUploads()).filter((upload) => upload.id !== id);
  await writeUploads(uploads);
}

export async function deleteUploadsForDrop(dropId: string): Promise<void> {
  const uploads = (await readUploads()).filter((upload) => upload.drop_id !== dropId);
  await writeUploads(uploads);
}

export async function saveUploadParts(parts: UploadPart[]): Promise<void> {
  const existing = (await get<UploadPart[]>(PARTS_KEY)) ?? [];
  const map = new Map(existing.map((part) => [`${part.upload_id}:${part.part_number}`, part]));
  for (const part of parts) {
    map.set(`${part.upload_id}:${part.part_number}`, part);
  }
  await set(PARTS_KEY, Array.from(map.values()));
}

export async function getUploadParts(uploadId: string): Promise<UploadPart[]> {
  const parts = (await get<UploadPart[]>(PARTS_KEY)) ?? [];
  return parts.filter((part) => part.upload_id === uploadId);
}

async function readTusUrls(): Promise<Record<string, string>> {
  return (await get<Record<string, string>>(TUS_URLS_KEY)) ?? {};
}

async function writeTusUrls(urls: Record<string, string>): Promise<void> {
  await set(TUS_URLS_KEY, urls);
}

export const sqliteUrlStorage: UrlStorage = {
  async findAllUploads(): Promise<PreviousUpload[]> {
    return [];
  },

  async findUploadsByFingerprint(fingerprint: string): Promise<PreviousUpload[]> {
    const urls = await readTusUrls();
    const url = urls[fingerprint];
    if (!url) return [];
    return [{
      uploadUrl: url,
      size: null,
      metadata: {},
      creationTime: new Date().toISOString(),
      urlStorageKey: fingerprint,
      parallelUploadUrls: null,
    }];
  },

  async removeUpload(fingerprint: string): Promise<void> {
    const urls = await readTusUrls();
    delete urls[fingerprint];
    await writeTusUrls(urls);
  },

  async addUpload(fingerprint: string, upload: PreviousUpload): Promise<string> {
    if (!upload.uploadUrl) return fingerprint;
    const urls = await readTusUrls();
    urls[fingerprint] = upload.uploadUrl;
    await writeTusUrls(urls);
    return fingerprint;
  },
};

export async function initLocalDb(): Promise<void> {
  await keys();
}

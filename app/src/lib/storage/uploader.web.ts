import * as tus from 'tus-js-client';
import {
  bucketName,
  getSupabaseAnonKey,
  getTusEndpoint,
} from '@/lib/supabase';
import {sqliteUrlStorage} from '@/lib/db/local';

const CHUNK_SIZE = 6 * 1024 * 1024;

export type UploadTarget = {
  uri: string;
  name: string;
  size: number;
  mime: string;
  storagePath: string;
  fingerprint: string;
  blob?: Blob;
};

export type UploadHandlers = {
  onProgress?: (bytesUploaded: number, bytesTotal: number) => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

async function fileToBlob(uri: string, blob?: Blob): Promise<Blob> {
  if (blob) return blob;
  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error(`Failed to read file for upload (${response.status})`);
  }
  return response.blob();
}

export type WebUploadController = {
  pause: () => void;
  resume: () => void;
  cancel: () => void;
};

export async function startWebUpload(
  target: UploadTarget,
  handlers: UploadHandlers = {},
): Promise<WebUploadController> {
  const blob = await fileToBlob(target.uri, target.blob);
  const endpoint = getTusEndpoint();
  const anonKey = getSupabaseAnonKey();

  const upload = new tus.Upload(blob, {
    endpoint,
    retryDelays: [0, 3000, 5000, 10000, 20000],
    chunkSize: CHUNK_SIZE,
    uploadLengthDeferred: false,
    removeFingerprintOnSuccess: true,
    uploadDataDuringCreation: true,
    fingerprint: () => Promise.resolve(target.fingerprint),
    urlStorage: sqliteUrlStorage,
    headers: {
      authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
      'x-upsert': 'true',
    },
    metadata: {
      bucketName,
      objectName: target.storagePath,
      contentType: target.mime,
      cacheControl: '3600',
    },
    onProgress: handlers.onProgress,
    onSuccess: () => handlers.onSuccess?.(),
    onError: (error) => handlers.onError?.(error),
  });

  const previous = await upload.findPreviousUploads();
  if (previous.length > 0) {
    upload.resumeFromPreviousUpload(previous[0]);
  }

  upload.start();

  return {
    pause: () => upload.abort(true),
    resume: () => upload.start(),
    cancel: () => upload.abort(true),
  };
}

export {sqliteUrlStorage};

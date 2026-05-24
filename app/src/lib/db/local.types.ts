export type LocalUploadStatus =
  | 'pending'
  | 'uploading'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type LocalUpload = {
  id: string;
  drop_id: string;
  file_id: string;
  uri: string;
  name: string;
  size: number;
  mime: string;
  storage_path: string;
  hash: string | null;
  bytes_uploaded: number;
  status: LocalUploadStatus;
  upload_id: string | null;
  s3_key: string | null;
  error: string | null;
  hash_algo: 'none' | 'blake3';
  created_at: string;
  updated_at: string;
};

export type UploadPart = {
  upload_id: string;
  part_number: number;
  etag: string;
};

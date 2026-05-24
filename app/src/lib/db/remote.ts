import type {AccessConfig} from '@/lib/access';
import {
  bucketName,
  getOwnerTokenSync,
  getSupabase,
  getSupabaseAnonKey,
  uploadsFunctionUrl,
  type ClaimBlobResult,
  type DatabaseDrop,
  type DatabaseFile,
  type DropWithFiles,
  type RecipientDrop,
} from '@/lib/supabase';

export function buildStoragePath(hash: string): string {
  return `blobs/${hash}`;
}

async function callUploadFunction<T>(
  route: 'create' | 'complete' | 'abort' | 'single',
  body: Record<string, unknown>,
): Promise<T> {
  if (!uploadsFunctionUrl) {
    throw new Error('Missing EXPO_PUBLIC_UPLOADS_FUNCTION_URL');
  }

  const ownerToken = getOwnerTokenSync();
  const response = await fetch(`${uploadsFunctionUrl}/${route}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getSupabaseAnonKey()}`,
      apikey: getSupabaseAnonKey(),
      ...(ownerToken ? {'x-owner-token': ownerToken} : {}),
    },
    body: JSON.stringify({ownerToken, ...body}),
  });

  const payload = (await response.json()) as {error?: string; message?: string};
  if (!response.ok) {
    throw new Error(
      payload.error ??
        payload.message ??
        `Upload function failed (${response.status})`,
    );
  }
  return payload as T;
}

export async function createDrop(access: AccessConfig): Promise<DatabaseDrop> {
  const supabase = getSupabase();
  const {data, error} = await supabase.rpc('create_drop', {
    p_access_mode: access.accessMode,
    p_allowed_emails: access.allowedEmails,
    p_password: access.password ?? null,
    p_expires_at: access.expiresAt ?? null,
    p_max_bytes: access.maxBytes ?? null,
    p_allowed_mime: access.allowedMime,
    p_max_files: access.maxFiles,
    p_hash_algo: access.hashAlgo,
  });

  if (error) throw error;
  return data as DatabaseDrop;
}

export async function addFile(input: {
  dropId: string;
  name: string;
  size: number;
  mime: string;
  hash?: string | null;
}): Promise<DatabaseFile> {
  const supabase = getSupabase();
  const {data, error} = await supabase
    .from('files')
    .insert({
      drop_id: input.dropId,
      name: input.name,
      size: input.size,
      mime: input.mime,
      hash: input.hash ?? null,
      status: 'pending',
      bytes_uploaded: 0,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as DatabaseFile;
}

export async function claimBlob(hash: string): Promise<ClaimBlobResult> {
  const supabase = getSupabase();
  const {data, error} = await supabase.rpc('claim_blob', {p_hash: hash});
  if (error) throw error;
  return data as ClaimBlobResult;
}

export async function finalizeUpload(
  fileId: string,
  hash: string,
  size: number,
  mime: string,
): Promise<DatabaseFile> {
  const supabase = getSupabase();
  const {data, error} = await supabase.rpc('finalize_upload', {
    p_file_id: fileId,
    p_hash: hash,
    p_size: size,
    p_mime: mime,
  });
  if (error) throw error;
  return data as DatabaseFile;
}

export async function attachFileToBlob(fileId: string, hash: string): Promise<DatabaseFile> {
  const supabase = getSupabase();
  const {data, error} = await supabase.rpc('attach_file_to_blob', {
    p_file_id: fileId,
    p_hash: hash,
  });
  if (error) throw error;
  return data as DatabaseFile;
}

export async function updateFileProgress(
  fileId: string,
  patch: Partial<Pick<DatabaseFile, 'status' | 'bytes_uploaded' | 'hash' | 'blob_hash'>>,
): Promise<void> {
  const supabase = getSupabase();
  const {error} = await supabase.from('files').update(patch).eq('id', fileId);
  if (error) throw error;
}

export async function completeFile(fileId: string, hash?: string | null): Promise<void> {
  await updateFileProgress(fileId, {
    status: 'completed',
    hash: hash ?? null,
    blob_hash: hash ?? null,
  });
}

export async function failFile(fileId: string, errorMessage: string): Promise<void> {
  const supabase = getSupabase();
  const {error} = await supabase.from('files').update({status: 'failed'}).eq('id', fileId);
  if (error) throw error;
  console.error('File upload failed:', fileId, errorMessage);
}

export type MultipartCreateResult = {
  uploadId: string;
  dbUploadId?: string;
  key: string;
  urls: string[];
  partCount?: number;
  deduplicated: boolean;
};

export type SingleUploadResult = {
  uploadId: string;
  key: string;
  url: string;
  deduplicated: boolean;
};

export async function createMultipartUpload(input: {
  fileId: string;
  hash: string;
  fileSize: number;
  chunkSize: number;
  mime: string;
}): Promise<MultipartCreateResult> {
  return callUploadFunction('create', input);
}

export async function singleUpload(input: {
  fileId: string;
  hash: string;
  mime: string;
  fileSize: number;
}): Promise<SingleUploadResult> {
  return callUploadFunction('single', input);
}

export async function completeMultipartUpload(input: {
  uploadId: string;
  key: string;
  fileId: string;
  hash: string;
  mime: string;
  fileSize: number;
  parts: Array<{partNumber: number; etag: string}>;
}): Promise<{ok: boolean}> {
  return callUploadFunction('complete', input);
}

export async function abortMultipartUpload(input: {
  uploadId: string;
  key: string;
  fileId: string;
}): Promise<{ok: boolean}> {
  return callUploadFunction('abort', input);
}

export async function listMyDrops(): Promise<DropWithFiles[]> {
  const supabase = getSupabase();
  const {data: drops, error: dropsError} = await supabase
    .from('drops')
    .select('*')
    .order('created_at', {ascending: false});

  if (dropsError) throw dropsError;
  if (!drops?.length) return [];

  const dropIds = drops.map((drop) => drop.id);
  const {data: files, error: filesError} = await supabase
    .from('files')
    .select('*')
    .in('drop_id', dropIds)
    .order('created_at', {ascending: true});

  if (filesError) throw filesError;

  return (drops as DatabaseDrop[]).map((drop) => ({
    ...drop,
    files: ((files ?? []) as DatabaseFile[]).filter((file) => file.drop_id === drop.id),
  }));
}

export async function getDrop(dropId: string): Promise<DropWithFiles | null> {
  const supabase = getSupabase();
  const {data: drop, error: dropError} = await supabase
    .from('drops')
    .select('*')
    .eq('id', dropId)
    .maybeSingle();

  if (dropError) throw dropError;
  if (!drop) return null;

  const {data: files, error: filesError} = await supabase
    .from('files')
    .select('*')
    .eq('drop_id', dropId)
    .order('created_at', {ascending: true});

  if (filesError) throw filesError;

  return {
    ...(drop as DatabaseDrop),
    files: (files ?? []) as DatabaseFile[],
  };
}

export async function deleteDropRemote(dropId: string): Promise<void> {
  const supabase = getSupabase();
  const {error} = await supabase.rpc('delete_drop', {p_drop_id: dropId});
  if (error) throw error;
}

export async function getDropForRecipient(
  dropId: string,
  options?: {password?: string; email?: string},
): Promise<RecipientDrop> {
  const supabase = getSupabase();
  const {data, error} = await supabase.rpc('get_drop_for_recipient', {
    p_drop_id: dropId,
    p_password: options?.password ?? null,
    p_email: options?.email ?? null,
  });

  if (error) throw error;
  return data as RecipientDrop;
}

export async function createSignedDownload(
  fileId: string,
  options?: {password?: string; email?: string},
): Promise<string> {
  const supabase = getSupabase();
  const {data: storagePath, error} = await supabase.rpc('authorize_file_download', {
    p_file_id: fileId,
    p_password: options?.password ?? null,
    p_email: options?.email ?? null,
  });

  if (error) throw error;
  if (!storagePath) throw new Error('Download not authorized');

  const {data: signed, error: signError} = await supabase.storage
    .from(bucketName)
    .createSignedUrl(storagePath as string, 3600);

  if (signError) throw signError;
  if (!signed?.signedUrl) throw new Error('Failed to create signed URL');
  return signed.signedUrl;
}

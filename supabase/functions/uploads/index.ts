import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  PutObjectCommand,
  UploadPartCommand,
  S3Client,
} from 'npm:@aws-sdk/client-s3@3';
import { getSignedUrl } from 'npm:@aws-sdk/s3-request-presigner@3';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-owner-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const BUCKET = Deno.env.get('STORAGE_BUCKET') ?? 'drops';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const S3_ACCESS_KEY = Deno.env.get('S3_ACCESS_KEY_ID') ?? '';
const S3_SECRET = Deno.env.get('S3_SECRET_ACCESS_KEY') ?? '';
const S3_REGION = Deno.env.get('S3_REGION') ?? 'us-east-1';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {...corsHeaders, 'Content-Type': 'application/json'},
  });
}

function error(message: string, status = 400) {
  return json({error: message}, status);
}

function getS3(): S3Client {
  const projectRef = new URL(SUPABASE_URL).hostname.split('.')[0];
  return new S3Client({
    forcePathStyle: true,
    region: S3_REGION,
    endpoint: `https://${projectRef}.storage.supabase.co/storage/v1/s3`,
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET,
    },
  });
}

function getAdmin() {
  return createClient(SUPABASE_URL, SERVICE_ROLE);
}

async function authorizeFile(ownerToken: string, fileId: string) {
  const admin = getAdmin();
  const {data: file, error: fileError} = await admin
    .from('files')
    .select('*, drops!inner(owner_token, id)')
    .eq('id', fileId)
    .maybeSingle();

  if (fileError) throw fileError;
  if (!file) throw new Error('File not found');

  const drop = file.drops as {owner_token: string; id: string};
  if (drop.owner_token !== ownerToken) {
    throw new Error('Not authorized');
  }

  return {file, dropId: drop.id};
}

async function handleCreate(body: Record<string, unknown>) {
  const ownerToken = String(body.ownerToken ?? '');
  const fileId = String(body.fileId ?? '');
  const hash = String(body.hash ?? '');
  const fileSize = Number(body.fileSize ?? 0);
  const chunkSize = Number(body.chunkSize ?? 6 * 1024 * 1024);
  const mime = String(body.mime ?? 'application/octet-stream');

  if (!ownerToken || !fileId || !hash || !fileSize) {
    return error('Missing required fields');
  }

  const {file} = await authorizeFile(ownerToken, fileId);
  const key = `blobs/${hash}`;

  const admin = getAdmin();
  const {data: existing} = await admin
    .from('file_blobs')
    .select('*')
    .eq('hash', hash)
    .maybeSingle();

  if (existing) {
    await admin
      .from('file_blobs')
      .update({ref_count: existing.ref_count + 1})
      .eq('hash', hash);
    await admin
      .from('files')
      .update({
        status: 'completed',
        blob_hash: hash,
        hash,
        bytes_uploaded: file.size,
        updated_at: new Date().toISOString(),
      })
      .eq('id', fileId);
    return json({deduplicated: true, key: existing.storage_path});
  }

  const s3 = getS3();
  const created = await s3.send(
    new CreateMultipartUploadCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: mime,
    }),
  );

  const uploadId = created.UploadId;
  if (!uploadId) return error('Failed to create multipart upload', 500);

  const partCount = Math.max(1, Math.ceil(fileSize / chunkSize));
  const urls: string[] = [];

  for (let partNumber = 1; partNumber <= partCount; partNumber++) {
    const url = await getSignedUrl(
      s3,
      new UploadPartCommand({
        Bucket: BUCKET,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
      }),
      {expiresIn: 3600},
    );
    urls.push(url);
  }

  const {data: row, error: insertError} = await admin
    .from('multipart_uploads')
    .insert({
      owner_token: ownerToken,
      file_id: fileId,
      s3_upload_id: uploadId,
      s3_key: key,
      size: fileSize,
      chunk_size: chunkSize,
      part_count: partCount,
      status: 'in_progress',
    })
    .select('id')
    .single();

  if (insertError) throw insertError;

  await admin
    .from('files')
    .update({status: 'uploading', hash, updated_at: new Date().toISOString()})
    .eq('id', fileId);

  return json({
    uploadId,
    dbUploadId: row.id,
    key,
    urls,
    partCount,
    deduplicated: false,
  });
}

async function handleSingle(body: Record<string, unknown>) {
  const ownerToken = String(body.ownerToken ?? '');
  const fileId = String(body.fileId ?? '');
  const hash = String(body.hash ?? '');
  const mime = String(body.mime ?? 'application/octet-stream');
  const fileSize = Number(body.fileSize ?? 0);

  if (!ownerToken || !fileId || !hash) {
    return error('Missing required fields');
  }

  await authorizeFile(ownerToken, fileId);
  const key = `blobs/${hash}`;

  const admin = getAdmin();
  const {data: existing} = await admin
    .from('file_blobs')
    .select('*')
    .eq('hash', hash)
    .maybeSingle();

  if (existing) {
    await admin
      .from('file_blobs')
      .update({ref_count: existing.ref_count + 1})
      .eq('hash', hash);
    await admin
      .from('files')
      .update({
        status: 'completed',
        blob_hash: hash,
        hash,
        bytes_uploaded: fileSize || existing.size,
        updated_at: new Date().toISOString(),
      })
      .eq('id', fileId);
    return json({deduplicated: true, key: existing.storage_path});
  }

  const s3 = getS3();
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: mime,
      ContentLength: fileSize || undefined,
    }),
    {expiresIn: 3600},
  );

  const uploadId = crypto.randomUUID();
  await admin.from('multipart_uploads').insert({
    owner_token: ownerToken,
    file_id: fileId,
    s3_upload_id: uploadId,
    s3_key: key,
    size: fileSize,
    chunk_size: fileSize,
    part_count: 1,
    status: 'in_progress',
  });

  await admin
    .from('files')
    .update({status: 'uploading', hash, updated_at: new Date().toISOString()})
    .eq('id', fileId);

  return json({uploadId, key, url, deduplicated: false});
}

async function handleComplete(body: Record<string, unknown>) {
  const ownerToken = String(body.ownerToken ?? '');
  const uploadId = String(body.uploadId ?? '');
  const key = String(body.key ?? '');
  const fileId = String(body.fileId ?? '');
  const hash = String(body.hash ?? '');
  const mime = String(body.mime ?? 'application/octet-stream');
  const fileSize = Number(body.fileSize ?? 0);
  const parts = (body.parts as Array<{partNumber: number; etag: string}>) ?? [];

  if (!ownerToken || !uploadId || !key || !fileId || !hash) {
    return error('Missing required fields');
  }

  await authorizeFile(ownerToken, fileId);
  const admin = getAdmin();
  const s3 = getS3();

  if (parts.length > 0) {
    await s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: BUCKET,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts.map((p) => ({
            ETag: p.etag,
            PartNumber: p.partNumber,
          })),
        },
      }),
    );
  }

  const {data: existingBlob} = await admin
    .from('file_blobs')
    .select('*')
    .eq('hash', hash)
    .maybeSingle();

  if (!existingBlob) {
    await admin.from('file_blobs').insert({
      hash,
      storage_path: key,
      size: fileSize,
      mime,
      ref_count: 1,
    });
  } else {
    await admin
      .from('file_blobs')
      .update({ref_count: existingBlob.ref_count + 1})
      .eq('hash', hash);
  }

  await admin
    .from('files')
    .update({
      status: 'completed',
      blob_hash: hash,
      hash,
      bytes_uploaded: fileSize,
      updated_at: new Date().toISOString(),
    })
    .eq('id', fileId);

  await admin
    .from('multipart_uploads')
    .update({status: 'completed', parts, updated_at: new Date().toISOString()})
    .eq('s3_upload_id', uploadId)
    .eq('owner_token', ownerToken);

  return json({ok: true});
}

async function handleAbort(body: Record<string, unknown>) {
  const ownerToken = String(body.ownerToken ?? '');
  const uploadId = String(body.uploadId ?? '');
  const key = String(body.key ?? '');
  const fileId = String(body.fileId ?? '');

  if (!ownerToken || !uploadId || !key || !fileId) {
    return error('Missing required fields');
  }

  await authorizeFile(ownerToken, fileId);

  const s3 = getS3();
  try {
    await s3.send(
      new AbortMultipartUploadCommand({
        Bucket: BUCKET,
        Key: key,
        UploadId: uploadId,
      }),
    );
  } catch {
    // ignore if already aborted
  }

  const admin = getAdmin();
  await admin
    .from('files')
    .update({status: 'failed', updated_at: new Date().toISOString()})
    .eq('id', fileId);

  await admin
    .from('multipart_uploads')
    .update({status: 'aborted', updated_at: new Date().toISOString()})
    .eq('s3_upload_id', uploadId)
    .eq('owner_token', ownerToken);

  return json({ok: true});
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {headers: corsHeaders});
  }

  if (req.method !== 'POST') {
    return error('Method not allowed', 405);
  }

  try {
    const url = new URL(req.url);
    const route = url.pathname.split('/').pop() ?? '';
    const body = await req.json();

    switch (route) {
      case 'create':
        return await handleCreate(body);
      case 'single':
        return await handleSingle(body);
      case 'complete':
        return await handleComplete(body);
      case 'abort':
        return await handleAbort(body);
      default:
        return error('Unknown route', 404);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    console.error(err);
    return error(message, 500);
  }
});

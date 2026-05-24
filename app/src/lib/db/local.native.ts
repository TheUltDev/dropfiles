import * as SQLite from 'expo-sqlite';
import type {PreviousUpload, UrlStorage} from 'tus-js-client';
import type {LocalUpload, LocalUploadStatus, UploadPart} from '@/lib/db/local.types';

export type {LocalUpload, LocalUploadStatus, UploadPart} from '@/lib/db/local.types';

const DB_NAME = 'dropfiles.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS uploads (
          id TEXT PRIMARY KEY NOT NULL,
          drop_id TEXT NOT NULL,
          file_id TEXT NOT NULL,
          uri TEXT NOT NULL,
          name TEXT NOT NULL,
          size INTEGER NOT NULL,
          mime TEXT NOT NULL,
          storage_path TEXT NOT NULL,
          hash TEXT,
          bytes_uploaded INTEGER NOT NULL DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'pending',
          upload_id TEXT,
          s3_key TEXT,
          error TEXT,
          hash_algo TEXT NOT NULL DEFAULT 'none',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS tus_urls (
          fingerprint TEXT PRIMARY KEY NOT NULL,
          url TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS upload_parts (
          upload_id TEXT NOT NULL,
          part_number INTEGER NOT NULL,
          etag TEXT NOT NULL,
          PRIMARY KEY (upload_id, part_number)
        );
        CREATE INDEX IF NOT EXISTS uploads_status_idx ON uploads(status);
        CREATE INDEX IF NOT EXISTS uploads_drop_id_idx ON uploads(drop_id);
      `);
      return db;
    })();
  }
  return dbPromise;
}

function rowToUpload(row: Record<string, unknown>): LocalUpload {
  return {
    id: String(row.id),
    drop_id: String(row.drop_id),
    file_id: String(row.file_id),
    uri: String(row.uri),
    name: String(row.name),
    size: Number(row.size),
    mime: String(row.mime),
    storage_path: String(row.storage_path),
    hash: row.hash ? String(row.hash) : null,
    bytes_uploaded: Number(row.bytes_uploaded),
    status: row.status as LocalUploadStatus,
    upload_id: row.upload_id ? String(row.upload_id) : null,
    s3_key: row.s3_key ? String(row.s3_key) : null,
    error: row.error ? String(row.error) : null,
    hash_algo: (row.hash_algo as LocalUpload['hash_algo']) ?? 'none',
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function insertUpload(upload: LocalUpload): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO uploads (
      id, drop_id, file_id, uri, name, size, mime, storage_path, hash,
      bytes_uploaded, status, upload_id, s3_key, error, hash_algo, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      upload.id,
      upload.drop_id,
      upload.file_id,
      upload.uri,
      upload.name,
      upload.size,
      upload.mime,
      upload.storage_path,
      upload.hash,
      upload.bytes_uploaded,
      upload.status,
      upload.upload_id,
      upload.s3_key,
      upload.error,
      upload.hash_algo,
      upload.created_at,
      upload.updated_at,
    ],
  );
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
  const db = await getDb();
  const fields: string[] = [];
  const values: SQLite.SQLiteBindValue[] = [];

  for (const [key, value] of Object.entries(patch)) {
    fields.push(`${key} = ?`);
    values.push(value as SQLite.SQLiteBindValue);
  }

  if (fields.length === 0) return;

  values.push(id);
  await db.runAsync(`UPDATE uploads SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function getUpload(id: string): Promise<LocalUpload | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM uploads WHERE id = ?',
    [id],
  );
  return row ? rowToUpload(row) : null;
}

export async function listUploads(filter?: {
  status?: LocalUploadStatus[];
  dropId?: string;
}): Promise<LocalUpload[]> {
  const db = await getDb();
  let rows: Record<string, unknown>[];

  if (filter?.dropId && filter.status?.length) {
    rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM uploads WHERE drop_id = ? AND status IN (${filter.status.map(() => '?').join(', ')}) ORDER BY created_at ASC`,
      [filter.dropId, ...filter.status],
    );
  } else if (filter?.dropId) {
    rows = await db.getAllAsync<Record<string, unknown>>(
      'SELECT * FROM uploads WHERE drop_id = ? ORDER BY created_at ASC',
      [filter.dropId],
    );
  } else if (filter?.status?.length) {
    rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM uploads WHERE status IN (${filter.status.map(() => '?').join(', ')}) ORDER BY created_at ASC`,
      filter.status,
    );
  } else {
    rows = await db.getAllAsync<Record<string, unknown>>(
      'SELECT * FROM uploads ORDER BY created_at ASC',
    );
  }

  return rows.map(rowToUpload);
}

export async function deleteUpload(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM uploads WHERE id = ?', [id]);
}

export async function deleteUploadsForDrop(dropId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM uploads WHERE drop_id = ?', [dropId]);
}

export async function saveUploadParts(parts: UploadPart[]): Promise<void> {
  const db = await getDb();
  for (const part of parts) {
    await db.runAsync(
      'INSERT OR REPLACE INTO upload_parts (upload_id, part_number, etag) VALUES (?, ?, ?)',
      [part.upload_id, part.part_number, part.etag],
    );
  }
}

export async function getUploadParts(uploadId: string): Promise<UploadPart[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{upload_id: string; part_number: number; etag: string}>(
    'SELECT * FROM upload_parts WHERE upload_id = ? ORDER BY part_number ASC',
    [uploadId],
  );
  return rows;
}

export const sqliteUrlStorage: UrlStorage = {
  async findAllUploads(): Promise<PreviousUpload[]> {
    return [];
  },

  async findUploadsByFingerprint(fingerprint: string): Promise<PreviousUpload[]> {
    const db = await getDb();
    const row = await db.getFirstAsync<{url: string}>(
      'SELECT url FROM tus_urls WHERE fingerprint = ?',
      [fingerprint],
    );
    if (!row) return [];
    return [{
      uploadUrl: row.url,
      size: null,
      metadata: {},
      creationTime: new Date().toISOString(),
      urlStorageKey: fingerprint,
      parallelUploadUrls: null,
    }];
  },

  async removeUpload(fingerprint: string): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM tus_urls WHERE fingerprint = ?', [fingerprint]);
  },

  async addUpload(fingerprint: string, upload: PreviousUpload): Promise<string> {
    if (!upload.uploadUrl) return fingerprint;
    const db = await getDb();
    await db.runAsync(
      'INSERT OR REPLACE INTO tus_urls (fingerprint, url) VALUES (?, ?)',
      [fingerprint, upload.uploadUrl],
    );
    return fingerprint;
  },
};

export async function initLocalDb(): Promise<void> {
  await getDb();
}

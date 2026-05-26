import type {SupabaseClient} from '@supabase/supabase-js';
import {createClient} from '@supabase/supabase-js';
import {getOwnerToken} from '@/lib/identity';

export type DatabaseDrop = {
  id: string;
  owner_token: string;
  access_mode: 'anyone' | 'link' | 'email' | 'password';
  allowed_emails: string[];
  password_hash: string | null;
  expires_at: string | null;
  max_bytes: number | null;
  allowed_mime: string[];
  max_files: number;
  hash_algo: 'none' | 'blake3';
  created_at: string;
  updated_at: string;
};

export type DatabaseFile = {
  id: string;
  drop_id: string;
  name: string;
  size: number;
  mime: string;
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'failed';
  bytes_uploaded: number;
  hash: string | null;
  blob_hash: string | null;
  created_at: string;
  updated_at: string;
};

export type DropWithFiles = DatabaseDrop & {
  files: DatabaseFile[];
};

export type RecipientDrop = {
  id: string;
  access_mode: DatabaseDrop['access_mode'];
  expires_at: string | null;
  max_files: number;
  hash_algo: DatabaseDrop['hash_algo'];
  files: Array<{
    id: string;
    name: string;
    size: number;
    mime: string;
    status: DatabaseFile['status'];
    hash: string | null;
  }>;
};

export type ClaimBlobResult = {
  exists: boolean;
  storage_path?: string;
  size?: number;
  mime?: string;
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const bucketName = process.env.EXPO_PUBLIC_BUCKET ?? 'drops';
export const uploadsFunctionUrl = process.env.EXPO_PUBLIC_UPLOADS_FUNCTION_URL ?? '';

let client: SupabaseClient | null = null;
let ownerToken: string | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY');
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: ownerToken ? {'x-owner-token': ownerToken} : {},
      },
    });
  }
  return client;
}

export async function initSupabase(): Promise<SupabaseClient> {
  ownerToken = await getOwnerToken();
  client = null;
  return getSupabase();
}

export function getTusEndpoint(): string {
  const base = supabaseUrl.replace(/\/$/, '');
  const projectRef = base.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  if (projectRef) {
    return `https://${projectRef}.storage.supabase.co/storage/v1/upload/resumable`;
  }
  return `${base}/storage/v1/upload/resumable`;
}

export function getSupabaseAnonKey(): string {
  return supabaseAnonKey;
}

export function getOwnerTokenSync(): string | null {
  return ownerToken;
}

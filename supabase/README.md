# Supabase setup for Dropfiles

**Project:** [dropfiles](https://supabase.com/dashboard/project/zperyjgrxiqbzepsyckz) (`zperyjgrxiqbzepsyckz`, us-east-1)

## What's deployed

| Resource | Status |
|----------|--------|
| Schema (drops, files, file_blobs, multipart_uploads) | Applied |
| RLS + RPCs | Applied |
| Storage bucket `drops` | Created (private, 5 GB limit) |
| Storage policies (TUS uploads to `blobs/*`) | Applied |
| Edge Function `uploads` | Deployed (`verify_jwt = false`; owner-token auth in function) |

## 1. Create project

Already created via Supabase MCP as **dropfiles** in org KATTAX.

## 2. Apply migration

Migrations live in [`migrations/`](./migrations/). Applied remotely via MCP; re-apply locally with:

```bash
supabase link --project-ref zperyjgrxiqbzepsyckz
supabase db push
```

## 3. Storage bucket + S3 protocol (native uploads)

The migration creates a private `drops` bucket. For **native multipart uploads**, enable the S3 protocol in the dashboard:

1. [Storage → Configuration → S3](https://supabase.com/dashboard/project/zperyjgrxiqbzepsyckz/storage/settings)
2. Enable S3 connection and create access keys
3. Set Edge Function secrets (see below)

## 4. Edge Function secrets

The `uploads` function is deployed. Set secrets via CLI:

```bash
supabase link --project-ref zperyjgrxiqbzepsyckz
# PowerShell (single line — backslash continuations don't work in PS)
supabase secrets set S3_ACCESS_KEY_ID=... S3_SECRET_ACCESS_KEY=... S3_REGION=us-east-1 STORAGE_BUCKET=drops

# bash
supabase secrets set \
  S3_ACCESS_KEY_ID=... \
  S3_SECRET_ACCESS_KEY=... \
  S3_REGION=us-east-1 \
  STORAGE_BUCKET=drops
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically by Supabase.

## 5. App env

Copy [`app/.env.example`](../app/.env.example) to `app/.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://zperyjgrxiqbzepsyckz.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon key from dashboard>
EXPO_PUBLIC_BUCKET=drops
EXPO_PUBLIC_UPLOADS_FUNCTION_URL=https://zperyjgrxiqbzepsyckz.supabase.co/functions/v1/uploads
```

## 6. Native builds

Nitro modules require a dev client (not Expo Go):

```bash
cd app
npx expo prebuild
npx expo run:ios   # or run:android
```

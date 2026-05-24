-- Storage RLS for TUS resumable uploads and signed downloads

create policy "drops_blob_insert" on storage.objects
for insert to anon, authenticated
with check (
  bucket_id = 'drops' and
  (storage.foldername(name))[1] = 'blobs'
);

create policy "drops_blob_select" on storage.objects
for select to anon, authenticated
using (
  bucket_id = 'drops' and
  (storage.foldername(name))[1] = 'blobs'
);

create policy "drops_blob_update" on storage.objects
for update to anon, authenticated
using (
  bucket_id = 'drops' and
  (storage.foldername(name))[1] = 'blobs'
);

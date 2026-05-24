-- Dropfiles schema: content-addressed file drops with deduplication

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.drops (
  id uuid primary key default gen_random_uuid(),
  owner_token text not null,
  access_mode text not null check (access_mode in ('anyone', 'link', 'email', 'password')),
  allowed_emails text[] not null default '{}',
  password_hash text,
  expires_at timestamptz,
  max_bytes bigint,
  allowed_mime text[] not null default '{}',
  max_files int not null default 1,
  hash_algo text not null default 'blake3' check (hash_algo in ('none', 'blake3')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.file_blobs (
  hash text primary key,
  storage_path text not null unique,
  size bigint not null,
  mime text not null,
  ref_count int not null default 0,
  created_at timestamptz not null default now()
);

create table public.files (
  id uuid primary key default gen_random_uuid(),
  drop_id uuid not null references public.drops(id) on delete cascade,
  name text not null,
  size bigint not null,
  mime text not null,
  status text not null default 'pending'
    check (status in ('pending', 'uploading', 'paused', 'completed', 'failed')),
  bytes_uploaded bigint not null default 0,
  hash text,
  blob_hash text references public.file_blobs(hash),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.multipart_uploads (
  id uuid primary key default gen_random_uuid(),
  owner_token text not null,
  file_id uuid not null references public.files(id) on delete cascade,
  s3_upload_id text not null,
  s3_key text not null,
  size bigint not null,
  chunk_size int not null,
  part_count int not null,
  parts jsonb not null default '[]',
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed', 'aborted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index files_drop_id_idx on public.files(drop_id);
create index files_blob_hash_idx on public.files(blob_hash);
create index drops_owner_token_idx on public.drops(owner_token);
create index multipart_owner_idx on public.multipart_uploads(owner_token);
create index multipart_file_id_idx on public.multipart_uploads(file_id);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.request_owner_token()
returns text
language sql
stable
as $$
  select coalesce(
    current_setting('request.headers', true)::jsonb->>'x-owner-token',
    ''
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger drops_updated_at
  before update on public.drops
  for each row execute function public.set_updated_at();

create trigger files_updated_at
  before update on public.files
  for each row execute function public.set_updated_at();

create trigger multipart_uploads_updated_at
  before update on public.multipart_uploads
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.drops enable row level security;
alter table public.files enable row level security;
alter table public.file_blobs enable row level security;
alter table public.multipart_uploads enable row level security;

create policy drops_owner_select on public.drops
  for select using (owner_token = public.request_owner_token());

create policy drops_owner_insert on public.drops
  for insert with check (owner_token = public.request_owner_token());

create policy drops_owner_update on public.drops
  for update using (owner_token = public.request_owner_token());

create policy drops_owner_delete on public.drops
  for delete using (owner_token = public.request_owner_token());

create policy files_owner_select on public.files
  for select using (
    exists (
      select 1 from public.drops d
      where d.id = files.drop_id
        and d.owner_token = public.request_owner_token()
    )
  );

create policy files_owner_insert on public.files
  for insert with check (
    exists (
      select 1 from public.drops d
      where d.id = files.drop_id
        and d.owner_token = public.request_owner_token()
    )
  );

create policy files_owner_update on public.files
  for update using (
    exists (
      select 1 from public.drops d
      where d.id = files.drop_id
        and d.owner_token = public.request_owner_token()
    )
  );

create policy files_owner_delete on public.files
  for delete using (
    exists (
      select 1 from public.drops d
      where d.id = files.drop_id
        and d.owner_token = public.request_owner_token()
    )
  );

create policy multipart_owner_select on public.multipart_uploads
  for select using (owner_token = public.request_owner_token());

-- file_blobs: no direct client access
create policy file_blobs_deny_all on public.file_blobs
  for all using (false);

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------

create or replace function public.create_drop(
  p_access_mode text,
  p_allowed_emails text[] default '{}',
  p_password text default null,
  p_expires_at timestamptz default null,
  p_max_bytes bigint default null,
  p_allowed_mime text[] default '{}',
  p_max_files int default 1,
  p_hash_algo text default 'blake3'
)
returns public.drops
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_owner text := public.request_owner_token();
  v_row public.drops;
begin
  if v_owner = '' then
    raise exception 'Missing owner token';
  end if;

  insert into public.drops (
    owner_token, access_mode, allowed_emails, password_hash,
    expires_at, max_bytes, allowed_mime, max_files, hash_algo
  ) values (
    v_owner,
    p_access_mode,
    coalesce(p_allowed_emails, '{}'),
    case when p_password is not null and p_password <> ''
      then crypt(p_password, gen_salt('bf'))
      else null
    end,
    p_expires_at,
    p_max_bytes,
    coalesce(p_allowed_mime, '{}'),
    coalesce(p_max_files, 1),
    coalesce(p_hash_algo, 'blake3')
  )
  returning * into v_row;

  return v_row;
end;
$$;

create or replace function public.claim_blob(p_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_blob public.file_blobs;
begin
  select * into v_blob from public.file_blobs where hash = p_hash;
  if found then
    return jsonb_build_object(
      'exists', true,
      'storage_path', v_blob.storage_path,
      'size', v_blob.size,
      'mime', v_blob.mime
    );
  end if;
  return jsonb_build_object('exists', false);
end;
$$;

create or replace function public.attach_file_to_blob(
  p_file_id uuid,
  p_hash text
)
returns public.files
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_owner text := public.request_owner_token();
  v_file public.files;
  v_blob public.file_blobs;
begin
  select f.* into v_file
  from public.files f
  join public.drops d on d.id = f.drop_id
  where f.id = p_file_id and d.owner_token = v_owner;

  if not found then
    raise exception 'File not found or not authorized';
  end if;

  select * into v_blob from public.file_blobs where hash = p_hash;
  if not found then
    raise exception 'Blob not found';
  end if;

  update public.file_blobs
  set ref_count = ref_count + 1
  where hash = p_hash;

  update public.files
  set
    blob_hash = p_hash,
    hash = p_hash,
    status = 'completed',
    bytes_uploaded = v_file.size,
    updated_at = now()
  where id = p_file_id
  returning * into v_file;

  return v_file;
end;
$$;

create or replace function public.get_drop_for_recipient(
  p_drop_id uuid,
  p_password text default null,
  p_email text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_drop public.drops;
  v_files jsonb;
begin
  select * into v_drop from public.drops where id = p_drop_id;
  if not found then
    raise exception 'Drop not found';
  end if;

  if v_drop.expires_at is not null and v_drop.expires_at < now() then
    raise exception 'Drop has expired';
  end if;

  if v_drop.access_mode = 'password' then
    if p_password is null or v_drop.password_hash is null
      or crypt(p_password, v_drop.password_hash) <> v_drop.password_hash then
      raise exception 'Invalid password';
    end if;
  elsif v_drop.access_mode = 'email' then
    if p_email is null or not (lower(p_email) = any(v_drop.allowed_emails)) then
      raise exception 'Email not authorized';
    end if;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id,
    'name', f.name,
    'size', f.size,
    'mime', f.mime,
    'status', f.status,
    'hash', f.hash
  ) order by f.created_at), '[]'::jsonb)
  into v_files
  from public.files f
  where f.drop_id = p_drop_id and f.status = 'completed';

  return jsonb_build_object(
    'id', v_drop.id,
    'access_mode', v_drop.access_mode,
    'expires_at', v_drop.expires_at,
    'max_files', v_drop.max_files,
    'hash_algo', v_drop.hash_algo,
    'files', v_files
  );
end;
$$;

create or replace function public.authorize_file_download(
  p_file_id uuid,
  p_password text default null,
  p_email text default null
)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_file public.files;
  v_drop public.drops;
  v_path text;
begin
  select f.* into v_file from public.files f where f.id = p_file_id;
  if not found or v_file.status <> 'completed' or v_file.blob_hash is null then
    raise exception 'File not available';
  end if;

  select * into v_drop from public.drops where id = v_file.drop_id;
  if not found then
    raise exception 'Drop not found';
  end if;

  if v_drop.expires_at is not null and v_drop.expires_at < now() then
    raise exception 'Drop has expired';
  end if;

  if v_drop.access_mode = 'password' then
    if p_password is null or v_drop.password_hash is null
      or crypt(p_password, v_drop.password_hash) <> v_drop.password_hash then
      raise exception 'Invalid password';
    end if;
  elsif v_drop.access_mode = 'email' then
    if p_email is null or not (lower(p_email) = any(v_drop.allowed_emails)) then
      raise exception 'Email not authorized';
    end if;
  end if;

  select storage_path into v_path
  from public.file_blobs
  where hash = v_file.blob_hash;

  if v_path is null then
    raise exception 'Storage path not found';
  end if;

  return v_path;
end;
$$;

create or replace function public.delete_drop(p_drop_id uuid)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_owner text := public.request_owner_token();
  v_blob_hash text;
begin
  if not exists (
    select 1 from public.drops
    where id = p_drop_id and owner_token = v_owner
  ) then
    raise exception 'Drop not found or not authorized';
  end if;

  for v_blob_hash in
    select distinct blob_hash from public.files
    where drop_id = p_drop_id and blob_hash is not null
  loop
    update public.file_blobs
    set ref_count = greatest(0, ref_count - 1)
    where hash = v_blob_hash;
  end loop;

  delete from public.drops where id = p_drop_id;
end;
$$;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.drops to anon, authenticated;
grant select, insert, update, delete on public.files to anon, authenticated;
grant select on public.multipart_uploads to anon, authenticated;
grant execute on function public.create_drop to anon, authenticated;
grant execute on function public.claim_blob to anon, authenticated;
grant execute on function public.attach_file_to_blob to anon, authenticated;
grant execute on function public.get_drop_for_recipient to anon, authenticated;
grant execute on function public.authorize_file_download to anon, authenticated;
create or replace function public.finalize_upload(
  p_file_id uuid,
  p_hash text,
  p_size bigint,
  p_mime text
)
returns public.files
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_owner text := public.request_owner_token();
  v_file public.files;
  v_blob public.file_blobs;
begin
  select f.* into v_file
  from public.files f
  join public.drops d on d.id = f.drop_id
  where f.id = p_file_id and d.owner_token = v_owner;

  if not found then
    raise exception 'File not found or not authorized';
  end if;

  select * into v_blob from public.file_blobs where hash = p_hash;
  if not found then
    insert into public.file_blobs (hash, storage_path, size, mime, ref_count)
    values (p_hash, 'blobs/' || p_hash, p_size, p_mime, 1);
  else
    update public.file_blobs
    set ref_count = ref_count + 1
    where hash = p_hash;
  end if;

  update public.files
  set
    blob_hash = p_hash,
    hash = p_hash,
    status = 'completed',
    bytes_uploaded = p_size,
    updated_at = now()
  where id = p_file_id
  returning * into v_file;

  return v_file;
end;
$$;

grant execute on function public.finalize_upload to anon, authenticated;

grant execute on function public.delete_drop to anon, authenticated;

-- Storage bucket (run via dashboard or supabase CLI if migration bucket creation fails)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('drops', 'drops', false, 5368709120, null)
on conflict (id) do nothing;

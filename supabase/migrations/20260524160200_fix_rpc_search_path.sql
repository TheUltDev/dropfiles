-- pgcrypto lives in the extensions schema; security definer RPCs must include it.

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

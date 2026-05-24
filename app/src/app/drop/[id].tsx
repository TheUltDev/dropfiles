import {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {Button} from 'heroui-native';
import {Title, Muted} from '@/components/base/text';
import {DropShareCard} from '@/components/upload/DropShareCard';
import {FileProgressItem} from '@/components/upload/FileProgressItem';
import {DEFAULT_ACCESS_CONFIG, type AccessConfig} from '@/lib/access';
import {deleteDropRemote, getDrop} from '@/lib/db/remote';
import {deleteUploadsForDrop} from '@/lib/db/local';
import {useDropUploads} from '@/lib/storage/store';
import type {DropWithFiles} from '@/lib/supabase';

export default function DropDetailScreen() {
  const router = useRouter();
  const {id} = useLocalSearchParams<{id: string}>();
  const uploads = useDropUploads(id ?? '');
  const [drop, setDrop] = useState<DropWithFiles | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getDrop(id);
      setDrop(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load drop');
    }
  }, [id]);

  useEffect(() => {
    void load();
    const interval = setInterval(() => {
      void load();
    }, 5000);
    return () => clearInterval(interval);
  }, [load]);

  const access: AccessConfig = useMemo(() => {
    if (!drop) return DEFAULT_ACCESS_CONFIG;
    return {
      accessMode: drop.access_mode,
      allowedEmails: drop.allowed_emails,
      expiresAt: drop.expires_at,
      maxBytes: drop.max_bytes,
      allowedMime: drop.allowed_mime,
      maxFiles: drop.max_files,
      hashAlgo: drop.hash_algo,
    };
  }, [drop]);

  async function handleDelete() {
    if (!id) return;
    try {
      setDeleting(true);
      await deleteDropRemote(id);
      await deleteUploadsForDrop(id);
      router.replace('/files');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete drop');
    } finally {
      setDeleting(false);
    }
  }

  if (!id) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Muted>Missing drop id</Muted>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="max-w-[800px] gap-6 px-6 pt-safe pb-safe-offset-8 self-center w-full">
        <View className="gap-2">
          <Title>Drop progress</Title>
          <Muted>
            {uploads.filter((u) => u.status === 'completed').length} / {uploads.length} uploaded
          </Muted>
        </View>

        <DropShareCard dropId={id} access={access} expiresAt={drop?.expires_at} />

        <View className="gap-3">
          {uploads.map((upload) => (
            <FileProgressItem key={upload.id} upload={upload} />
          ))}
        </View>

        {error ? <Muted className="text-danger">{error}</Muted> : null}

        <Button variant="danger" onPress={handleDelete} isDisabled={deleting}>
          {deleting ? 'Deleting…' : 'Delete drop'}
        </Button>
      </ScrollView>
    </View>
  );
}

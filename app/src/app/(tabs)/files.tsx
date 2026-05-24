import {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import {useRouter, type Href} from 'expo-router';
import {Button} from '@/components/ui/Button';
import {Title, Body, Muted, Small} from '@/components/base/text';
import {listMyDrops} from '@/lib/db/remote';
import type {DropWithFiles} from '@/lib/supabase';
import {formatBytes} from '@/lib/pickers';
import {summarizeAccess} from '@/lib/access';

export default function FilesScreen() {
  const router = useRouter();
  const [drops, setDrops] = useState<DropWithFiles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await listMyDrops();
      setDrops(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load drops');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        contentContainerClassName="max-w-[800px] gap-4 px-6 pt-safe pb-safe-offset-8 self-center w-full">
        <View className="flex-row items-center justify-between pt-4">
          <Title className="text-3xl">Files</Title>
          <Button size="sm" onPress={() => router.push('/(drop)/new' as Href)}>
            New
          </Button>
        </View>

        {error ? <Muted className="text-danger">{error}</Muted> : null}

        {!loading && drops.length === 0 ? (
          <View className="rounded-3xl bg-surface-secondary p-6">
            <Body className="font-semibold">No drops yet</Body>
            <Muted className="mt-1">Create your first drop to start sharing files.</Muted>
          </View>
        ) : null}

        {drops.map((drop) => {
          const totalBytes = drop.files.reduce((sum, file) => sum + file.size, 0);
          const completed = drop.files.filter((file) => file.status === 'completed').length;
          return (
            <View
              key={drop.id}
              className="gap-2 rounded-3xl bg-surface-secondary p-5"
              onTouchEnd={() => router.push(`/drop/${drop.id}` as Href)}>
              <View className="flex-row items-center justify-between">
                <Small className="font-semibold">{drop.id.slice(0, 8)}…</Small>
                <Muted>
                  {completed}/{drop.files.length} files
                </Muted>
              </View>
              <Muted>
                {summarizeAccess({
                  accessMode: drop.access_mode,
                  allowedEmails: drop.allowed_emails,
                  expiresAt: drop.expires_at,
                  maxBytes: drop.max_bytes,
                  allowedMime: drop.allowed_mime,
                  maxFiles: drop.max_files,
                  hashAlgo: drop.hash_algo,
                })}{' '}
                · {formatBytes(totalBytes)}
              </Muted>
              <Muted>{new Date(drop.created_at).toLocaleString()}</Muted>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

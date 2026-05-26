import type {DropWithFiles} from '@/lib/supabase';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import {Title, Body, Muted, Small} from '@/components/base/text';
import {listMyDrops} from '@/lib/db/remote';
import {formatBytes} from '@/lib/pickers';

export default function UsageScreen() {
  const [loading, setLoading] = useState(true);
  const [drops, setDrops] = useState<DropWithFiles[]>([]);
  const stats = useMemo(() => {
    const files = drops.flatMap((drop) => drop.files);
    const completed = files.filter((file) => file.status === 'completed');
    const deduped = completed.filter((file) => file.blob_hash).length;
    const totalBytes = completed.reduce((sum, file) => sum + file.size, 0);
    return {
      dropCount: drops.length,
      fileCount: files.length,
      completedCount: completed.length,
      totalBytes,
      deduped,
    };
  }, [drops]);

  const load = useCallback(async () => {
    try {
      const data = await listMyDrops();
      setDrops(data);
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
        <View className="gap-2 pt-4">
          <Title className="text-3xl">Usage</Title>
          <Muted>Storage and upload activity for this device.</Muted>
        </View>
        <View className="gap-3 rounded-3xl bg-surface-secondary p-5">
          <Stat label="Drops" value={String(stats.dropCount)} />
          <Stat label="Files" value={`${stats.completedCount}/${stats.fileCount}`} />
          <Stat label="Uploaded" value={formatBytes(stats.totalBytes)} />
          <Stat label="Content-addressed" value={String(stats.deduped)} />
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({label, value}: {label: string; value: string}) {
  return (
    <View className="flex-row items-center justify-between">
      <Small className="text-muted">{label}</Small>
      <Body className="font-semibold">{value}</Body>
    </View>
  );
}

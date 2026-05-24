import {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useRouter, type Href} from 'expo-router';
import {Button} from '@/components/ui/Button';
import {Title, Subtitle, Body, Muted, Small} from '@/components/base/text';
import {useActiveUploads} from '@/lib/storage/store';
import {formatBytes} from '@/lib/pickers';

export default function HomeScreen() {
  const router = useRouter();
  const activeUploads = useActiveUploads();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="max-w-[800px] gap-6 px-6 pt-safe pb-safe-offset-8 self-center w-full">
        <View className="gap-2 pt-4">
          <Title>Dropfiles</Title>
          <Subtitle className="text-muted">Send large files with resume and deduplication</Subtitle>
        </View>

        <View className="gap-4 rounded-3xl bg-surface-secondary p-6">
          <Body className="font-semibold">Start a new drop</Body>
          <Muted>
            Pick files, set access rules, and share a link. Uploads resume automatically on web
            and in the background on mobile.
          </Muted>
          <Button onPress={() => router.push('/(drop)/new' as Href)}>New drop</Button>
        </View>

        {ready && activeUploads.length > 0 ? (
          <View className="gap-3">
            <Body className="font-semibold">In progress</Body>
            {activeUploads.map((upload) => (
              <View
                key={upload.id}
                className="rounded-2xl bg-surface-secondary px-4 py-3"
                onTouchEnd={() => router.push(`/drop/${upload.drop_id}` as Href)}>
                <Small className="font-semibold">{upload.name}</Small>
                <Muted>
                  {formatBytes(upload.bytes_uploaded)} / {formatBytes(upload.size)} ·{' '}
                  {upload.status}
                </Muted>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

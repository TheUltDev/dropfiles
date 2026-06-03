import type {Href} from 'expo-router';
import {Pressable, View} from 'react-native';
import {useRouter} from 'expo-router';
import {TestScaffold, TEST_PAGES} from '@/components/test/scaffold';
import {Body, Muted} from '@/components/base/text';

export default function TestIndexScreen() {
  const router = useRouter();

  return (
    <TestScaffold title="Test" subtitle="Component catalog">
      <View className="gap-3">
        {TEST_PAGES.map((page) => (
          <Pressable
            key={page.slug}
            className="gap-1 rounded-3xl bg-surface-secondary p-6 active:opacity-80"
            onPress={() => router.push(`/test/${page.slug}` as Href)}>
            <Body className="font-semibold">{page.title}</Body>
            <Muted>{page.description}</Muted>
          </Pressable>
        ))}
      </View>
    </TestScaffold>
  );
}

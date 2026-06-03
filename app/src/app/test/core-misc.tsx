'use client';

import {View} from 'react-native';
import {
  Avatar,
  Chip,
  CloseButton,
  LinkButton,
  Skeleton,
  TagGroup,
  Typography,
} from '@workspace/ui';
import {TestScaffold, DemoSection} from '@/components/test/scaffold';

export default function CoreMiscScreen() {
  return (
    <TestScaffold title="Core misc" subtitle="Avatar, chips, tags, skeleton, typography">
      <DemoSection title="Avatar">
        <Avatar color="accent">
          <Avatar.Fallback>DF</Avatar.Fallback>
        </Avatar>
      </DemoSection>

      <DemoSection title="Chips & tags">
        <View className="flex-row flex-wrap gap-2">
          <Chip>PDF</Chip>
          <Chip variant="secondary">Image</Chip>
        </View>
        <TagGroup aria-label="Tags" selectionMode="none">
          <TagGroup.List>
            <TagGroup.Item id="urgent">Urgent</TagGroup.Item>
            <TagGroup.Item id="review">Review</TagGroup.Item>
          </TagGroup.List>
        </TagGroup>
      </DemoSection>

      <DemoSection title="Skeleton">
        <View className="gap-2">
          <Skeleton className="h-4 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </View>
      </DemoSection>

      <DemoSection title="Typography & links">
        <Typography className="text-foreground">Cross-platform Typography.</Typography>
        <LinkButton onPress={() => undefined}>HeroUI docs</LinkButton>
        <CloseButton onPress={() => undefined} aria-label="Close" />
      </DemoSection>
    </TestScaffold>
  );
}

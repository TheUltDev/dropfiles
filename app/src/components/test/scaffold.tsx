import type {ReactNode} from 'react';
import {ScrollView, View} from 'react-native';
import {useRouter} from 'expo-router';
import {Button} from '@workspace/ui';
import {Title, Subtitle, Body, Muted} from '@/components/base/text';

export type TestPage = {
  slug: string;
  title: string;
  description: string;
};

// Registry of component test pages. Add an entry here and create a matching
// `app/src/app/test/<slug>.tsx` screen to expand the catalog.
export const TEST_PAGES: TestPage[] = [
  {
    slug: 'stepper',
    title: 'Stepper',
    description: 'Horizontal + vertical progress indicator',
  },
  {
    slug: 'button',
    title: 'Button',
    description: 'Variants, sizes, and disabled states',
  },
  {
    slug: 'cells',
    title: 'Cells',
    description: 'Settings-style select, switch, slider, and date-time cells',
  },
  {
    slug: 'core-forms',
    title: 'Core forms',
    description: 'Checkbox, radio, search, slider, separator, field error',
  },
  {
    slug: 'core-feedback',
    title: 'Core feedback',
    description: 'Spinner and alert',
  },
  {
    slug: 'core-structure',
    title: 'Core structure',
    description: 'Card, tabs, accordion',
  },
  {
    slug: 'core-misc',
    title: 'Core misc',
    description: 'Avatar, chip, tag, skeleton, text, scroll shadow',
  },
];

type TestScaffoldProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function TestScaffold({title, subtitle, children}: TestScaffoldProps) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="max-w-[800px] gap-6 px-6 pt-safe pb-safe-offset-8 self-center w-full">
        <View className="gap-2 pt-4">
          <Title>{title}</Title>
          {subtitle ? <Subtitle className="text-muted">{subtitle}</Subtitle> : null}
        </View>
        {children}
        <Button variant="secondary" onPress={() => router.back()}>
          Back
        </Button>
      </ScrollView>
    </View>
  );
}

type DemoSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function DemoSection({title, description, children}: DemoSectionProps) {
  return (
    <View className="gap-5 rounded-3xl bg-surface-secondary p-6">
      <View className="gap-1">
        <Body className="font-semibold">{title}</Body>
        {description ? <Muted>{description}</Muted> : null}
      </View>
      {children}
    </View>
  );
}

import type {ComponentProps} from 'react';
import type {Description as WebDescription} from '@heroui/react';
import type {Description as NativeDescription} from 'heroui-native';

export type DescriptionProps = ComponentProps<typeof NativeDescription> &
  Partial<ComponentProps<typeof WebDescription>>;

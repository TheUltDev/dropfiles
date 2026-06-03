import type {ComponentProps} from 'react';
import type {Button as WebButton} from '@heroui/react';
import type {Button as NativeButton} from 'heroui-native';

export type ButtonProps = ComponentProps<typeof NativeButton> &
  Partial<ComponentProps<typeof WebButton>>;

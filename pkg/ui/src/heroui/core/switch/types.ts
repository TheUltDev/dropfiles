import type {ComponentProps, ReactNode} from 'react';
import type {Switch as NativeSwitch} from 'heroui-native';
import type {Switch as WebSwitch} from '@heroui/react';

export type SwitchProps = ComponentProps<typeof NativeSwitch> &
  Partial<ComponentProps<typeof WebSwitch>>;

export type SwitchControlProps = {
  children?: ReactNode;
  className?: string;
};

export type SwitchThumbProps = ComponentProps<typeof NativeSwitch.Thumb> &
  Partial<ComponentProps<typeof WebSwitch.Thumb>>;

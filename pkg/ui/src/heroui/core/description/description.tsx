import type {ComponentProps} from 'react';
import type {DescriptionProps} from './types';

import {Description as NativeDescription} from 'heroui-native';

export function Description(props: DescriptionProps) {
  return (
    <NativeDescription {...(props as ComponentProps<typeof NativeDescription>)} />
  );
}

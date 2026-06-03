import type {ComponentProps} from 'react';
import type {LabelProps} from './types';

import {Label as NativeLabel} from 'heroui-native';

export function Label(props: LabelProps) {
  return <NativeLabel {...(props as ComponentProps<typeof NativeLabel>)} />;
}

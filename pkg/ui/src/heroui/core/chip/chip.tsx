import type {ComponentProps} from 'react';
import type {ChipProps} from './types';

import {Chip as NativeChip} from 'heroui-native';

export function Chip(props: ChipProps) {
  return <NativeChip {...(props as ComponentProps<typeof NativeChip>)} />;
}

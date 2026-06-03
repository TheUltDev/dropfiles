import type {ComponentProps} from 'react';
import type {SurfaceProps} from './types';

import {Surface as NativeSurface} from 'heroui-native';

export function Surface(props: SurfaceProps) {
  return <NativeSurface {...(props as ComponentProps<typeof NativeSurface>)} />;
}

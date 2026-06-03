import type {ComponentProps} from 'react';
import type {Surface as WebSurface} from '@heroui/react';
import type {Surface as NativeSurface} from 'heroui-native';

export type SurfaceProps = ComponentProps<typeof NativeSurface> &
  Partial<ComponentProps<typeof WebSurface>>;

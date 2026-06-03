'use client';

import type {ComponentProps} from 'react';
import type {SurfaceProps} from './types';

import {Surface as WebSurface} from '@heroui/react';

export function Surface(props: SurfaceProps) {
  return <WebSurface {...(props as ComponentProps<typeof WebSurface>)} />;
}

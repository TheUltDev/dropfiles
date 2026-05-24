'use client';

import type {ComponentProps, ReactNode} from 'react';
import {View} from 'react-native';
import {Surface as WebSurface} from '@heroui/react';

type Props = ComponentProps<typeof WebSurface>;

export function Surface(props: Props) {
  return <WebSurface {...props} />;
}

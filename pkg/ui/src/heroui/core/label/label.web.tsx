'use client';

import type {ComponentProps} from 'react';
import type {LabelProps} from './types';

import {Label as WebLabel} from '@heroui/react';

export function Label(props: LabelProps) {
  return <WebLabel {...(props as ComponentProps<typeof WebLabel>)} />;
}

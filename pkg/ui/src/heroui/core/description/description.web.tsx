'use client';

import type {ComponentProps} from 'react';
import type {DescriptionProps} from './types';

import {Description as WebDescription} from '@heroui/react';

export function Description(props: DescriptionProps) {
  return (
    <WebDescription {...(props as ComponentProps<typeof WebDescription>)} />
  );
}

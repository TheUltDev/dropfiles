'use client';

import type {ComponentProps} from 'react';
import type {ButtonProps} from './types';

import {Button as WebButton} from '@heroui/react';
import {compound} from '../../utils/compound';

function ButtonRoot(props: ButtonProps) {
  return <WebButton {...(props as ComponentProps<typeof WebButton>)} />;
}

export const Button = compound(ButtonRoot, {});

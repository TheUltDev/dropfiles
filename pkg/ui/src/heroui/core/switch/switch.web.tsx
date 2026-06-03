'use client';

import type {ComponentProps} from 'react';
import type {SwitchProps} from './types';

import {Switch as WebSwitch} from '@heroui/react';
import {compound} from '../../utils/compound';

function SwitchRoot(props: SwitchProps) {
  return <WebSwitch {...(props as ComponentProps<typeof WebSwitch>)} />;
}

export const Switch = compound(SwitchRoot, {
  Control: WebSwitch.Control,
  Thumb: WebSwitch.Thumb,
});

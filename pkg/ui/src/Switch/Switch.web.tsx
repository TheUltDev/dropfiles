'use client';

import {Switch as WebSwitch} from '@heroui/react';
import {compound} from '../utils/compound';

export const Switch = compound(WebSwitch, {
  Control: WebSwitch.Control,
  Thumb: WebSwitch.Thumb,
});

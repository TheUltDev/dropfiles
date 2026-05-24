'use client';

import {NumberField as WebNumberField} from '@heroui/react';
import {compound} from '../utils/compound';

export const NumberField = compound(WebNumberField, {
  Group: WebNumberField.Group,
  DecrementButton: WebNumberField.DecrementButton,
  Input: WebNumberField.Input,
  IncrementButton: WebNumberField.IncrementButton,
});

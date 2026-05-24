'use client';

import {NumberStepper as WebNumberStepper} from '@heroui-pro/react/dist/components/number-stepper/index.js';
import {compound} from '../utils/compound';

export const NumberStepper = compound(WebNumberStepper, {
  Group: WebNumberStepper.Group,
  DecrementButton: WebNumberStepper.DecrementButton,
  Value: WebNumberStepper.Value,
  IncrementButton: WebNumberStepper.IncrementButton,
});

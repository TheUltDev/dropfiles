import type {ComponentProps} from 'react';
import type {NumberStepper as WebNumberStepper} from '@heroui-pro/react/number-stepper';
import type {NumberStepper as NativeNumberStepper} from 'heroui-native-pro/number-stepper';

export type NumberStepperProps = ComponentProps<typeof NativeNumberStepper> &
  Partial<ComponentProps<typeof WebNumberStepper>>;

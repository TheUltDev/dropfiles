import type {ComponentProps} from 'react';
import type {Stepper as WebStepper} from '@heroui-pro/react/stepper';
import type {Stepper as NativeStepper} from 'heroui-native-pro';

export type StepperProps = ComponentProps<typeof NativeStepper> &
  Partial<ComponentProps<typeof WebStepper>>;

import type {ReactNode} from 'react';
import {View} from 'react-native';
import {NumberStepper as NativeNumberStepper} from 'heroui-native-pro/number-stepper';
import {compound} from '../utils/compound';

function NumberStepperGroup({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <View className={className ?? 'flex-row items-center gap-2'}>{children}</View>;
}

export const NumberStepper = compound(NativeNumberStepper, {
  Group: NumberStepperGroup,
  DecrementButton: NativeNumberStepper.DecrementButton,
  Value: NativeNumberStepper.Value,
  IncrementButton: NativeNumberStepper.IncrementButton,
});

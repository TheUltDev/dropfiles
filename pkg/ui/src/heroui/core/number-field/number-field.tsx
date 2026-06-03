import {NumberField as NativeNumberField} from 'heroui-native-pro/number-field';
import {compound} from '../../utils/compound';

export const NumberField = compound(NativeNumberField, {
  Group: NativeNumberField.Group,
  DecrementButton: NativeNumberField.DecrementButton,
  Input: NativeNumberField.Input,
  IncrementButton: NativeNumberField.IncrementButton,
});

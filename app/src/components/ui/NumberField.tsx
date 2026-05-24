import {NumberField as NativeNumberField} from 'heroui-native-pro/number-field';
import {Label} from '@/components/ui/Label';
import type {UiNumberFieldProps} from '@/components/ui/types';

export function NumberField({
  label,
  value,
  onChange,
  minValue,
  maxValue,
  placeholder,
  isDisabled,
  className,
}: UiNumberFieldProps) {
  return (
    <NativeNumberField
      className={className}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      isDisabled={isDisabled}
      onChange={onChange}>
      <Label>{label}</Label>
      <NativeNumberField.Group>
        <NativeNumberField.DecrementButton />
        <NativeNumberField.Input placeholder={placeholder} />
        <NativeNumberField.IncrementButton />
      </NativeNumberField.Group>
    </NativeNumberField>
  );
}

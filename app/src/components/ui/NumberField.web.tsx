import {Label as WebLabel, NumberField as WebNumberField} from '@heroui/react';
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
    <WebNumberField
      className={className ?? 'w-full'}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      isDisabled={isDisabled}
      onChange={onChange}>
      <WebLabel>{label}</WebLabel>
      <WebNumberField.Group>
        <WebNumberField.DecrementButton />
        <WebNumberField.Input placeholder={placeholder} />
        <WebNumberField.IncrementButton />
      </WebNumberField.Group>
    </WebNumberField>
  );
}

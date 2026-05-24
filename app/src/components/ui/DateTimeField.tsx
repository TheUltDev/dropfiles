import {useMemo} from 'react';
import {View} from 'react-native';
import DateTimePicker from '@expo/ui/datetimepicker';
import {Label} from '@/components/ui/Label';
import type {UiDateTimeFieldProps} from '@/components/ui/types';

export function DateTimeField({
  label,
  value,
  onChange,
  minimumDate,
  isDisabled,
  className,
}: UiDateTimeFieldProps) {
  const pickerValue = useMemo(() => (value ? new Date(value) : new Date()), [value]);

  if (value == null) {
    return label ? (
      <View className={className ?? 'gap-2'}>
        <Label>{label}</Label>
      </View>
    ) : null;
  }

  return (
    <View className={className ?? 'gap-2'}>
      {label ? <Label>{label}</Label> : null}
      <DateTimePicker
        value={pickerValue}
        mode="datetime"
        presentation="inline"
        minimumDate={minimumDate}
        disabled={isDisabled}
        onValueChange={(_event, selectedDate) => {
          onChange(selectedDate.toISOString());
        }}
      />
    </View>
  );
}

import {View} from 'react-native';
import {isoToLocalDateTimeInput, localDateTimeInputToIso} from '@/lib/expiration';
import {Label} from '@/components/ui/Label';
import type {UiDateTimeFieldProps} from '@/components/ui/types';

const inputClassName =
  'w-full rounded-xl border border-field-border bg-field-background px-3 py-2 text-sm text-field-foreground outline-none focus:border-accent';

export function DateTimeField({
  label,
  value,
  onChange,
  minimumDate,
  isDisabled,
  className,
}: UiDateTimeFieldProps) {
  const minValue = minimumDate ? isoToLocalDateTimeInput(minimumDate.toISOString()) : undefined;

  return (
    <View className={className ?? 'gap-2'}>
      {label ? <Label>{label}</Label> : null}
      <input
        className={inputClassName}
        type="datetime-local"
        value={value ? isoToLocalDateTimeInput(value) : ''}
        min={minValue}
        disabled={isDisabled}
        onChange={(event) => {
          const next = event.target.value.trim();
          onChange(next ? localDateTimeInputToIso(next) : null);
        }}
      />
    </View>
  );
}

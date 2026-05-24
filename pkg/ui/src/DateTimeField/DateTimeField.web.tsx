'use client';

import {View} from 'react-native';
import {Button} from '../Button';
import {Label} from '../Label';
import {
  formatExpirationLabel,
  isoToLocalDateTimeInput,
  localDateTimeInputToIso,
} from '../utils/expiration';

const inputClassName =
  'w-full rounded-xl border border-field-border bg-field-background px-3 py-2 text-sm text-field-foreground outline-none focus:border-accent';

export type DateTimeFieldProps = {
  label?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  minimumDate?: Date;
  isDisabled?: boolean;
  className?: string;
};

export function DateTimeField({
  label,
  value,
  onChange,
  minimumDate,
  isDisabled,
  className,
}: DateTimeFieldProps) {
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
      {value ? (
        <View className="flex-row items-center gap-2">
          <span className="text-sm text-muted">{formatExpirationLabel(value)}</span>
          <Button size="sm" variant="ghost" onPress={() => onChange(null)}>
            Clear
          </Button>
        </View>
      ) : null}
    </View>
  );
}

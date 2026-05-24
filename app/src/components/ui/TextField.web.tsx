'use client';

import {Description, Input, Label as WebLabel, TextField as WebTextField} from '@heroui/react';
import type {UiTextFieldProps} from '@/components/ui/types';

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
  secureTextEntry,
  autoCapitalize,
  isDisabled,
  className,
}: UiTextFieldProps) {
  return (
    <WebTextField
      className={className ?? 'w-full'}
      value={value}
      onChange={onChangeText}
      isDisabled={isDisabled}>
      <WebLabel>{label}</WebLabel>
      <Input
        placeholder={placeholder}
        type={secureTextEntry ? 'password' : 'text'}
        autoCapitalize={autoCapitalize}
      />
      {helperText ? <Description>{helperText}</Description> : null}
    </WebTextField>
  );
}

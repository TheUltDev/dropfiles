import {Input, TextField as NativeTextField} from 'heroui-native';
import {View} from 'react-native';
import {Muted} from '@/components/base/text';
import {Label} from '@/components/ui/Label';
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
    <View className={className ?? 'gap-2'}>
      <NativeTextField isDisabled={isDisabled}>
        <Label>{label}</Label>
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
        />
      </NativeTextField>
      {helperText ? <Muted>{helperText}</Muted> : null}
    </View>
  );
}

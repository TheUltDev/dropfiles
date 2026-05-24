import {View} from 'react-native';
import {Select as NativeSelect} from 'heroui-native';
import {Label} from '@/components/ui/Label';
import type {UiSelectProps} from '@/components/ui/types';

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder,
  className,
}: UiSelectProps<T>) {
  const selected = options.find((option) => option.value === value);

  return (
    <View className={className ?? 'gap-2'}>
      {label ? <Label>{label}</Label> : null}
      <NativeSelect
        value={selected ? {value: selected.value, label: selected.label} : undefined}
        onValueChange={(next) => {
          if (!next || Array.isArray(next)) return;
          onChange(next.value as T);
        }}>
        <NativeSelect.Trigger>
          <NativeSelect.Value placeholder={placeholder ?? 'Choose an option'} />
          <NativeSelect.TriggerIndicator />
        </NativeSelect.Trigger>
        <NativeSelect.Portal>
          <NativeSelect.Overlay />
          <NativeSelect.Content presentation="popover">
            {options.map((option) => (
              <NativeSelect.Item
                key={option.value}
                value={option.value}
                label={option.label}
              />
            ))}
          </NativeSelect.Content>
        </NativeSelect.Portal>
      </NativeSelect>
    </View>
  );
}

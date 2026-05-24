import {Label as WebLabel, ListBox, Select as WebSelect} from '@heroui/react';
import type {UiSelectProps} from '@/components/ui/types';

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder,
  className,
}: UiSelectProps<T>) {
  return (
    <WebSelect
      className={className ?? 'w-full gap-2'}
      placeholder={placeholder ?? 'Choose an option'}
      value={value}
      onChange={(next) => {
        if (next == null) return;
        onChange(String(next) as T);
      }}>
      {label ? <WebLabel>{label}</WebLabel> : null}
      <WebSelect.Trigger>
        <WebSelect.Value />
        <WebSelect.Indicator />
      </WebSelect.Trigger>
      <WebSelect.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item key={option.value} id={option.value} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </WebSelect.Popover>
    </WebSelect>
  );
}

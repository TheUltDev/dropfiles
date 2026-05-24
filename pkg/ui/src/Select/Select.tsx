import type {ComponentProps, ReactNode} from 'react';
import {Select as NativeSelect} from 'heroui-native';
import {compound} from '../utils/compound';
import type {SelectRootProps} from '../types';

type SelectItemProps = {
  value: string;
  label: string;
  children?: ReactNode;
};

function SelectRoot({value, onChange, onValueChange, ...rest}: SelectRootProps & {
  onValueChange?: ComponentProps<typeof NativeSelect>['onValueChange'];
}) {
  const nativeValue =
    typeof value === 'string'
      ? value
        ? {value, label: value}
        : undefined
      : value;

  return (
    <NativeSelect
      {...rest}
      value={nativeValue}
      onValueChange={(next) => {
        onValueChange?.(next);
        if (!next || Array.isArray(next)) return;
        onChange?.(next.value);
      }}
    />
  );
}

function SelectPopover({children}: {children: ReactNode}) {
  return (
    <NativeSelect.Portal>
      <NativeSelect.Overlay />
      <NativeSelect.Content presentation="popover">{children}</NativeSelect.Content>
    </NativeSelect.Portal>
  );
}

function SelectItem({value, label, children}: SelectItemProps) {
  return (
    <NativeSelect.Item value={value} label={label}>
      {children}
    </NativeSelect.Item>
  );
}

type SelectValueProps = ComponentProps<typeof NativeSelect.Value>;

function SelectValue({placeholder = 'Choose an option', ...props}: SelectValueProps) {
  return <NativeSelect.Value placeholder={placeholder} {...props} />;
}

export const Select = compound(SelectRoot, {
  Trigger: NativeSelect.Trigger,
  Value: SelectValue,
  Indicator: NativeSelect.TriggerIndicator,
  Popover: SelectPopover,
  Item: SelectItem,
});

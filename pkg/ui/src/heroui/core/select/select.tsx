import type {ComponentProps, ReactNode} from 'react';
import type {SelectCompound, SelectRootProps} from './types';

import {Select as NativeSelect} from 'heroui-native';
import {NATIVE_SELECT_POPOVER_PROPS} from '../../stack/cells/constants';
import {compound} from '../../utils/compound';

type SelectItemProps = {
  value: string;
  label: string;
  children?: ReactNode;
};

function SelectRoot({value, onChange, onValueChange, className, ...rest}: SelectRootProps & {
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
      className={className ?? 'w-full'}
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
      <NativeSelect.Content {...NATIVE_SELECT_POPOVER_PROPS}>{children}</NativeSelect.Content>
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
}) as SelectCompound;

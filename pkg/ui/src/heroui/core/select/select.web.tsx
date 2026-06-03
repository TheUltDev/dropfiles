'use client';

import type {ComponentProps, ReactNode} from 'react';
import type {SelectRootProps} from './types';

import {Select as WebSelect} from '@heroui/react';
import {ListBox} from '../../core/list-box/list-box.web';
import {compound} from '../../utils/compound';

type SelectItemProps = {
  value: string;
  label: string;
  children?: ReactNode;
};

function SelectRoot({onChange, ...rest}: SelectRootProps) {
  return (
    <WebSelect
      {...rest}
      onChange={(next) => {
        if (next == null) return;
        onChange?.(String(next));
      }}
    />
  );
}

function SelectPopover({children, ...rest}: ComponentProps<typeof WebSelect.Popover>) {
  return (
    <WebSelect.Popover {...rest}>
      <ListBox>{children}</ListBox>
    </WebSelect.Popover>
  );
}

function SelectItem({value, label, children}: SelectItemProps) {
  return (
    <ListBox.Item id={value} textValue={label}>
      {children ?? label}
      <ListBox.ItemIndicator />
    </ListBox.Item>
  );
}

type SelectValueProps = {
  placeholder?: string;
  className?: string;
};

function SelectValue({placeholder, className}: SelectValueProps) {
  return <WebSelect.Value className={className} />;
}

export const Select = compound(SelectRoot, {
  Trigger: WebSelect.Trigger,
  Value: SelectValue,
  Indicator: WebSelect.Indicator,
  Popover: SelectPopover,
  Item: SelectItem,
});

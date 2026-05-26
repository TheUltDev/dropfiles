'use client';

import type {ComponentProps, ReactNode} from 'react';
import {ListBox} from '@heroui/react';
import {CellSelect as ProCellSelect} from '@heroui-pro/react';
import {compound} from '../utils/compound';

type CellSelectRootProps = Omit<ComponentProps<typeof ProCellSelect>, 'onChange'> & {
  onChange?: (value: string) => void;
};

function CellSelectRoot({onChange, ...rest}: CellSelectRootProps) {
  return (
    <ProCellSelect
      {...rest}
      onChange={(next) => {
        if (next == null) return;
        onChange?.(String(next));
      }}
    />
  );
}

type CellSelectItemProps = {
  id: string;
  textValue: string;
  children?: ReactNode;
};

function CellSelectItem({id, textValue, children}: CellSelectItemProps) {
  return (
    <ListBox.Item id={id} textValue={textValue}>
      {children ?? textValue}
      <ListBox.ItemIndicator />
    </ListBox.Item>
  );
}

function CellSelectPopover({children}: {children: ReactNode}) {
  return (
    <ProCellSelect.Popover>
      <ListBox>{children}</ListBox>
    </ProCellSelect.Popover>
  );
}

export const CellSelect = compound(CellSelectRoot, {
  Trigger: ProCellSelect.Trigger,
  Label: ProCellSelect.Label,
  Value: ProCellSelect.Value,
  Indicator: ProCellSelect.Indicator,
  Popover: CellSelectPopover,
  Item: CellSelectItem,
});

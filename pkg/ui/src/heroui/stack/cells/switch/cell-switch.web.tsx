'use client';

import type {ComponentProps} from 'react';
import {CellSwitch as ProCellSwitch} from '@heroui-pro/react/cell-switch';
import {compound} from '../../../utils/compound';

type CellSwitchRootProps = ComponentProps<typeof ProCellSwitch> & {
  onSelectedChange?: (isSelected: boolean) => void;
};

function CellSwitchRoot({onSelectedChange, onChange, ...rest}: CellSwitchRootProps) {
  return (
    <ProCellSwitch
      {...rest}
      onChange={onChange ?? onSelectedChange}
    />
  );
}

export const CellSwitch = compound(CellSwitchRoot, {
  Trigger: ProCellSwitch.Trigger,
  Label: ProCellSwitch.Label,
  Control: ProCellSwitch.Control,
});

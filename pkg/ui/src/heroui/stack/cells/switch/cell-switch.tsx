import type {ComponentProps, ReactNode} from 'react';
import {View} from 'react-native';
import {ControlField} from 'heroui-native';
import {Label} from '../../../core/label';
import {compound} from '../../../utils/compound';
import {CELL_SURFACE_CLASS} from '../constants';

type CellSwitchRootProps = ComponentProps<typeof ControlField> & {
  variant?: 'default' | 'secondary';
};

function CellSwitchRoot({variant: _variant, className, children, ...rest}: CellSwitchRootProps) {
  return (
    <ControlField className={className ?? CELL_SURFACE_CLASS} {...rest}>
      {children}
    </ControlField>
  );
}

function CellSwitchTrigger({children, className}: {children: ReactNode; className?: string}) {
  return (
    <View
      className={
        className ?? 'w-full flex-1 flex-row items-center justify-between gap-3'
      }>
      {children}
    </View>
  );
}

function CellSwitchLabel({children, className}: {children: ReactNode; className?: string}) {
  return <Label className={className ?? 'flex-1'}>{children}</Label>;
}

function CellSwitchControl(props: ComponentProps<typeof ControlField.Indicator>) {
  return <ControlField.Indicator {...props} />;
}

export const CellSwitch = compound(CellSwitchRoot, {
  Trigger: CellSwitchTrigger,
  Label: CellSwitchLabel,
  Control: CellSwitchControl,
});

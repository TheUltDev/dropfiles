import {Switch as NativeSwitch} from 'heroui-native';
import type {UiSwitchProps} from '@/components/ui/types';

export function Switch({isSelected, onSelectedChange, isDisabled, 'aria-label': ariaLabel}: UiSwitchProps) {
  return (
    <NativeSwitch
      isSelected={isSelected}
      onSelectedChange={onSelectedChange}
      isDisabled={isDisabled}
      aria-label={ariaLabel}
    />
  );
}

import {Switch as WebSwitch} from '@heroui/react';
import type {UiSwitchProps} from '@/components/ui/types';

export function Switch({isSelected, onSelectedChange, isDisabled, 'aria-label': ariaLabel}: UiSwitchProps) {
  return (
    <WebSwitch
      isSelected={isSelected}
      onChange={onSelectedChange}
      isDisabled={isDisabled}
      aria-label={ariaLabel}>
      <WebSwitch.Control>
        <WebSwitch.Thumb />
      </WebSwitch.Control>
    </WebSwitch>
  );
}

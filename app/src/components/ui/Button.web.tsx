import {Button as WebButton} from '@heroui/react';
import type {UiButtonProps} from '@/components/ui/types';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isDisabled,
  onPress,
}: UiButtonProps) {
  const webVariant =
    variant === 'primary'
      ? undefined
      : variant === 'secondary'
        ? 'secondary'
        : variant === 'danger'
          ? 'danger'
          : 'ghost';

  return (
    <WebButton
      variant={webVariant}
      size={size}
      className={className}
      isDisabled={isDisabled}
      onPress={onPress}>
      {children}
    </WebButton>
  );
}

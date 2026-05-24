import {Button as NativeButton} from 'heroui-native';
import type {UiButtonProps} from '@/components/ui/types';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isDisabled,
  onPress,
}: UiButtonProps) {
  return (
    <NativeButton
      variant={variant === 'primary' ? undefined : variant}
      size={size}
      className={className}
      isDisabled={isDisabled}
      onPress={onPress}>
      {children}
    </NativeButton>
  );
}

import type {ComponentProps, ComponentType, ReactNode} from 'react';
import type {Select as NativeSelect} from 'heroui-native';
import type {Select as WebSelect} from '@heroui/react';

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};

/** Cross-platform facade: string `value` / `onChange` instead of library-specific handlers. */
export type SelectRootProps = Omit<
  Partial<ComponentProps<typeof NativeSelect>> &
    Partial<ComponentProps<typeof WebSelect>>,
  'value' | 'onChange' | 'onValueChange'
> & {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  children?: ReactNode;
  isDisabled?: boolean;
};

export type SelectProps = SelectRootProps;

export type SelectCompound = ComponentType<SelectRootProps> & {
  Trigger: typeof NativeSelect.Trigger;
  Value: ComponentType<ComponentProps<typeof NativeSelect.Value>>;
  Indicator: typeof NativeSelect.TriggerIndicator;
  Popover: ComponentType<{children?: ReactNode}>;
  Item: ComponentType<{value: string; label: string; children?: ReactNode}>;
};

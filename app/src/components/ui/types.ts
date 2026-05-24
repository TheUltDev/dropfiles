import type {ReactNode} from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};

export type UiButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  isDisabled?: boolean;
  onPress?: () => void;
};

export type UiSwitchProps = {
  isSelected: boolean;
  onSelectedChange: (selected: boolean) => void;
  isDisabled?: boolean;
  'aria-label'?: string;
};

export type UiSelectProps<T extends string = string> = {
  label?: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
};

export type UiNumberFieldProps = {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  minValue?: number;
  maxValue?: number;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
};

export type UiTextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  isDisabled?: boolean;
  className?: string;
};

export type UiDateTimeFieldProps = {
  label?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  minimumDate?: Date;
  isDisabled?: boolean;
  className?: string;
};

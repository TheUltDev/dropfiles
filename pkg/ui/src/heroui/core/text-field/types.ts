import type {ReactNode} from 'react';

export type TextFieldProps = {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  onChangeText?: (value: string) => void;
  isDisabled?: boolean;
  children?: ReactNode;
};

export type InputProps = {
  value?: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  type?: string;
  onSubmitEditing?: () => void;
};

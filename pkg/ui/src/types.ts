import type {ReactNode} from 'react';

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};

export type SelectRootProps = {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  children?: ReactNode;
  isDisabled?: boolean;
};

export type {TextFieldProps, InputProps} from './TextField/types';

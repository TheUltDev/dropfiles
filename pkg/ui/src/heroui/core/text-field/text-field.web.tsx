'use client';

import type {InputProps, TextFieldProps} from './types';

import {Input as WebInput, TextField as WebTextField} from '@heroui/react';
import {compound} from '../../utils/compound';

function TextFieldRoot({onChange, onChangeText, children, ...rest}: TextFieldProps) {
  return (
    <WebTextField {...rest} onChange={onChange ?? onChangeText}>
      {children}
    </WebTextField>
  );
}

function InputRoot({type, secureTextEntry, autoCapitalize, ...rest}: InputProps) {
  return (
    <WebInput
      {...rest}
      type={type ?? (secureTextEntry ? 'password' : 'text')}
      autoCapitalize={autoCapitalize}
    />
  );
}

export const TextField = compound(TextFieldRoot, {});
export const Input = InputRoot;

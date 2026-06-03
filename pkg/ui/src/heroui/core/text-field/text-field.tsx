import type {InputProps, TextFieldProps} from './types';

import {Input as NativeInput, TextField as NativeTextField} from 'heroui-native';
import {compound} from '../../utils/compound';

const TextFieldRoot = ({onChange: _onChange, onChangeText: _onChangeText, children, ...rest}: TextFieldProps) => {
  return <NativeTextField {...rest}>{children}</NativeTextField>;
};

const InputRoot = (props: InputProps) => {
  const {type: _type, onSubmitEditing, ...rest} = props;
  return <NativeInput {...rest} onSubmitEditing={onSubmitEditing} />;
};

export const TextField = compound(TextFieldRoot, {});
export const Input = InputRoot;

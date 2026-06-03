import type {ComponentProps} from 'react';
import type {ButtonProps} from './types';

import {Button as NativeButton} from 'heroui-native';
import {compound} from '../../utils/compound';

function ButtonRoot(props: ButtonProps) {
  return <NativeButton {...(props as ComponentProps<typeof NativeButton>)} />;
}

export const Button = compound(ButtonRoot, {});

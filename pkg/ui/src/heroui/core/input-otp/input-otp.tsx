import type {ComponentType} from 'react';
import type {InputOTPProps} from './types';

import {InputOTP as NativeInputOTP} from 'heroui-native';

export const InputOTP = NativeInputOTP as ComponentType<InputOTPProps>;

export type {InputOTPProps} from './types';

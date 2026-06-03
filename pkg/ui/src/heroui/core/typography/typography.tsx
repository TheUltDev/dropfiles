import type {ComponentType} from 'react';
import type {TypographyProps} from './types';

import {Typography as NativeTypography} from 'heroui-native';

export const Typography = NativeTypography as ComponentType<TypographyProps>;
export type {TypographyProps} from './types';

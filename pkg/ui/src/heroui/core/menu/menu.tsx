import type {ComponentType} from 'react';
import type {MenuProps} from './types';

import {Menu as NativeMenu} from 'heroui-native';

export const Menu = NativeMenu as ComponentType<MenuProps>;

export {useMenu, useMenuAnimation, useMenuItem} from 'heroui-native';

export type {MenuProps} from './types';

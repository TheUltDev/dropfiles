import type {ComponentType} from 'react';
import type {SubMenuProps} from './types';

import {SubMenu as NativeSubMenu} from 'heroui-native';

export const SubMenu = NativeSubMenu as ComponentType<SubMenuProps>;

export {useSubMenu} from 'heroui-native';

export type {SubMenuProps} from './types';

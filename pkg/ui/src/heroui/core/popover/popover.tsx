import type {ComponentType} from 'react';
import type {PopoverProps} from './types';

import {Popover as NativePopover} from 'heroui-native';

export const Popover = NativePopover as ComponentType<PopoverProps>;
export type {PopoverProps} from './types';

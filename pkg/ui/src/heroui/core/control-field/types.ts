import type {ComponentProps} from 'react';
import type {ControlField as NativeControlField} from 'heroui-native';

/** Native-only layout primitive for settings cells; web has no direct equivalent. */
export type ControlFieldProps = ComponentProps<typeof NativeControlField>;

import type {ComponentProps} from 'react';
import type {Menu as NativeMenu} from 'heroui-native';

/** Native Menu API; on web `Menu` maps to `@heroui/react` Dropdown. */
export type MenuProps = ComponentProps<typeof NativeMenu>;

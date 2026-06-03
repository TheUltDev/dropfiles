import type {ComponentProps} from 'react';
import type {Dialog as NativeDialog} from 'heroui-native';

/** Native Dialog API; on web use `Dialog` which maps to `@heroui/react` Modal. */
export type DialogProps = ComponentProps<typeof NativeDialog>;

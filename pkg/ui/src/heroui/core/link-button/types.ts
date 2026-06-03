import type {ComponentProps} from 'react';
import type {LinkButton as NativeLinkButton} from 'heroui-native';

export type LinkButtonProps = ComponentProps<typeof NativeLinkButton> & {
  href?: string;
};

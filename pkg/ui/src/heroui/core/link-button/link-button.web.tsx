'use client';

import type {ComponentProps} from 'react';

import {Link as WebLink} from '@heroui/react';

export type LinkButtonProps = ComponentProps<typeof WebLink> & {
  onPress?: () => void;
};

export function LinkButton({onPress, href = '#', children, ...props}: LinkButtonProps) {
  return (
    <WebLink href={href} onPress={onPress} {...props}>
      {children}
    </WebLink>
  );
}

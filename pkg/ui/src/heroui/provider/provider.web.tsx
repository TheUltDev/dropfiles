'use client';

import type {ReactNode} from 'react';

type Props = {
  children: ReactNode;
};

export function UiProvider({children}: Props) {
  return <>{children}</>;
}

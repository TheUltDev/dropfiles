'use client';

import '@heroui/styles/css';
import '@heroui-pro/react/dist/css/index.css';
import type {ReactNode} from 'react';

type Props = {
  children: ReactNode;
};

export function UiProvider({children}: Props) {
  return <>{children}</>;
}

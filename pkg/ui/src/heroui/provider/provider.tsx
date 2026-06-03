import type {ReactNode} from 'react';

import {HeroUINativeProvider} from 'heroui-native';

type Props = {
  children: ReactNode;
};

export function UiProvider({children}: Props) {
  return (
    <HeroUINativeProvider config={{devInfo: {stylingPrinciples: false}}}>
      {children}
    </HeroUINativeProvider>
  );
}

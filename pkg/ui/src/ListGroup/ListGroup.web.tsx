'use client';

import type {ComponentProps, ReactNode} from 'react';
import {View} from 'react-native';

type Props = ComponentProps<typeof View> & {
  children?: ReactNode;
};

export function ListGroup({children, className, ...rest}: Props) {
  return (
    <View className={className ?? 'flex flex-col gap-2'} {...rest}>
      {children}
    </View>
  );
}

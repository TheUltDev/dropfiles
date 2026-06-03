'use client';

import type {ListGroupProps} from './types';

import {View} from 'react-native';

export function ListGroup({children, className, ...rest}: ListGroupProps) {
  return (
    <View className={className ?? 'flex flex-col gap-2'} {...rest}>
      {children}
    </View>
  );
}

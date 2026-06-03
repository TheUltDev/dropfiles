import type {ComponentProps} from 'react';
import type {ListGroupProps} from './types';

import {ListGroup as NativeListGroup} from 'heroui-native';

export function ListGroup(props: ListGroupProps) {
  return (
    <NativeListGroup {...(props as ComponentProps<typeof NativeListGroup>)} />
  );
}

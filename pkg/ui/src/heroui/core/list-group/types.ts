import type {ComponentProps, ReactNode} from 'react';
import type {View} from 'react-native';

export type ListGroupProps = ComponentProps<typeof View> & {
  children?: ReactNode;
};

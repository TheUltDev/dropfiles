import type {ReactNode} from 'react';
import {Text} from 'react-native';
import {twMerge} from 'tailwind-merge';

type Props = {
  children: ReactNode;
  className?: string;
};

export function Label({children, className}: Props) {
  return (
    <Text className={twMerge('text-sm font-medium text-foreground', className)}>{children}</Text>
  );
}

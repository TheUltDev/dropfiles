import type {TextProps} from 'react-native';
import {twMerge} from 'tailwind-merge';
import {Text} from 'react-native';

export function Body({className, ...rest}: TextProps & {className?: string}) {
  return (
    <Text
      className={twMerge('text-base font-medium text-foreground', className)}
      {...rest}
    />
  );
}

export function Small({className, ...rest}: TextProps & {className?: string}) {
  return (
    <Text className={twMerge('text-sm font-medium text-foreground', className)} {...rest} />
  );
}

export function Title({className, ...rest}: TextProps & {className?: string}) {
  return (
    <Text
      className={twMerge('text-4xl font-semibold leading-10 text-foreground', className)}
      {...rest}
    />
  );
}

export function Subtitle({className, ...rest}: TextProps & {className?: string}) {
  return (
    <Text
      className={twMerge('text-3xl font-semibold leading-8 text-foreground', className)}
      {...rest}
    />
  );
}

export function Muted({className, ...rest}: TextProps & {className?: string}) {
  return (
    <Text
      className={twMerge('text-sm font-medium text-muted', className)}
      {...rest}
    />
  );
}

export function Code({className, ...rest}: TextProps & {className?: string}) {
  return (
    <Text
      className={twMerge('text-xs font-mono text-foreground', className)}
      {...rest}
    />
  );
}

export function Link({className, ...rest}: TextProps & {className?: string}) {
  return (
    <Text
      className={twMerge('text-sm leading-[30px] text-link', className)}
      {...rest}
    />
  );
}

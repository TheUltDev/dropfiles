import type {ComponentType, ReactNode} from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;

/** Attach cross-platform compound aliases onto a web HeroUI component. */
export function withWebAliases<T extends AnyComponent>(
  Root: T,
  aliases: Record<string, AnyComponent>,
): T & Record<string, AnyComponent> {
  return Object.assign(Root, aliases) as T & Record<string, AnyComponent>;
}

export function passthroughSlot({children}: {children?: ReactNode}) {
  return <>{children}</>;
}

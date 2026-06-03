import type {ComponentType} from 'react';

import {compound} from './compound';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;

export function nativeCompound(Native: AnyComponent, partKeys: string[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const source = Native as any;
  const parts: Record<string, AnyComponent> = {};
  for (const key of partKeys) {
    const part = source[key];
    if (part) {
      parts[key] = part;
    }
  }
  return compound(Native, parts);
}

export function webCompound(Web: AnyComponent, partKeys: string[]) {
  return nativeCompound(Web, partKeys);
}

/** Re-export upstream compound component without wrapping the root. */
export function reexportCompound<T extends AnyComponent>(Upstream: T): T {
  return Upstream;
}

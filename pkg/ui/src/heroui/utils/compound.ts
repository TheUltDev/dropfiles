import type {ComponentType} from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compound<
  Root extends ComponentType<any>,
  Parts extends Record<string, ComponentType<any>>,
>(
  Root: Root,
  parts: Parts,
) {
  return Object.assign(Root, parts);
}

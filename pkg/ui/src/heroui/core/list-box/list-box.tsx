import type {ListBoxProps} from './types';

/**
 * ListBox is web-only in HeroUI OSS. On native, use `Select` or `Menu`.
 */
export function ListBox(_props: ListBoxProps): null {
  if (__DEV__) {
    console.warn('ListBox is web-only; use Select or Menu on native.');
  }
  return null;
}

export type {ListBoxProps} from './types';

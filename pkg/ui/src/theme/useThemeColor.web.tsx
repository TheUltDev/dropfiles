'use client';

import {useMemo} from 'react';

export function useThemeColor(tokens: string[]): string[] {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return tokens.map(() => '');
    }

    const root = getComputedStyle(document.documentElement);
    return tokens.map((token) => root.getPropertyValue(`--${token}`).trim());
  }, [tokens.join('|')]);
}

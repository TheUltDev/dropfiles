export function useMenu(): never {
  throw new Error('useMenu is native-only. Use Dropdown on web.');
}

export function useMenuAnimation(): never {
  throw new Error('useMenuAnimation is native-only.');
}

export function useMenuItem(): never {
  throw new Error('useMenuItem is native-only.');
}

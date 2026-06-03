/** Web uses `Dialog` (Modal); manage open state via Modal props instead of these hooks. */

export function useDialog(): never {
  throw new Error('useDialog is native-only. Use Modal open state on web.');
}

export function useDialogAnimation(): never {
  throw new Error('useDialogAnimation is native-only.');
}

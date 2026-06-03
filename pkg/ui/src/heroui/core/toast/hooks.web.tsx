export function useToast(): never {
  throw new Error('useToast is native-only. Use Toast.Provider on web.');
}

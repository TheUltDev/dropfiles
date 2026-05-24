export function digestToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function canUseWasmThreads(): boolean {
  if (typeof crossOriginIsolated === 'undefined') return false;
  return crossOriginIsolated;
}

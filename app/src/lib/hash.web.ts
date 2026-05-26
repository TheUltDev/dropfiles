import type {HashAlgo} from '@/lib/access';
import {canUseWasmThreads, digestToHex} from '@/lib/hash.utils';

export {canUseWasmThreads} from '@/lib/hash.utils';

export async function hashFile(
  uri: string,
  algo: HashAlgo,
): Promise<string | null> {
  if (algo === 'none')
    return null;
  const blake3 = await loadBlake3();
  const response = await fetch(uri);
  if (!response.ok)
    throw new Error(`Failed to read file for hashing (${response.status})`);
  return hashStream(blake3, response);
}

type Blake3Fn = {
  (data: Uint8Array): Uint8Array;
  create(): {
    update(data: Uint8Array): void;
    digest(): Uint8Array;
  };
};

let blake3Promise: Promise<Blake3Fn> | null = null;

async function loadBlake3(): Promise<Blake3Fn> {
  if (!blake3Promise) {
    blake3Promise = (async () => {
      if (canUseWasmThreads()) {
        try {
          const {blake3} = await import('@awasm/noble/wasm_threads.js');
          return blake3 as Blake3Fn;
        } catch (error) {
          console.warn('BLAKE3 wasm_threads unavailable, falling back to WASM', error);
        }
      }

      const {blake3} = await import('@awasm/noble');
      return blake3 as Blake3Fn;
    })();
  }
  return blake3Promise;
}

async function hashStream(blake3: Blake3Fn, response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) {
    return digestToHex(blake3(new Uint8Array(await response.arrayBuffer())));
  }
  const hasher = blake3.create();
  while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    if (value?.length) {
      hasher.update(value);
    }
  }
  return digestToHex(hasher.digest());
}

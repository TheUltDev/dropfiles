import {fileHash} from '@preeternal/react-native-file-hash';
import type {HashAlgo} from '@/lib/access';

export async function hashFile(uri: string, algo: HashAlgo): Promise<string | null> {
  if (algo === 'none') return null;
  return fileHash(uri, 'BLAKE3');
}

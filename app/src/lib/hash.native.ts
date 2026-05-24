import type {HashAlgo} from '@/lib/access';

export async function hashFile(uri: string, algo: HashAlgo): Promise<string | null> {
  if (algo === 'none') return null;
  try {
    const {fileHash} = await import('@preeternal/react-native-file-hash');
    return fileHash(uri, 'BLAKE3');
  } catch (error) {
    console.warn('FileHash native module unavailable', error);
    return null;
  }
}

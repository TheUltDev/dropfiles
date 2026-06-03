import type {HashAlgo} from '@/lib/access';

export declare function hashFile(
  uri: string,
  algo: HashAlgo,
): Promise<string | null>;

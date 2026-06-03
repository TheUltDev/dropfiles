import {initLocalDb} from '@/lib/db/local';
import {initSupabase} from '@/lib/supabase';
import {uploadManager} from '@/lib/storage/manager';

export async function runSharedAppBoot(): Promise<void> {
  await initLocalDb();
  await initSupabase();
  await uploadManager.init();
}

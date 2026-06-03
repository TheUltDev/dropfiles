import {CloudUploader} from 'react-native-nitro-cloud-uploader';
import {runSharedAppBoot} from './boot.shared';

export async function runAppBoot(): Promise<void> {
  await runSharedAppBoot();
  // Keep JS bridge warm for background upload events
  CloudUploader.addListener('upload-progress', () => {});
}

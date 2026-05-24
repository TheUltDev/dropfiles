import '../../crypto';
import '@/global.css';
import '@heroui/styles/dist/heroui.min.css';
import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {Slot} from 'expo-router';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  useFonts,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';
import {initSupabase} from '@/lib/supabase';
import {initLocalDb} from '@/lib/db/local';
import {uploadManager} from '@/lib/storage/manager';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  });
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      await initLocalDb();
      await initSupabase();
      await uploadManager.init();

      if (Platform.OS !== 'web') {
        try {
          const {CloudUploader} = await import('react-native-nitro-cloud-uploader');
          CloudUploader.addListener('upload-progress', () => {
            // keep JS bridge warm for background upload events
          });
        } catch (error) {
          console.warn('CloudUploader unavailable in this build', error);
        }
      }

      if (!cancelled) setBooted(true);
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!fontsLoaded || !booted) return null;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Slot />
    </GestureHandlerRootView>
  );
}

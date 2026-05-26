import '../../crypto';
import '@/global.css';

import {Slot} from 'expo-router';
import {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {uploadManager} from '@/lib/storage/manager';
import {initSupabase} from '@/lib/supabase';
import {initLocalDb} from '@/lib/db/local';
import {UiProvider} from '@workspace/ui';
import {
  useFonts,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';

export default function RootLayout() {
  const [booted, setBooted] = useState(false);
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  });

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      await initLocalDb();
      await initSupabase();
      await uploadManager.init();
      if (!cancelled) setBooted(true);
    }
    void boot();
    return () => {cancelled = true};
  }, []);

  if (!fontsLoaded || !booted) return null;

  return (
    <GestureHandlerRootView style={{flex:1}}>
      <UiProvider>
        <Slot/>
      </UiProvider>
    </GestureHandlerRootView>
  );
}

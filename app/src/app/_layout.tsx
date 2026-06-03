import '../../crypto';
import '@/lib/layout/styles';

import {Slot} from 'expo-router';
import {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useFonts} from '@expo-google-fonts/geist';
import {UiProvider} from '@workspace/ui';

import {runAppBoot} from '@/lib/layout/boot';
import {geistFonts} from '@/lib/layout/fonts';

export default function RootLayout() {
  const [booted, setBooted] = useState(false);
  const [fontsLoaded] = useFonts(geistFonts);

  useEffect(() => {
    let cancelled = false;
    void runAppBoot().then(() => {
      if (!cancelled) setBooted(true);
    });
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

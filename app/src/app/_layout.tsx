import '../../crypto';
import '@/global.css';
import {Slot} from 'expo-router';
import {HeroUINativeProvider} from 'heroui-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  useFonts,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <HeroUINativeProvider config={{devInfo: {stylingPrinciples: false}}}>
        <Slot/>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}

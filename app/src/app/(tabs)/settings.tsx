import {View} from 'react-native';
import {Button} from 'heroui-native';
import {Title, Subtitle} from '@/components/base/text';

export default function SettingsScreen() {
  return (
    <View className="flex-1 flex-row justify-center bg-background">
      <View className="flex-1 max-w-[800px] items-center gap-4 px-6 pt-safe pb-safe-offset-4">
        <View className="flex-1 items-center justify-center gap-6 px-6">
          <Title className="text-center">Welcome back,</Title>
          <Subtitle className="text-center text-muted">Human</Subtitle>
        </View>
      </View>
    </View>
  );
}

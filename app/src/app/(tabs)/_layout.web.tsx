import {Tabs, TabList, TabTrigger, TabSlot, type TabTriggerSlotProps, type TabListProps} from 'expo-router/ui';
import {Pressable, View} from 'react-native';
import {twMerge} from 'tailwind-merge';
import {Small} from '@/components/base/text';
import {displayName} from '@/../package.json';

export default function TabsLayout() {
  return (
    <Tabs>
      <TabSlot style={{height: '100%'}}/>
      <TabList asChild>
        <TabListWeb>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Dashboard</TabButton>
          </TabTrigger>
          <TabTrigger name="files" href="/files" asChild>
            <TabButton>Files</TabButton>
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton>Settings</TabButton>
          </TabTrigger>
          <TabTrigger name="usage" href="/usage" asChild>
            <TabButton>Usage</TabButton>
          </TabTrigger>
        </TabListWeb>
      </TabList>
    </Tabs>
  );
}

function TabListWeb({children}: TabListProps) {
  return (
    <View className="absolute w-full flex-row items-center justify-center p-4">
      <View className="max-w-[800px] flex-grow flex-row items-center gap-2 rounded-3xl bg-surface-secondary px-8 py-2">
        <Small className="mr-auto font-bold">
          {displayName}
        </Small>
        {children}
      </View>
    </View>
  );
}

function TabButton({children, isFocused, ...props}: TabTriggerSlotProps) {
  return (
    <Pressable {...props} className="active:opacity-70">
      <View className={twMerge('rounded-xl px-4 py-1', isFocused ? 'bg-surface-tertiary' : 'bg-surface-secondary')}>
        <Small className={isFocused ? 'text-foreground' : 'text-muted'}>
          {children}
        </Small>
      </View>
    </Pressable>
  );
}

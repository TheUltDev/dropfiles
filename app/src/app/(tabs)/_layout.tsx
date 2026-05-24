import {NativeTabs} from 'expo-router/unstable-native-tabs';
import {useThemeColor} from 'heroui-native';

export default function TabsLayout() {
  const [foreground, background, surfaceSecondary] = useThemeColor([
    'foreground',
    'background',
    'surface-secondary',
  ]);

  return (
    <NativeTabs
      backgroundColor={background}
      indicatorColor={surfaceSecondary}
      labelStyle={{selected: {color: foreground}}}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Dashboard</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="route"/>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="files">
        <NativeTabs.Trigger.Label>Files</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="folder" md="folder"/>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape.fill" md="settings"/>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="usage">
        <NativeTabs.Trigger.Label>Usage</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.bar.fill" md="bar_chart"/>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

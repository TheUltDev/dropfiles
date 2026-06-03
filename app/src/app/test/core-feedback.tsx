'use client';

import {View} from 'react-native';
import {Alert, Spinner} from '@workspace/ui';
import {TestScaffold, DemoSection} from '@/components/test/scaffold';

export default function CoreFeedbackScreen() {
  return (
    <TestScaffold
      title="Core feedback"
      subtitle="Spinner and alert. Wrap app in Toast.Provider for toast demos.">
      <DemoSection title="Spinner">
        <View className="flex-row items-center gap-4">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </View>
      </DemoSection>

      <DemoSection title="Alert">
        <Alert status="warning">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Heads up</Alert.Title>
            <Alert.Description>Native overlays need GestureHandlerRootView at the app root.</Alert.Description>
          </Alert.Content>
        </Alert>
      </DemoSection>
    </TestScaffold>
  );
}

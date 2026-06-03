'use client';

import {useState} from 'react';
import {View} from 'react-native';
import {Accordion, Card, Tabs} from '@workspace/ui';
import {TestScaffold, DemoSection} from '@/components/test/scaffold';
import {Body} from '@/components/base/text';

export default function CoreStructureScreen() {
  const [tab, setTab] = useState('files');

  return (
    <TestScaffold title="Core structure" subtitle="Card, tabs, accordion">
      <DemoSection title="Card">
        <Card>
          <Card.Header>
            <Card.Title>Drop summary</Card.Title>
            <Card.Description>Shared across web and native.</Card.Description>
          </Card.Header>
          <Card.Body>
            <Body>Card body content.</Body>
          </Card.Body>
        </Card>
      </DemoSection>

      <DemoSection title="Tabs">
        <Tabs value={tab} onValueChange={setTab}>
          <Tabs.List>
            <Tabs.Indicator />
            <Tabs.Trigger value="files">
              <Tabs.Label>Files</Tabs.Label>
            </Tabs.Trigger>
            <Tabs.Trigger value="settings">
              <Tabs.Label>Settings</Tabs.Label>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="files">
            <View className="py-4">
              <Body>Files panel</Body>
            </View>
          </Tabs.Content>
          <Tabs.Content value="settings">
            <View className="py-4">
              <Body>Settings panel</Body>
            </View>
          </Tabs.Content>
        </Tabs>
      </DemoSection>

      <DemoSection title="Accordion">
        <Accordion selectionMode="single" defaultValue="upload">
          <Accordion.Item value="upload">
            <Accordion.Trigger>
              <Body>Upload limits</Body>
              <Accordion.Indicator />
            </Accordion.Trigger>
            <Accordion.Content>
              <Body>Max file size and count apply per drop.</Body>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </DemoSection>
    </TestScaffold>
  );
}

import {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Input, Label, Select, Switch, TextField} from 'heroui-native';
import {NumberField} from 'heroui-native-pro/number-field';
import {Title, Body, Muted} from '@/components/base/text';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type AppSettings,
} from '@/lib/settings';
import {ACCESS_MODE_LABELS, type AccessMode} from '@/lib/access';
import {resetOwnerToken} from '@/lib/identity';

const accessOptions = (Object.keys(ACCESS_MODE_LABELS) as AccessMode[]).map((mode) => ({
  value: mode,
  label: ACCESS_MODE_LABELS[mode],
}));

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void loadSettings().then(setSettings);
  }, []);

  async function handleSave() {
    await saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleResetIdentity() {
    await resetOwnerToken();
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="max-w-[800px] gap-5 px-6 pt-safe pb-safe-offset-8 self-center w-full">
        <View className="gap-2 pt-4">
          <Title className="text-3xl">Settings</Title>
          <Muted>Defaults for new drops and upload behavior.</Muted>
        </View>

        <View className="gap-2">
          <Label>Default access</Label>
          <Select
            value={{
              value: settings.defaultAccessMode,
              label: ACCESS_MODE_LABELS[settings.defaultAccessMode],
            }}
            onValueChange={(next) => {
              if (!next || Array.isArray(next)) return;
              setSettings((current) => ({
                ...current,
                defaultAccessMode: next.value as AccessMode,
              }));
            }}>
            <Select.Trigger>
              <Select.Value placeholder="Choose access mode" />
              <Select.TriggerIndicator />
            </Select.Trigger>
            <Select.Portal>
              <Select.Overlay />
              <Select.Content presentation="popover">
                {accessOptions.map((option) => (
                  <Select.Item key={option.value} value={option.value} label={option.label} />
                ))}
              </Select.Content>
            </Select.Portal>
          </Select>
        </View>

        <NumberField
          value={settings.defaultExpirationDays ?? undefined}
          minValue={1}
          maxValue={365}
          onChange={(days) =>
            setSettings((current) => ({...current, defaultExpirationDays: days ?? null}))
          }>
          <Label>Default expiration (days)</Label>
          <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input placeholder="Never" />
            <NumberField.IncrementButton />
          </NumberField.Group>
        </NumberField>

        <NumberField
          value={settings.defaultMaxFiles}
          minValue={1}
          maxValue={1E6}
          onChange={(maxFiles) =>
            setSettings((current) => ({...current, defaultMaxFiles: maxFiles ?? 1}))
          }>
          <Label>Default max files</Label>
          <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input />
            <NumberField.IncrementButton />
          </NumberField.Group>
        </NumberField>

        <View className="flex-row items-center justify-between rounded-2xl bg-surface-secondary px-4 py-3">
          <View className="flex-1 pr-4">
            <Label>BLAKE3 deduplication</Label>
            <Muted>Hash files by default on new drops</Muted>
          </View>
          <Switch
            isSelected={settings.defaultHashAlgo === 'blake3'}
            onSelectedChange={(enabled) =>
              setSettings((current) => ({
                ...current,
                defaultHashAlgo: enabled ? 'blake3' : 'none',
              }))
            }
          />
        </View>

        <View className="flex-row items-center justify-between rounded-2xl bg-surface-secondary px-4 py-3">
          <View className="flex-1 pr-4">
            <Label>Wi‑Fi only uploads</Label>
            <Muted>Pause uploads when not on Wi‑Fi</Muted>
          </View>
          <Switch
            isSelected={settings.wifiOnly}
            onSelectedChange={(wifiOnly) => setSettings((current) => ({...current, wifiOnly}))}
          />
        </View>

        <TextField>
          <Label>Allowed MIME (comma-separated)</Label>
          <Input
            value={settings.allowedMime.join(', ')}
            onChangeText={(text) =>
              setSettings((current) => ({
                ...current,
                allowedMime: text
                  .split(',')
                  .map((item) => item.trim())
                  .filter(Boolean),
              }))
            }
            placeholder="Empty = all types"
            autoCapitalize="none"
          />
        </TextField>

        <Button onPress={handleSave}>{saved ? 'Saved' : 'Save settings'}</Button>
        <Button variant="secondary" onPress={handleResetIdentity}>
          Reset device identity
        </Button>

        <View className="rounded-2xl bg-surface-secondary p-4">
          <Body className="font-semibold">About</Body>
          <Muted className="mt-1">
            Web uploads use TUS. Native uploads use background multipart S3 via Nitro Cloud
            Uploader.
          </Muted>
        </View>
      </ScrollView>
    </View>
  );
}

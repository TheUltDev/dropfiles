import {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Title, Body, Muted} from '@/components/base/text';
import {AccessModeSection} from '@/components/forms/AccessModeSection';
import {AllowedMimeSection} from '@/components/forms/AllowedMimeSection';
import {ExpirationSection} from '@/components/forms/ExpirationSection';
import {HashAlgoSection} from '@/components/forms/HashAlgoSection';
import {MaxFilesSection} from '@/components/forms/MaxFilesSection';
import {Button} from '@/components/ui/Button';
import {Label} from '@/components/ui/Label';
import {Switch} from '@/components/ui/Switch';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type AppSettings,
} from '@/lib/settings';
import type {AccessMode, HashAlgo} from '@/lib/access';
import {resetOwnerToken} from '@/lib/identity';

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
          <AccessModeSection
            label="Default access"
            accessMode={settings.defaultAccessMode}
            password={undefined}
            allowedEmails={[]}
            onAccessModeChange={(defaultAccessMode: AccessMode) =>
              setSettings((current) => ({...current, defaultAccessMode}))
            }
            onPasswordChange={() => undefined}
            onAllowedEmailsChange={() => undefined}
          />
        </View>

        <ExpirationSection
          label="Default expiration"
          value={settings.defaultExpirationAt}
          onChange={(defaultExpirationAt) =>
            setSettings((current) => ({...current, defaultExpirationAt}))
          }
        />

        <MaxFilesSection
          label="Default max files"
          value={settings.defaultMaxFiles}
          onChange={(defaultMaxFiles) =>
            setSettings((current) => ({...current, defaultMaxFiles}))
          }
        />

        <HashAlgoSection
          title="BLAKE3 deduplication"
          description="Hash files by default on new drops"
          value={settings.defaultHashAlgo}
          onChange={(defaultHashAlgo: HashAlgo) =>
            setSettings((current) => ({...current, defaultHashAlgo}))
          }
        />

        <View className="flex-row items-center justify-between rounded-2xl bg-surface-secondary px-4 py-3">
          <View className="flex-1 pr-4">
            <Label>Wi‑Fi only uploads</Label>
            <Muted>Pause uploads when not on Wi‑Fi</Muted>
          </View>
          <Switch
            isSelected={settings.wifiOnly}
            aria-label="Wi-Fi only uploads"
            onSelectedChange={(wifiOnly) => setSettings((current) => ({...current, wifiOnly}))}
          />
        </View>

        <AllowedMimeSection
          label="Allowed MIME (comma-separated)"
          value={settings.allowedMime}
          placeholder="Empty = all types"
          onChange={(allowedMime) => setSettings((current) => ({...current, allowedMime}))}
        />

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

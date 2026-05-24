'use client';

import {Platform, ScrollView, View} from 'react-native';
import {useEffect, useState} from 'react';
import {Button, Label, Switch} from '@workspace/ui';
import {AccessModeSection} from '@/components/forms/AccessModeSection';
import {AllowedMimeSection} from '@/components/forms/AllowedMimeSection';
import {ExpirationSection} from '@/components/forms/ExpirationSection';
import {HashAlgoSection} from '@/components/forms/HashAlgoSection';
import {MaxFilesSection} from '@/components/forms/MaxFilesSection';
import {Title, Muted} from '@/components/base/text';
import {resetOwnerToken} from '@/lib/identity';
import {loadSettings, saveSettings, type AppSettings} from '@/lib/settings';
import type {AccessMode, HashAlgo} from '@/lib/access';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadSettings().then((loaded) => {
      if (!cancelled) setSettings(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    if (!settings) return;
    await saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleResetIdentity() {
    await resetOwnerToken();
  }

  if (settings == null) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Muted>Loading settings…</Muted>
      </View>
    );
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
              setSettings((current) => (current ? {...current, defaultAccessMode} : current))
            }
            onPasswordChange={() => undefined}
            onAllowedEmailsChange={() => undefined}
          />
        </View>

        <ExpirationSection
          label="Default expiration"
          value={settings.defaultExpirationAt}
          onChange={(defaultExpirationAt) =>
            setSettings((current) => (current ? {...current, defaultExpirationAt} : current))
          }
        />

        <MaxFilesSection
          label="Default max files"
          value={settings.defaultMaxFiles}
          onChange={(defaultMaxFiles) =>
            setSettings((current) => (current ? {...current, defaultMaxFiles} : current))
          }
        />

        <HashAlgoSection
          title="File hashing"
          description="Enable to deduplicate uploads"
          value={settings.defaultHashAlgo}
          onChange={(defaultHashAlgo: HashAlgo) =>
            setSettings((current) => (current ? {...current, defaultHashAlgo} : current))
          }
        />

        {Platform.OS !== 'web' ? (
          <View className="flex-row items-center justify-between rounded-2xl bg-surface-secondary px-4 py-3">
            <View className="flex-1 pr-4">
              <Label>Wi‑Fi only uploads</Label>
              <Muted>Pause uploads when not on Wi‑Fi</Muted>
            </View>
            <Switch
              isSelected={settings.wifiOnly}
              aria-label="Wi-Fi only uploads"
              onSelectedChange={(wifiOnly) =>
                setSettings((current) => (current ? {...current, wifiOnly} : current))
              }
            />
          </View>
        ) : null}

        <AllowedMimeSection
          label="Allowed MIME (comma-separated)"
          value={settings.allowedMime}
          placeholder="Empty = all types"
          onChange={(allowedMime) =>
            setSettings((current) => (current ? {...current, allowedMime} : current))
          }
        />

        <Button onPress={handleSave}>{saved ? 'Saved' : 'Save settings'}</Button>
        <Button variant="secondary" onPress={handleResetIdentity}>
          Reset device identity
        </Button>
      </ScrollView>
    </View>
  );
}

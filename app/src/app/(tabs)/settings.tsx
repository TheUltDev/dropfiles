'use client';

import type {AccessMode, HashAlgo} from '@/lib/access';
import type {AppSettings} from '@/lib/settings';

import {useEffect, useState} from 'react';
import {Platform, ScrollView, View} from 'react-native';
import {Button, Label, Switch} from '@workspace/ui';
import {loadSettings, saveSettings} from '@/lib/settings';
import {resetOwnerToken} from '@/lib/identity';
import {Title, Muted} from '@/components/base/text';
import {MaxFilesSection} from '@/components/forms/MaxFilesSection';
import {HashAlgoSection} from '@/components/forms/HashAlgoSection';
import {AccessModeSection} from '@/components/forms/AccessModeSection';
import {ExpirationSection} from '@/components/forms/ExpirationSection';
import {AllowedMimeSection} from '@/components/forms/AllowedMimeSection';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!settings) return;
    await saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (settings == null) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Muted>Loading settings…</Muted>
      </View>
    );
  }

  useEffect(() => {
    let cancelled = false;
    void loadSettings().then((loaded) => {
      if (!cancelled) setSettings(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
            onPasswordChange={() => undefined}
            onAllowedEmailsChange={() => undefined}
            onAccessModeChange={(defaultAccessMode: AccessMode) =>
              setSettings(c => (c ? {...c, defaultAccessMode} : c))
            }
          />
        </View>
        <ExpirationSection
          label="Default expiration"
          value={settings.defaultExpirationAt}
          onChange={(defaultExpirationAt) =>
            setSettings(c => (c ? {...c, defaultExpirationAt} : c))
          }
        />
        <MaxFilesSection
          label="Default max files"
          value={settings.defaultMaxFiles}
          onChange={(defaultMaxFiles) =>
            setSettings(c => (c ? {...c, defaultMaxFiles} : c))
          }
        />
        <HashAlgoSection
          title="File hashing"
          description="Enable to deduplicate uploads"
          value={settings.defaultHashAlgo}
          onChange={(defaultHashAlgo: HashAlgo) =>
            setSettings(c => (c ? {...c, defaultHashAlgo} : c))
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
                setSettings(c => (c ? {...c, wifiOnly} : c))
              }
            />
          </View>
        ) : null}
        <AllowedMimeSection
          label="Allowed MIME (comma-separated)"
          value={settings.allowedMime}
          placeholder="Empty = all types"
          onChange={(allowedMime) =>
            setSettings(c => (c ? {...c, allowedMime} : c))
          }
        />
        <Button onPress={handleSave}>
          {saved ? 'Saved' : 'Save settings'}
        </Button>
        <Button variant="secondary" onPress={resetOwnerToken}>
          Reset device identity
        </Button>
      </ScrollView>
    </View>
  );
}

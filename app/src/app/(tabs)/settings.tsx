import {useEffect, useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {
  getLocalTimeZone,
  parseDate,
  today,
  type CalendarDate,
} from '@internationalized/date';
import {Button, Input, Label, Select, Switch, TextField} from 'heroui-native';
import {Calendar} from 'heroui-native-pro/calendar';
import {DatePicker} from 'heroui-native-pro/date-picker';
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

function expirationParts(iso: string | null) {
  if (!iso) {
    return {hour: 23, minute: 59};
  }
  const date = new Date(iso);
  return {hour: date.getHours(), minute: date.getMinutes()};
}

function mergeExpirationDate(
  currentIso: string | null,
  date: CalendarDate,
  hour: number,
  minute: number,
): string {
  const merged = date.toDate(getLocalTimeZone());
  merged.setHours(hour, minute, 59, 0);
  return merged.toISOString();
}

function formatExpirationLabel(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function ExpirationCalendar() {
  return (
    <DatePicker.Calendar minValue={today(getLocalTimeZone())}>
      <Calendar.Header>
        <Calendar.YearPickerTrigger>
          <Calendar.YearPickerTriggerHeading />
          <Calendar.YearPickerTriggerIndicator />
        </Calendar.YearPickerTrigger>
        <Calendar.NavButton slot="previous" />
        <Calendar.NavButton slot="next" />
      </Calendar.Header>
      <Calendar.Grid>
        <Calendar.GridHeader>
          {(day) => <Calendar.HeaderCell day={day} />}
        </Calendar.GridHeader>
        <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
      </Calendar.Grid>
      <Calendar.YearPickerGrid>
        <Calendar.YearPickerGridBody>
          {({year, isSelected}) => (
            <Calendar.YearPickerCell year={year} isSelected={isSelected} />
          )}
        </Calendar.YearPickerGridBody>
      </Calendar.YearPickerGrid>
    </DatePicker.Calendar>
  );
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const expirationTime = useMemo(
    () => expirationParts(settings.defaultExpirationAt),
    [settings.defaultExpirationAt],
  );
  const expirationDateValue = useMemo(() => {
    if (!settings.defaultExpirationAt) return undefined;
    return {
      value: settings.defaultExpirationAt.slice(0, 10),
      label: formatExpirationLabel(settings.defaultExpirationAt),
    };
  }, [settings.defaultExpirationAt]);

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

        <View className="gap-2">
          <Label>Default expiration</Label>
          <DatePicker
            value={expirationDateValue}
            onValueChange={(next) => {
              if (!next) {
                setSettings((current) => ({...current, defaultExpirationAt: null}));
                return;
              }
              const {hour, minute} = expirationParts(settings.defaultExpirationAt);
              setSettings((current) => ({
                ...current,
                defaultExpirationAt: mergeExpirationDate(
                  current.defaultExpirationAt,
                  parseDate(next.value),
                  hour,
                  minute,
                ),
              }));
            }}>
            <DatePicker.Select presentation="bottom-sheet">
              <DatePicker.Trigger>
                <DatePicker.Value placeholder="Never" />
                <DatePicker.TriggerIndicator />
              </DatePicker.Trigger>
              <DatePicker.Portal>
                <DatePicker.Overlay />
                <DatePicker.Content presentation="bottom-sheet">
                  <ExpirationCalendar />
                </DatePicker.Content>
              </DatePicker.Portal>
            </DatePicker.Select>
          </DatePicker>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <NumberField
                value={expirationTime.hour}
                minValue={0}
                maxValue={23}
                isDisabled={settings.defaultExpirationAt == null}
                onChange={(hour) => {
                  if (hour == null || settings.defaultExpirationAt == null) return;
                  const date = parseDate(settings.defaultExpirationAt.slice(0, 10));
                  setSettings((current) => ({
                    ...current,
                    defaultExpirationAt: mergeExpirationDate(
                      current.defaultExpirationAt,
                      date,
                      hour,
                      expirationTime.minute,
                    ),
                  }));
                }}>
                <Label>Hour</Label>
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input />
                  <NumberField.IncrementButton />
                </NumberField.Group>
              </NumberField>
            </View>
            <View className="flex-1">
              <NumberField
                value={expirationTime.minute}
                minValue={0}
                maxValue={59}
                isDisabled={settings.defaultExpirationAt == null}
                onChange={(minute) => {
                  if (minute == null || settings.defaultExpirationAt == null) return;
                  const date = parseDate(settings.defaultExpirationAt.slice(0, 10));
                  setSettings((current) => ({
                    ...current,
                    defaultExpirationAt: mergeExpirationDate(
                      current.defaultExpirationAt,
                      date,
                      expirationTime.hour,
                      minute,
                    ),
                  }));
                }}>
                <Label>Minute</Label>
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input />
                  <NumberField.IncrementButton />
                </NumberField.Group>
              </NumberField>
            </View>
          </View>
          <Muted>Leave the date empty for no expiration.</Muted>
          {settings.defaultExpirationAt ? (
            <Button
              variant="secondary"
              onPress={() => setSettings((current) => ({...current, defaultExpirationAt: null}))}>
              Clear expiration
            </Button>
          ) : null}
        </View>

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

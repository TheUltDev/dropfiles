import {useMemo} from 'react';
import {View} from 'react-native';
import {Input, Label, Select, Switch, TextField} from 'heroui-native';
import {NumberField} from 'heroui-native-pro/number-field';
import type {AccessConfig, AccessMode} from '@/lib/access';
import {ACCESS_MODE_LABELS, hashLabel, parseEmailList} from '@/lib/access';
import {Body, Muted, Small} from '@/components/base/text';

type Props = {
  value: AccessConfig;
  onChange: (value: AccessConfig) => void;
};

const accessOptions = (Object.keys(ACCESS_MODE_LABELS) as AccessMode[]).map((mode) => ({
  value: mode,
  label: ACCESS_MODE_LABELS[mode],
}));

function optionFor<T extends string>(value: T, label: string) {
  return {value, label};
}

export function AccessConfigForm({value, onChange}: Props) {
  const accessValue = useMemo(
    () => optionFor(value.accessMode, ACCESS_MODE_LABELS[value.accessMode]),
    [value.accessMode],
  );
  const expirationInput = value.expiresAt?.slice(0, 10) ?? '';

  return (
    <View className="gap-5">
      <View className="gap-2">
        <Label>Access</Label>
        <Select
          value={accessValue}
          onValueChange={(next) => {
            if (!next || Array.isArray(next)) return;
            onChange({...value, accessMode: next.value as AccessMode});
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
        <Muted>{ACCESS_MODE_LABELS[value.accessMode]}</Muted>
      </View>

      {value.accessMode === 'password' ? (
        <TextField>
          <Label>Password</Label>
          <Input
            value={value.password ?? ''}
            onChangeText={(password: string) => onChange({...value, password})}
            placeholder="Required to download"
            secureTextEntry
          />
        </TextField>
      ) : null}

      {value.accessMode === 'email' ? (
        <TextField>
          <Label>Allowed emails</Label>
          <Input
            value={value.allowedEmails.join(', ')}
            onChangeText={(text: string) =>
              onChange({...value, allowedEmails: parseEmailList(text)})
            }
            placeholder="alice@example.com, bob@example.com"
            autoCapitalize="none"
          />
          <Muted>Comma-separated list</Muted>
        </TextField>
      ) : null}

      <TextField>
        <Label>Expiration (YYYY-MM-DD)</Label>
        <Input
          value={expirationInput}
          onChangeText={(text: string) => {
            const trimmed = text.trim();
            onChange({
              ...value,
              expiresAt: trimmed ? new Date(`${trimmed}T23:59:59`).toISOString() : null,
            });
          }}
          placeholder="Leave empty for no expiration"
          autoCapitalize="none"
        />
      </TextField>

      <NumberField
        value={value.maxFiles}
        minValue={1}
        maxValue={100}
        onChange={(maxFiles) => onChange({...value, maxFiles: maxFiles ?? 1})}>
        <Label>Max files</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input />
          <NumberField.IncrementButton />
        </NumberField.Group>
      </NumberField>

      <NumberField
        value={value.maxBytes != null ? Math.round(value.maxBytes / (1024 * 1024)) : undefined}
        minValue={1}
        onChange={(mb) =>
          onChange({
            ...value,
            maxBytes: mb != null ? mb * 1024 * 1024 : null,
          })
        }>
        <Label>Max total size (MB)</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input placeholder="Unlimited" />
          <NumberField.IncrementButton />
        </NumberField.Group>
      </NumberField>

      <TextField>
        <Label>Allowed MIME types</Label>
        <Input
          value={value.allowedMime.join(', ')}
          onChangeText={(text: string) =>
            onChange({
              ...value,
              allowedMime: text
                .split(',')
                .map((item: string) => item.trim())
                .filter(Boolean),
            })
          }
          placeholder="image/*, application/pdf (empty = all)"
          autoCapitalize="none"
        />
      </TextField>

      <View className="flex-row items-center justify-between rounded-2xl bg-surface-secondary px-4 py-3">
        <View className="flex-1 pr-4">
          <Label>BLAKE3 file hash</Label>
          <Muted>Compute a BLAKE3 digest and deduplicate uploads</Muted>
        </View>
        <Switch
          isSelected={value.hashAlgo === 'blake3'}
          onSelectedChange={(enabled) =>
            onChange({...value, hashAlgo: enabled ? 'blake3' : 'none'})
          }
        />
      </View>

      <View className="rounded-2xl bg-surface-secondary p-4">
        <Small className="font-semibold">Summary</Small>
        <Body className="mt-1 text-muted">
          {value.maxFiles} file(s),{' '}
          {value.maxBytes ? `${Math.round(value.maxBytes / (1024 * 1024))} MB max` : 'no size limit'}
          , hash: {hashLabel(value.hashAlgo)}
        </Body>
      </View>
    </View>
  );
}

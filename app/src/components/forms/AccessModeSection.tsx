import type {AccessMode} from '@/lib/access';
import {ACCESS_MODE_LABELS, parseEmailList} from '@/lib/access';
import {Select} from '@/components/ui/Select';
import {TextField} from '@/components/ui/TextField';
import type {SelectOption} from '@/components/ui/types';

type Props = {
  label?: string;
  accessMode: AccessMode;
  password?: string;
  allowedEmails: string[];
  onAccessModeChange: (mode: AccessMode) => void;
  onPasswordChange: (password: string) => void;
  onAllowedEmailsChange: (emails: string[]) => void;
};

const accessOptions: SelectOption<AccessMode>[] = (
  Object.keys(ACCESS_MODE_LABELS) as AccessMode[]
).map((mode) => ({
  value: mode,
  label: ACCESS_MODE_LABELS[mode],
}));

export function AccessModeSection({
  label = 'Access',
  accessMode,
  password,
  allowedEmails,
  onAccessModeChange,
  onPasswordChange,
  onAllowedEmailsChange,
}: Props) {
  return (
    <>
      <Select
        label={label}
        value={accessMode}
        options={accessOptions}
        placeholder="Choose access mode"
        onChange={onAccessModeChange}
      />

      {accessMode === 'password' ? (
        <TextField
          label="Password"
          value={password ?? ''}
          onChangeText={onPasswordChange}
          placeholder="Required to download"
          secureTextEntry
        />
      ) : null}

      {accessMode === 'email' ? (
        <TextField
          label="Allowed emails"
          value={allowedEmails.join(', ')}
          onChangeText={(text) => onAllowedEmailsChange(parseEmailList(text))}
          placeholder="alice@example.com, bob@example.com"
          helperText="Comma-separated list"
          autoCapitalize="none"
        />
      ) : null}
    </>
  );
}

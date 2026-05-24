import {Platform} from 'react-native';
import type {AccessMode} from '@/lib/access';
import {ACCESS_MODE_LABELS, parseEmailList} from '@/lib/access';
import {
  Description,
  Input,
  Label,
  Select,
  TextField,
  type SelectOption,
} from '@workspace/ui';

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

function ControlledTextField({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
  secureTextEntry,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  if (Platform.OS === 'web') {
    return (
      <TextField className="w-full" value={value} onChange={onChangeText}>
        <Label>{label}</Label>
        <Input
          placeholder={placeholder}
          type={secureTextEntry ? 'password' : 'text'}
          autoCapitalize={autoCapitalize}
        />
        {helperText ? <Description>{helperText}</Description> : null}
      </TextField>
    );
  }

  return (
    <>
      <TextField>
        <Label>{label}</Label>
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
        />
      </TextField>
      {helperText ? <Description>{helperText}</Description> : null}
    </>
  );
}

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
      <Select className="w-full gap-2" value={accessMode} onChange={(mode) => onAccessModeChange(mode as AccessMode)}>
        <Label>{label}</Label>
        <Select.Trigger>
          <Select.Value placeholder="Choose access mode" />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          {accessOptions.map((option) => (
            <Select.Item key={option.value} value={option.value} label={option.label} />
          ))}
        </Select.Popover>
      </Select>

      {accessMode === 'password' ? (
        <ControlledTextField
          label="Password"
          value={password ?? ''}
          onChangeText={onPasswordChange}
          placeholder="Required to download"
          secureTextEntry
        />
      ) : null}

      {accessMode === 'email' ? (
        <ControlledTextField
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

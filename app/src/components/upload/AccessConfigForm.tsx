import type {AccessConfig, AccessMode, HashAlgo} from '@/lib/access';
import {View} from 'react-native';
import {AccessModeSection} from '@/components/forms/AccessModeSection';
import {AllowedMimeSection} from '@/components/forms/AllowedMimeSection';
import {ExpirationSection} from '@/components/forms/ExpirationSection';
import {HashAlgoSection} from '@/components/forms/HashAlgoSection';
import {MaxBytesSection} from '@/components/forms/MaxBytesSection';
import {MaxFilesSection} from '@/components/forms/MaxFilesSection';

type Props = {
  value: AccessConfig;
  onChange: (value: AccessConfig) => void;
};

export function AccessConfigForm({value, onChange}: Props) {
  return (
    <View className="gap-5">
      <View className="gap-2">
        <AccessModeSection
          accessMode={value.accessMode}
          password={value.password}
          allowedEmails={value.allowedEmails}
          onAccessModeChange={(accessMode) => onChange({...value, accessMode})}
          onPasswordChange={(password) => onChange({...value, password})}
          onAllowedEmailsChange={(allowedEmails) => onChange({...value, allowedEmails})}
        />
      </View>

      <ExpirationSection
        value={value.expiresAt ?? null}
        onChange={(expiresAt) => onChange({...value, expiresAt})}
      />

      <MaxFilesSection
        value={value.maxFiles}
        maxValue={100}
        onChange={(maxFiles) => onChange({...value, maxFiles})}
      />

      <MaxBytesSection
        valueMb={value.maxBytes != null ? Math.round(value.maxBytes / (1024 * 1024)) : undefined}
        onChangeMb={(mb) =>
          onChange({
            ...value,
            maxBytes: mb != null ? mb * 1024 * 1024 : null,
          })
        }
      />

      <AllowedMimeSection
        value={value.allowedMime}
        onChange={(allowedMime) => onChange({...value, allowedMime})}
      />

      <HashAlgoSection
        value={value.hashAlgo}
        onChange={(hashAlgo: HashAlgo) => onChange({...value, hashAlgo})}
      />
    </View>
  );
}

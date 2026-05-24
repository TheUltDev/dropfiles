import {View} from 'react-native';
import {Muted} from '@/components/base/text';
import {Button, DateTimeField} from '@workspace/ui';
import {defaultExpirationAt} from '@/lib/expiration';

type Props = {
  label?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  helperText?: string;
};

export function ExpirationSection({
  label = 'Expiration',
  value,
  onChange,
  helperText = 'Leave empty for no expiration.',
}: Props) {
  return (
    <View className="gap-2">
      {value == null ? (
        <Button variant="secondary" onPress={() => onChange(defaultExpirationAt())}>
          Set expiration
        </Button>
      ) : (
        <DateTimeField
          label={label}
          value={value}
          minimumDate={new Date()}
          onChange={onChange}
        />
      )}
      <Muted>{helperText}</Muted>
      {value ? (
        <Button variant="secondary" onPress={() => onChange(null)}>
          Clear expiration
        </Button>
      ) : null}
    </View>
  );
}

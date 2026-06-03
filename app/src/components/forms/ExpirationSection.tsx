import {View} from 'react-native';
import {Muted} from '@/components/base/text';
import {Button, CellDateTime} from '@workspace/ui';
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
        <Button
          variant="secondary"
          onPress={() => onChange(defaultExpirationAt())}>
          Set expiration
        </Button>
      ) : (
        <CellDateTime
          value={value}
          minimumDate={new Date()}
          onChange={onChange}
          aria-label={label}>
          <CellDateTime.Trigger>
            <CellDateTime.Label>{label}</CellDateTime.Label>
            <CellDateTime.Value />
            <CellDateTime.Indicator />
          </CellDateTime.Trigger>
          <CellDateTime.Popover>
            <CellDateTime.Wheel />
          </CellDateTime.Popover>
        </CellDateTime>
      )}
      <Muted>{helperText}</Muted>
      {value ? (
        <Button
          variant="secondary"
          onPress={() => onChange(null)}>
          Clear expiration
        </Button>
      ) : null}
    </View>
  );
}

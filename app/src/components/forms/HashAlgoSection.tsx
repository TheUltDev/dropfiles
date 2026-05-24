import {View} from 'react-native';
import {Muted} from '@/components/base/text';
import {Label} from '@/components/ui/Label';
import {Switch} from '@/components/ui/Switch';
import type {HashAlgo} from '@/lib/access';

type Props = {
  title?: string;
  description?: string;
  value: HashAlgo;
  onChange: (value: HashAlgo) => void;
};

export function HashAlgoSection({
  title = 'BLAKE3 file hash',
  description = 'Compute a BLAKE3 digest and deduplicate uploads',
  value,
  onChange,
}: Props) {
  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-surface-secondary px-4 py-3">
      <View className="flex-1 pr-4">
        <Label>{title}</Label>
        <Muted>{description}</Muted>
      </View>
      <Switch
        isSelected={value === 'blake3'}
        aria-label={title}
        onSelectedChange={(enabled) => onChange(enabled ? 'blake3' : 'none')}
      />
    </View>
  );
}

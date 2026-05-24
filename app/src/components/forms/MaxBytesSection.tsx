import {NumberField} from '@/components/ui/NumberField';

type Props = {
  label?: string;
  valueMb: number | undefined;
  onChangeMb: (valueMb: number | undefined) => void;
  minValue?: number;
};

export function MaxBytesSection({
  label = 'Max total size (MB)',
  valueMb,
  onChangeMb,
  minValue = 1,
}: Props) {
  return (
    <NumberField
      label={label}
      value={valueMb}
      minValue={minValue}
      placeholder="Unlimited"
      onChange={onChangeMb}
    />
  );
}

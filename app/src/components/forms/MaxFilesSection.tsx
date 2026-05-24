import {NumberField} from '@/components/ui/NumberField';

type Props = {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
};

export function MaxFilesSection({
  label = 'Max files',
  value,
  onChange,
  minValue = 1,
  maxValue = 1_000_000,
}: Props) {
  return (
    <NumberField
      label={label}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      onChange={(next) => onChange(next ?? minValue)}
    />
  );
}

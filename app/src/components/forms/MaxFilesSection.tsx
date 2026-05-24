import {Label, NumberField} from '@workspace/ui';

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
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      onChange={(next) => onChange(next ?? minValue)}>
      <Label>{label}</Label>
      <NumberField.Group>
        <NumberField.DecrementButton />
        <NumberField.Input />
        <NumberField.IncrementButton />
      </NumberField.Group>
    </NumberField>
  );
}

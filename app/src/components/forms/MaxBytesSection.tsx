import {Label, NumberField} from '@workspace/ui';

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
    <NumberField value={valueMb} minValue={minValue} onChange={onChangeMb}>
      <Label>{label}</Label>
      <NumberField.Group>
        <NumberField.DecrementButton />
        <NumberField.Input placeholder="Unlimited" />
        <NumberField.IncrementButton />
      </NumberField.Group>
    </NumberField>
  );
}

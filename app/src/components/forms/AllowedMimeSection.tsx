import {Platform} from 'react-native';
import {Description, Input, Label, TextField} from '@workspace/ui';

type Props = {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  helperText?: string;
};

export function AllowedMimeSection({
  label = 'Allowed MIME types',
  value,
  onChange,
  placeholder = 'image/*, application/pdf (empty = all)',
  helperText,
}: Props) {
  const textValue = value.join(', ');

  if (Platform.OS === 'web') {
    return (
      <TextField className="w-full" value={textValue} onChange={(next: string) => onChange(parseList(next))}>
        <Label>{label}</Label>
        <Input placeholder={placeholder} autoCapitalize="none" />
        {helperText ? <Description>{helperText}</Description> : null}
      </TextField>
    );
  }

  return (
    <>
      <TextField>
        <Label>{label}</Label>
        <Input
          value={textValue}
          onChangeText={(next) => onChange(parseList(next))}
          placeholder={placeholder}
          autoCapitalize="none"
        />
      </TextField>
      {helperText ? <Description>{helperText}</Description> : null}
    </>
  );
}

function parseList(text: string): string[] {
  return text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

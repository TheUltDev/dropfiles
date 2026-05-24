import {TextField} from '@/components/ui/TextField';

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
  return (
    <TextField
      label={label}
      value={value.join(', ')}
      onChangeText={(text) =>
        onChange(
          text
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
        )
      }
      placeholder={placeholder}
      helperText={helperText}
      autoCapitalize="none"
    />
  );
}

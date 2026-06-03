/**
 * Cross-platform Autocomplete props.
 * Web uses `@heroui/react` Autocomplete; native uses a Select + Chip polyfill
 * until `heroui-native` ships Autocomplete.
 */
export type AutocompleteItem = {
  id: string;
  name: string;
};

export type AutocompleteProps = {
  label?: string;
  items: AutocompleteItem[];
  value: string[];
  onChange: (value: string[]) => void;
  allowsCustomValue?: boolean;
  placeholder?: string;
  className?: string;
  isDisabled?: boolean;
};

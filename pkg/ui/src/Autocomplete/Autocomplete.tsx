import {useMemo} from 'react';
import {View} from 'react-native';
import {Select as NativeSelect} from 'heroui-native';
import {Chip} from '../Chip';
import {Label} from '../Label';

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

export function Autocomplete({
  label,
  items,
  value,
  onChange,
  placeholder = 'Select…',
  className,
  isDisabled,
}: AutocompleteProps) {
  const allItems = useMemo(() => {
    const known = new Set(items.map((item) => item.id));
    const extras = value
      .filter((entry) => !known.has(entry))
      .map((entry) => ({id: entry, name: entry}));
    return [...items, ...extras];
  }, [items, value]);

  const selectedOptions = useMemo(
    () =>
      value.map((entry) => {
        const match = allItems.find((item) => item.id === entry);
        return {value: entry, label: match?.name ?? entry};
      }),
    [allItems, value],
  );

  return (
    <View className={className ?? 'gap-2'}>
      {label ? <Label>{label}</Label> : null}
      {value.length > 0 ? (
        <View className="flex-row flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <Chip
              key={option.value}
              onClose={() => onChange(value.filter((entry) => entry !== option.value))}>
              {option.label}
            </Chip>
          ))}
        </View>
      ) : null}
      <NativeSelect
        isDisabled={isDisabled}
        presentation="bottom-sheet"
        value={selectedOptions}
        onValueChange={(next) => {
          if (!next) {
            onChange([]);
            return;
          }
          const options = Array.isArray(next) ? next : [next];
          onChange(options.map((option) => option.value));
        }}>
        <NativeSelect.Trigger>
          <NativeSelect.Value placeholder={placeholder} />
          <NativeSelect.TriggerIndicator />
        </NativeSelect.Trigger>
        <NativeSelect.Portal>
          <NativeSelect.Overlay />
          <NativeSelect.Content presentation="bottom-sheet" width="full">
            {allItems.map((item) => (
              <NativeSelect.Item key={item.id} value={item.id} label={item.name} />
            ))}
          </NativeSelect.Content>
        </NativeSelect.Portal>
      </NativeSelect>
    </View>
  );
}

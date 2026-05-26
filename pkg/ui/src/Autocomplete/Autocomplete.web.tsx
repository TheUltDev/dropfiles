'use client';

import type {Key} from '@heroui/react';
import {
  Autocomplete as WebAutocomplete,
  EmptyState,
  Label,
  ListBox,
  SearchField,
  Tag,
  TagGroup,
  useFilter,
} from '@heroui/react';
import {useMemo} from 'react';

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
  allowsCustomValue,
  placeholder = 'Select…',
  className,
  isDisabled,
}: AutocompleteProps) {
  const {contains} = useFilter({sensitivity: 'base'});

  const allItems = useMemo(() => {
    const known = new Set(items.map((item) => item.id));
    const extras = value
      .filter((entry) => !known.has(entry))
      .map((entry) => ({id: entry, name: entry}));
    return [...items, ...extras];
  }, [items, value]);

  const onRemoveTags = (keys: Set<Key>) => {
    onChange(value.filter((entry) => !keys.has(entry)));
  };

  return (
    <WebAutocomplete
      allowsCustomValue={allowsCustomValue}
      className={className ?? 'w-full'}
      isDisabled={isDisabled}
      placeholder={placeholder}
      selectionMode="multiple"
      value={value}
      onChange={(keys: Key | Key[] | null) => onChange((keys as Key[]) ?? [])}>
      {label ? <Label>{label}</Label> : null}
      <WebAutocomplete.Trigger>
        <WebAutocomplete.Value>
          {({defaultChildren, isPlaceholder, state}: any) => {
            if (isPlaceholder || state.selectedItems.length === 0) {
              return defaultChildren;
            }

            const selectedKeys = state.selectedItems.map((item: any) => item.key);

            return (
              <TagGroup size="sm" onRemove={onRemoveTags}>
                <TagGroup.List>
                  {selectedKeys.map((selectedKey: Key) => {
                    const item = allItems.find((entry) => entry.id === selectedKey);
                    if (!item) return null;

                    return (
                      <Tag key={item.id} id={item.id}>
                        {item.name}
                      </Tag>
                    );
                  })}
                </TagGroup.List>
              </TagGroup>
            );
          }}
        </WebAutocomplete.Value>
        <WebAutocomplete.Indicator />
      </WebAutocomplete.Trigger>
      <WebAutocomplete.Popover>
        <WebAutocomplete.Filter filter={contains}>
          <SearchField autoFocus name="search" variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search…" />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <ListBox renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
            {allItems.map((item) => (
              <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                {item.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </WebAutocomplete.Filter>
      </WebAutocomplete.Popover>
    </WebAutocomplete>
  );
}

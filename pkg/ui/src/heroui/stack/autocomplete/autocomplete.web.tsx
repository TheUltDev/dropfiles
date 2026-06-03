'use client';

import type {Key} from '@heroui/react';
import type {ComponentProps} from 'react';
import type {AutocompleteProps} from './types';

import {useMemo} from 'react';
import {
  Autocomplete as WebAutocomplete,
  SearchField,
  EmptyState,
  ListBox,
  Label,
  Tag,
  TagGroup,
  useFilter,
} from '@heroui/react';

export type {AutocompleteItem, AutocompleteProps} from './types';

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
      {...({
        allowsCustomValue,
        className: className ?? 'w-full',
        isDisabled,
        placeholder,
        selectionMode: 'multiple',
        value,
        onChange: (keys: Key | Key[] | null) => {
          if (keys == null) {
            onChange([]);
            return;
          }
          onChange((Array.isArray(keys) ? keys : [keys]).map(String));
        },
      } as ComponentProps<typeof WebAutocomplete>)}
    >
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

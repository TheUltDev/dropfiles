import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {View} from 'react-native';
import {Select as NativeSelect} from 'heroui-native';
import {compound} from '../utils/compound';
import {Label} from '../Label';

type ItemRegistry = {
  register: (id: string, label: string) => void;
};

const CellSelectItemsContext = createContext<ItemRegistry | null>(null);

type CellSelectRootProps = {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  children?: ReactNode;
  'aria-label'?: string;
  isDisabled?: boolean;
};

function CellSelectRoot({className, value, onChange, children, ...rest}: CellSelectRootProps) {
  const [labels, setLabels] = useState<Record<string, string>>({});

  const register = useCallback((id: string, label: string) => {
    setLabels((current) => (current[id] === label ? current : {...current, [id]: label}));
  }, []);

  const registry = useMemo(() => ({register}), [register]);

  const nativeValue =
    value != null ? {value, label: labels[value] ?? value} : undefined;

  return (
    <View className={className ?? 'rounded-2xl bg-surface-secondary px-4 py-3'}>
      <CellSelectItemsContext.Provider value={registry}>
        <NativeSelect
          {...rest}
          presentation="bottom-sheet"
          value={nativeValue}
          onValueChange={(next) => {
            if (!next || Array.isArray(next)) return;
            onChange?.(next.value);
          }}>
          {children}
        </NativeSelect>
      </CellSelectItemsContext.Provider>
    </View>
  );
}

function CellSelectTrigger({children}: {children: ReactNode}) {
  return (
    <NativeSelect.Trigger
      variant="unstyled"
      className="w-full flex-row items-center justify-between gap-3">
      {children}
    </NativeSelect.Trigger>
  );
}

function CellSelectLabel({children}: {children: ReactNode}) {
  return <Label className="flex-1">{children}</Label>;
}

function CellSelectValue({placeholder}: {placeholder?: string}) {
  return <NativeSelect.Value placeholder={placeholder} className="text-end" />;
}

function CellSelectIndicator() {
  return <NativeSelect.TriggerIndicator />;
}

function CellSelectPopover({children}: {children: ReactNode}) {
  return (
    <NativeSelect.Portal>
      <NativeSelect.Overlay />
      <NativeSelect.Content presentation="bottom-sheet" width="full">
        {children}
      </NativeSelect.Content>
    </NativeSelect.Portal>
  );
}

type CellSelectItemProps = {
  id: string;
  textValue: string;
  children?: ReactNode;
};

function CellSelectItem({id, textValue, children}: CellSelectItemProps) {
  const registry = useContext(CellSelectItemsContext);
  registry?.register(id, textValue);

  return (
    <NativeSelect.Item value={id} label={textValue}>
      {children}
    </NativeSelect.Item>
  );
}

export const CellSelect = compound(CellSelectRoot, {
  Trigger: CellSelectTrigger,
  Label: CellSelectLabel,
  Value: CellSelectValue,
  Indicator: CellSelectIndicator,
  Popover: CellSelectPopover,
  Item: CellSelectItem,
});

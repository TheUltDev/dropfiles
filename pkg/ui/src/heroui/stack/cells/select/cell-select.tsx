import {Children, isValidElement, useMemo, type ReactNode} from 'react';
import Svg, {Path} from 'react-native-svg';
import {Select as NativeSelect} from 'heroui-native';
import {useThemeColor} from 'heroui-native/hooks';
import {Label} from '../../../core/label';
import {compound} from '../../../utils/compound';
import {
  CELL_SELECT_INDICATOR_CLASS,
  CELL_SELECT_INDICATOR_SIZE,
  CELL_SELECT_VALUE_CLASS,
  CELL_SURFACE_CLASS,
  NATIVE_SELECT_POPOVER_PROPS,
} from '../constants';

/** Items live inside the portal and do not mount until open — derive labels from the tree. */
function collectItemLabels(node: ReactNode): Record<string, string> {
  const labels: Record<string, string> = {};

  const visit = (current: ReactNode) => {
    Children.forEach(current, (child) => {
      if (!isValidElement(child)) return;

      const props = child.props as {
        id?: string;
        textValue?: string;
        children?: ReactNode;
      };

      if (typeof props.id === 'string' && typeof props.textValue === 'string') {
        labels[props.id] = props.textValue;
      }

      if (props.children != null) {
        visit(props.children);
      }
    });
  };

  visit(node);
  return labels;
}

type CellSelectRootProps = {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  children?: ReactNode;
  'aria-label'?: string;
  isDisabled?: boolean;
  variant?: 'default' | 'secondary';
};

function CellSelectRoot({variant: _variant, value, onChange, children, ...rest}: CellSelectRootProps) {
  const itemLabels = useMemo(() => collectItemLabels(children), [children]);

  const nativeValue =
    value != null ? {value, label: itemLabels[value] ?? value} : undefined;

  return (
    <NativeSelect
      {...rest}
      className="w-full"
      value={nativeValue}
      onValueChange={(next) => {
        if (!next || Array.isArray(next)) return;
        onChange?.(next.value);
      }}>
      {children}
    </NativeSelect>
  );
}

function CellSelectTrigger({children}: {children: ReactNode}) {
  return (
    <NativeSelect.Trigger
      variant="default"
      className={`${CELL_SURFACE_CLASS} justify-start shadow-none`}>
      {children}
    </NativeSelect.Trigger>
  );
}

function CellSelectLabel({children}: {children: ReactNode}) {
  return <Label className="min-w-0 flex-1">{children}</Label>;
}

function CellSelectValue({placeholder = 'Select…'}: {placeholder?: string}) {
  const mutedColor = useThemeColor('muted');

  return (
    <NativeSelect.Value
      placeholder={placeholder}
      className={CELL_SELECT_VALUE_CLASS}
      style={{color: mutedColor}}
    />
  );
}

function ChevronsExpandVerticalIcon({
  size = CELL_SELECT_INDICATOR_SIZE,
  color,
}: {
  size?: number;
  color: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.58 4.109a.75.75 0 0 0 1.061 1.06L8 1.811l3.354 3.353a.75.75 0 0 0 1.06-1.06L8.53.22a.75.75 0 0 0-1.06 0zm8.84 7.782a.75.75 0 1 0-1.061-1.06l-3.36 3.358-3.353-3.353a.75.75 0 1 0-1.06 1.06L7.47 15.78a.75.75 0 0 0 1.06 0z"
      />
    </Svg>
  );
}

function CellSelectIndicator() {
  const mutedColor = useThemeColor('muted');

  return (
    <NativeSelect.TriggerIndicator
      isAnimatedStyleActive={false}
      className={CELL_SELECT_INDICATOR_CLASS}>
      <ChevronsExpandVerticalIcon color={mutedColor} />
    </NativeSelect.TriggerIndicator>
  );
}

function CellSelectPopover({children}: {children: ReactNode}) {
  return (
    <NativeSelect.Portal>
      <NativeSelect.Overlay />
      <NativeSelect.Content {...NATIVE_SELECT_POPOVER_PROPS}>{children}</NativeSelect.Content>
    </NativeSelect.Portal>
  );
}

type CellSelectItemProps = {
  id: string;
  textValue: string;
  children?: ReactNode;
};

function CellSelectItem({id, textValue, children}: CellSelectItemProps) {
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

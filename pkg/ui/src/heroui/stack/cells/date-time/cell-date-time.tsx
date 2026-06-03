import type {ReactNode} from 'react';
import {CalendarDate} from '@internationalized/date';
import {DateTimePicker} from 'heroui-native-pro';
import {useThemeColor} from 'heroui-native/hooks';
import {Label} from '../../../core/label';
import {
  formatExpirationLabel,
  isoToCalendarDateTimeString,
} from '../../../utils/expiration';
import {compound} from '../../../utils/compound';
import {
  CELL_SELECT_INDICATOR_CLASS,
  CELL_SELECT_VALUE_CLASS,
  CELL_SURFACE_CLASS,
} from '../constants';

function clampToMinimum(iso: string, minimumDate?: Date): string {
  if (!minimumDate) return iso;
  const merged = new Date(iso);
  return merged < minimumDate ? minimumDate.toISOString() : iso;
}

export type CellDateTimeRootProps = {
  className?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  minimumDate?: Date;
  isDisabled?: boolean;
  variant?: 'default' | 'secondary';
  children?: ReactNode;
  'aria-label'?: string;
};

function CellDateTimeRoot({
  variant: _variant,
  value,
  onChange,
  minimumDate,
  isDisabled,
  className,
  children,
  ...rest
}: CellDateTimeRootProps) {
  const option = value
    ? {
        value: isoToCalendarDateTimeString(value),
        label: formatExpirationLabel(value),
      }
    : undefined;
  const minValue = minimumDate
    ? new CalendarDate(
        minimumDate.getFullYear(),
        minimumDate.getMonth() + 1,
        minimumDate.getDate(),
      )
    : undefined;

  return (
    <DateTimePicker
      {...rest}
      className={className ?? 'w-full'}
      value={option}
      minValue={minValue}
      isDisabled={isDisabled}
      onValueChange={(next) =>
        onChange?.(
          next ? clampToMinimum(new Date(next.value).toISOString(), minimumDate) : null,
        )
      }>
      <DateTimePicker.Select>{children}</DateTimePicker.Select>
    </DateTimePicker>
  );
}

function CellDateTimeTrigger({children}: {children: ReactNode}) {
  return (
    <DateTimePicker.Trigger
      className={`${CELL_SURFACE_CLASS} justify-start shadow-none`}>
      {children}
    </DateTimePicker.Trigger>
  );
}

function CellDateTimeLabel({children}: {children: ReactNode}) {
  return <Label className="min-w-0 flex-1">{children}</Label>;
}

function CellDateTimeValue({placeholder = 'Choose a date & time'}: {placeholder?: string}) {
  const mutedColor = useThemeColor('muted');

  return (
    <DateTimePicker.Value
      placeholder={placeholder}
      className={CELL_SELECT_VALUE_CLASS}
      style={{color: mutedColor}}
    />
  );
}

function CellDateTimeIndicator() {
  return (
    <DateTimePicker.TriggerIndicator
      isAnimatedStyleActive={false}
      className={CELL_SELECT_INDICATOR_CLASS}
    />
  );
}

function CellDateTimePopover({children}: {children: ReactNode}) {
  return (
    <DateTimePicker.Portal>
      <DateTimePicker.Overlay />
      <DateTimePicker.Content presentation="popover" width="trigger">
        {children}
      </DateTimePicker.Content>
    </DateTimePicker.Portal>
  );
}

function CellDateTimeWheel() {
  return <DateTimePicker.Wheel />;
}

export const CellDateTime = compound(CellDateTimeRoot, {
  Trigger: CellDateTimeTrigger,
  Label: CellDateTimeLabel,
  Value: CellDateTimeValue,
  Indicator: CellDateTimeIndicator,
  Popover: CellDateTimePopover,
  Wheel: CellDateTimeWheel,
});

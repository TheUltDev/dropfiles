'use client';

import {
  createContext,
  useContext,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import {
  formatExpirationLabel,
  isoToLocalDateTimeInput,
  localDateTimeInputToIso,
} from '../../../utils/expiration';
import {compound} from '../../../utils/compound';

type CellDateTimeContextValue = {
  value: string | null | undefined;
  onChange?: (value: string | null) => void;
  minimumDate?: Date;
  isDisabled?: boolean;
  variant?: 'default' | 'secondary';
  'aria-label'?: string;
};

const CellDateTimeContext = createContext<CellDateTimeContextValue | null>(null);

function useCellDateTime() {
  const ctx = useContext(CellDateTimeContext);
  if (!ctx) {
    throw new Error('CellDateTime compound components must be used within CellDateTime');
  }
  return ctx;
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
  variant,
  value,
  onChange,
  minimumDate,
  isDisabled,
  className,
  children,
  'aria-label': ariaLabel,
}: CellDateTimeRootProps) {
  return (
    <CellDateTimeContext.Provider
      value={{
        value,
        onChange,
        minimumDate,
        isDisabled,
        variant,
        'aria-label': ariaLabel,
      }}>
      <div className={className ?? 'cell-select w-full'}>{children}</div>
    </CellDateTimeContext.Provider>
  );
}

function CellDateTimeTrigger({children}: {children: ReactNode}) {
  const {value, onChange, minimumDate, isDisabled, variant, 'aria-label': ariaLabel} =
    useCellDateTime();
  const minValue = minimumDate
    ? isoToLocalDateTimeInput(minimumDate.toISOString())
    : undefined;
  const variantClass =
    variant === 'secondary'
      ? 'cell-select__trigger--secondary'
      : 'cell-select__trigger--default';

  return (
    <label
      className={`cell-select__trigger ${variantClass} relative w-full cursor-pointer`}
      aria-disabled={isDisabled || undefined}>
      {children}
      <input
        className="cell-datetime-input cell-datetime-input--overlay absolute inset-0 z-0 h-full w-full cursor-pointer opacity-0"
        type="datetime-local"
        value={value ? isoToLocalDateTimeInput(value) : ''}
        min={minValue}
        disabled={isDisabled}
        aria-label={ariaLabel}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const next = event.target.value.trim();
          onChange?.(next ? localDateTimeInputToIso(next) : null);
        }}
      />
    </label>
  );
}

function CellDateTimeLabel({children}: {children: ReactNode}) {
  return <span className="cell-select__label">{children}</span>;
}

function CellDateTimeValue({placeholder = 'Choose a date & time'}: {placeholder?: string}) {
  const {value} = useCellDateTime();
  const text = placeholder;

  return (
    <span
      className="cell-select__value pointer-events-none relative z-[1]"
      data-placeholder={value ? undefined : 'true'}>
      {value ? formatExpirationLabel(value) : text}
    </span>
  );
}

function CellDateTimeIndicator() {
  return (
    <span className="cell-select__indicator pointer-events-none relative z-[1]" aria-hidden>
      <svg
        className="size-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    </span>
  );
}

/** Web uses the native datetime-local picker; popover/wheel are no-ops. */
function CellDateTimePopover({children}: {children: ReactNode}) {
  return <>{children}</>;
}

function CellDateTimeWheel() {
  return null;
}

export const CellDateTime = compound(CellDateTimeRoot, {
  Trigger: CellDateTimeTrigger,
  Label: CellDateTimeLabel,
  Value: CellDateTimeValue,
  Indicator: CellDateTimeIndicator,
  Popover: CellDateTimePopover,
  Wheel: CellDateTimeWheel,
});

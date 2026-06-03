/** Horizontal inset for cell labels/values (matches px-4 on select/switch rows). */
export const CELL_HORIZONTAL_PAD = 'px-4';

/**
 * Settings-cell chrome on native — use `bg-surface` (darker) to match web Pro cells;
 * DemoSection panels use `bg-surface-secondary` and sit one step lighter.
 */
export const CELL_SURFACE_CLASS = `w-full rounded-2xl bg-surface py-3 ${CELL_HORIZONTAL_PAD}`;

/** Best guess for native cell row height (used for sliders) */
export const CELL_ROW_FIXED_HEIGHT_PX = 48;

/**
 * Native cell slider track — explicit row height; absolute children do not affect layout.
 * `!h-auto` clears the default `h-5` slider bar.
 */
export const CELL_SLIDER_TRACK_CLASS =
  'relative !h-12 !min-h-12 w-full items-center overflow-hidden rounded-2xl bg-surface';

/** Progress tint inside the cell row (subtle, like web cell-slider fill). */
export const CELL_SLIDER_FILL_CLASS = 'rounded-none bg-default';

/** Minimal end cap instead of the default chunky thumb knob. */
export const CELL_SLIDER_THUMB_CLASS_NAMES = {
  thumbContainer: 'h-5 w-1 bg-transparent p-0',
  thumbKnob: 'min-h-0 flex-1 rounded-full bg-foreground shadow-none',
} as const;

/** Invisible touch target — keeps the 4px knob look but allows pan to start. */
export const CELL_SLIDER_THUMB_HIT_SLOP = {
  top: 20,
  bottom: 20,
  left: 28,
  right: 28,
} as const;

/** Overlay slots — inset-y-0 + items-center vertically centers label/value in the row. */
export const CELL_SLIDER_LABEL_CLASS = `pointer-events-none absolute inset-y-0 left-0 z-10 flex-row items-center ${CELL_HORIZONTAL_PAD}`;

export const CELL_SLIDER_OUTPUT_CLASS = `pointer-events-none absolute inset-y-0 right-0 z-10 flex-row items-center ${CELL_HORIZONTAL_PAD}`;

/** Matches Pro `.cell-select__value` — muted, end-aligned, does not grow. */
export const CELL_SELECT_VALUE_CLASS =
  'ml-auto shrink-0 flex-none truncate text-end text-sm !text-muted';

/** Matches Pro `.cell-select__indicator` (0.75rem). */
export const CELL_SELECT_INDICATOR_SIZE = 12;

export const CELL_SELECT_INDICATOR_CLASS = 'size-3 shrink-0';

/** Popover content should match trigger width (avoids narrow content-fit dropdown). */
export const NATIVE_SELECT_POPOVER_PROPS = {
  presentation: 'popover' as const,
  width: 'trigger' as const,
  placement: 'bottom' as const,
  align: 'start' as const,
};

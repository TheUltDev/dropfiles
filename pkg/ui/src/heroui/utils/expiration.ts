export function mergeExpirationDate(date: Date, hour: number, minute: number): string {
  const merged = new Date(date);
  merged.setHours(hour, minute, 59, 0);
  return merged.toISOString();
}

export function formatExpirationLabel(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function isoToLocalDateTimeInput(iso: string): string {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Local `CalendarDateTime` string for HeroUI `DateTimePicker` (`parseDateTime`). */
export function isoToCalendarDateTimeString(iso: string): string {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function localDateTimeInputToIso(value: string): string {
  return new Date(value).toISOString();
}

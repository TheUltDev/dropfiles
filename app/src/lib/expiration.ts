export function expirationParts(iso: string | null) {
  if (!iso) {
    return {hour: 23, minute: 59};
  }
  const date = new Date(iso);
  return {hour: date.getHours(), minute: date.getMinutes()};
}

export function mergeExpirationDate(
  date: Date,
  hour: number,
  minute: number,
): string {
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

export function defaultExpirationAt(daysFromNow = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(23, 59, 59, 0);
  return date.toISOString();
}

export function isoToLocalDateTimeInput(iso: string): string {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function localDateTimeInputToIso(value: string): string {
  return new Date(value).toISOString();
}

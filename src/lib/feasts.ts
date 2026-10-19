/* Feast dates from their rules (phase 2 rule 5 and revision 6; phase 4, A2): a fixed day, a day counted from Easter,
   a weekday in a month, a month with no day, or a lunar date. A lunar date is never turned into a day: only the
   months it can fall in are known. */
import type { FeastWhen } from '../data/types';

/** Easter Sunday (Gregorian), by the anonymous Gregorian algorithm. */
export function easter(y: number): Date {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(y, month - 1, day);
}

/** The day a feast falls on in a year, or null when its rule gives months only (a lunar date, or "In October"). */
export function feastDate(when: FeastWhen, year: number): Date | null {
  if ('months' in when) return null;
  if ('easterSaturday' in when) { const e = easter(year); return new Date(year, e.getMonth(), e.getDate() + 6 + 7 * (when.easterSaturday - 1)); }
  if ('easterDays' in when) { const e = easter(year); return new Date(year, e.getMonth(), e.getDate() + when.easterDays); }
  if ('lastWeekday' in when) { const d = new Date(year, when.month, 0); d.setDate(d.getDate() - ((d.getDay() - when.lastWeekday + 7) % 7)); return d; }
  const d = new Date(year, when.month - 1, when.day);
  if (when.nearest !== undefined) { let off = (when.nearest - d.getDay() + 7) % 7; if (off > 3) off -= 7; d.setDate(d.getDate() + off); }
  return d;
}

/** This year's date if it is still to come, otherwise next year's (revision 6). */
export function nextFeastDate(when: FeastWhen, today: Date): Date | null {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const d = feastDate(when, t.getFullYear());
  if (!d) return null;
  return d >= t ? d : feastDate(when, t.getFullYear() + 1);
}

/** The months to mark on the 12-month strip: the next date's month, or the months a rule names. */
export function upcomingMonths(when: FeastWhen, today: Date): number[] {
  if ('months' in when) return when.months;
  const d = nextFeastDate(when, today);
  return d ? [d.getMonth() + 1] : [];
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** "Saturday 17 April 2027" */
export const longDate = (d: Date) => `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

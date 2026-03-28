/**
 * An IFC date object returned by toIFC() or accepted by toGregorian().
 */
export interface IFCDate {
  /** The year */
  year: number;
  /** 1-based month: 1=January, 7=Sol, 13=December */
  month: number;
  /** 1-28 for normal days, 29 for intercalary days */
  day: number;
  /** 0=Sunday ... 6=Saturday, null for Leap Day and Year Day */
  weekday: number | null;
  /** True if this is Leap Day (Jun 29 in a leap year) */
  isLeapDay: boolean;
  /** True if this is Year Day (Dec 29, last day of year) */
  isYearDay: boolean;
}

/**
 * Converts a Gregorian ISO date string to an IFC date object.
 * If no date is provided, uses today's local date.
 *
 * @param input - Gregorian ISO date string e.g. '2024-06-17'. Omit for today.
 * @throws If the date string is invalid
 *
 * @example
 * toIFC('2026-03-22');
 * // { year: 2026, month: 3, day: 25, weekday: 4, isLeapDay: false, isYearDay: false }
 */
export function toIFC(input?: string): IFCDate;

/**
 * Converts an IFC date to a Gregorian ISO date string.
 * Accepts either an IFC date string or an IFC date object.
 *
 * @param input - IFC date string ('IFC:2024-06-29') or IFC date object
 * @throws If the input is invalid or the date is out of range
 *
 * @example
 * toGregorian('IFC:2024-06-29');                   // '2024-06-17'
 * toGregorian({ year: 2026, month: 7, day: 1 });   // '2026-06-18'
 * toGregorian(toIFC('2024-06-17'));                 // '2024-06-17'
 */
export function toGregorian(input: string | IFCDate | { year: number; month: number; day: number }): string;

/**
 * Returns true if the given year is a leap year.
 *
 * @example
 * isLeap(2024); // true
 * isLeap(1900); // false
 */
export function isLeap(year: number): boolean;

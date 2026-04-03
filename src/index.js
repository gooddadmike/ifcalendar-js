'use strict';
import EN from '../locales/en.js';

// ─── Core utilities ───────────────────────────────────────────────────────────
/**
 * Returns true if the given year is a leap year.
 * @param {number} year
 * @returns {boolean}
 */
function isLeap(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Converts a Gregorian year/month/day to day-of-year (1-based).
 * @param {number} year
 * @param {number} month0 - 0-based month
 * @param {number} day
 * @returns {number}
 */
function gregToDoy(year, month0, day) {
  const dim = [31, isLeap(year)?29:28, 31,30,31,30,31,31,30,31,30,31];
  let doy = day;
  for (let i = 0; i < month0; i++) doy += dim[i];
  return doy;
}

/**
 * Converts a day-of-year to Gregorian month and day.
 * @param {number} year
 * @param {number} doy
 * @returns {{ month: number, day: number }} 0-based month
 */
function doyToGreg(year, doy) {
  const dim = [31, isLeap(year)?29:28, 31,30,31,30,31,31,30,31,30,31];
  let rem = doy;
  for (let m = 0; m < 12; m++) {
    if (rem <= dim[m]) return { month: m, day: rem };
    rem -= dim[m];
  }
}

/**
 * Converts an IFC month/day to day-of-year.
 * @param {number} year
 * @param {number} mi - 1-based IFC month
 * @param {number} day
 * @returns {number}
 */
function ifcToDoy(year, mi, day) {
  if (mi === 6 && day === 29 && isLeap(year)) return 169;
  let doy = (mi - 1) * 28 + day;
  if (mi > 6 && isLeap(year)) doy += 1;
  return doy;
}

/**
 * Converts a day-of-year to an IFC date object.
 * @param {number} year
 * @param {number} doy
 * @returns {IFCDate}
 */
function doyToIfc(year, doy) {
  const leap = isLeap(year);
  const yearLen = leap ? 366 : 365;
  if (leap && doy === 169) {
    return { month: 6, day: 29, weekday: null, isLeapDay: true, isYearDay: false };
  }
  if (doy === yearLen) {
    return { month: 13, day: 29, weekday: null, isLeapDay: false, isYearDay: true };
  }
  const adjDoy = leap && doy > 169 ? doy - 1 : doy;
  const month = Math.floor((adjDoy - 1) / 28) + 1;
  const day = ((adjDoy - 1) % 28) + 1;
  const weekday = (day - 1) % 7;
  return { month, day, weekday, isLeapDay: false, isYearDay: false };
}

const pad = n => String(n).padStart(2, '0');

// ─── Format helpers ───────────────────────────────────────────────────────────
function ifcToString(year, ifc) {
  return `IFC:${year}-${pad(ifc.month)}-${pad(ifc.day)}`;
}

function ifcToShort(year, ifc, locale) {
  let weekdayPart = ifc.isLeapDay ? locale.leapDay.short :
                    ifc.isYearDay ? locale.yearDay.short :
                    locale.weekdaysShort[ifc.weekday];

  const month = locale.ifcMonthsShort[ifc.month - 1];
  return `${weekdayPart} ${month} ${ifc.day}`;
}

function ifcToLong(year, ifc, locale) {
  let weekdayPart = ifc.isLeapDay ? locale.leapDay.long :
                    ifc.isYearDay ? locale.yearDay.long :
                    locale.weekdays[ifc.weekday];

  const month = locale.ifcMonths[ifc.month - 1];
  return `${weekdayPart} ${month} ${ifc.day}, ${year}`;
}

// ─── Rich Object Creator ─────────────────────────────────────────────────────
function createRichIFC(year, month0, day, ifc, locale) {
  const gregWeekday = new Date(year, month0, day).getDay();

  return {
    ifcISO: ifcToString(year, ifc),
    year: year,
    month: ifc.month,
    day: ifc.day,
    weekday: ifc.weekday,
    isLeapDay: ifc.isLeapDay,
    isYearDay: ifc.isYearDay,
    short: ifcToShort(year, ifc, locale),
    long: ifcToLong(year, ifc, locale),

    gregorian: {
      iso: `${year}-${pad(month0 + 1)}-${pad(day)}`,
      year: year,
      month: month0 + 1,
      day: day,
      weekday: gregWeekday,
      short: `${locale.weekdaysShort[gregWeekday]} ${locale.gregMonthsShort[month0]} ${day} ${year}`,
      long: `${locale.weekdays[gregWeekday]} ${locale.gregMonths[month0]} ${day}, ${year}`
    }
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────
/**
 * @typedef {Object} IFCDate
 * @property {number} year
 * @property {number} month - 1-based
 * @property {number} day
 * @property {number|null} weekday
 * @property {boolean} isLeapDay
 * @property {boolean} isYearDay
 */

/**
 * Converts a Gregorian date to an IFC date.
 *
 * Input: Gregorian ISO string, Date object, or null (today)
 * Output:
 *   default → IFC string
 *   'short' → short string
 *   'long'  → long string
 *   'object'→ rich object (IFC-first with embedded Gregorian data)
 */
function toIFC(input, format, locale = EN) {
  let year, month0, day;

  if (input instanceof Date) {
    year = input.getFullYear();
    month0 = input.getMonth();
    day = input.getDate();
  } else if (typeof input === 'string') {
    if (input.startsWith('IFC:')) {
      throw new Error('toIFC expects Gregorian input. Use toGregorian first if you have an IFC string.');
    }
    const [y, m, d] = input.split('-').map(Number);
    year = y;
    month0 = m - 1;
    day = d;
    if (isNaN(year) || isNaN(month0) || isNaN(day)) throw new Error(`Invalid date: ${input}`);
  } else if (input == null) {
    const now = new Date();
    year = now.getFullYear();
    month0 = now.getMonth();
    day = now.getDate();
  } else {
    throw new Error('toIFC expects a Gregorian ISO string, a Date object, or no argument');
  }

  const doy = gregToDoy(year, month0, day);
  const ifc = doyToIfc(year, doy);

  if (format === 'object') {
    return createRichIFC(year, month0, day, ifc, locale);
  }

  switch (format) {
    case 'short': return ifcToShort(year, ifc, locale);
    case 'long':  return ifcToLong(year, ifc, locale);
    default:      return ifcToString(year, ifc);
  }
}

export { toIFC, toGregorian, isLeap, EN };

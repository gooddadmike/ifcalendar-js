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
  const dim = [31, isLeap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
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
  const dim = [31, isLeap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
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
    return { 
      month: 6, 
      day: 29, 
      weekday: null, 
      isLeapDay: true, 
      isYearDay: false 
    };
  }

  if (doy === yearLen) {
    return { 
      month: 13, 
      day: 29, 
      weekday: null, 
      isLeapDay: false, 
      isYearDay: true 
    };
  }

  const adjDoy = leap && doy > 169 ? doy - 1 : doy;

  // Debug output — remove or comment out before publishing
  // .log(`Debug: year=${year}, doy=${doy}, leap=${leap}, adjDoy=${adjDoy}`);

  const month = Math.floor((adjDoy - 1) / 28) + 1;
  const day = ((adjDoy - 1) % 28) + 1;
  const weekday = (day - 1) % 7;

  return { 
    month, 
    day, 
    weekday, 
    isLeapDay: false, 
    isYearDay: false 
  };
}

const pad = n => String(n).padStart(2, '0');

// ─── Format helpers ───────────────────────────────────────────────────────────
/**
 * Formats an IFC date object as an IFC string.
 * @param {number} year
 * @param {IFCDate} ifc
 * @returns {string} e.g. 'IFC:2026-03-25'
 */
function ifcToString(year, ifc) {
  return `IFC:${year}-${pad(ifc.month)}-${pad(ifc.day)}`;
}

/**
 * Formats an IFC date object as a short human string.
 * @param {number} year
 * @param {IFCDate} ifc
 * @param {object} locale
 * @returns {string}
 */
function ifcToShort(year, ifc, locale) {
  if (ifc.isLeapDay) return `Jun 29 ${locale.leapDay.short}`;
  if (ifc.isYearDay) return `Dec 29 ${locale.yearDay.short}`;
  
  const month = locale.monthsShort[ifc.month - 1];
  const weekday = locale.weekdaysShort[ifc.weekday];
  return `${weekday} ${month} ${ifc.day}`;
}

/**
 * Formats an IFC date object as a long human string.
 * @param {number} year
 * @param {IFCDate} ifc
 * @param {object} locale
 * @returns {string}
 */
function ifcToLong(year, ifc, locale) {
  if (ifc.isLeapDay) return `June 29 ${locale.leapDay.long}`;
  if (ifc.isYearDay) return `December 29 ${locale.yearDay.long}`;
  
  const month = locale.monthsLong[ifc.month - 1];
  const weekday = locale.weekdaysLong[ifc.weekday];
  return `${weekday} ${month} ${ifc.day}`;
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
 * @param {string|Date} [input]
 * @param {'short'|'long'|'object'} [format]
 * @param {object} [locale] - defaults to EN
 * @returns {string|IFCDate}
 */
function toIFC(input, format, locale = EN) {
  let year, month0, day;

  if (input instanceof Date) {
    year = input.getFullYear();
    month0 = input.getMonth();
    day = input.getDate();
  } 
  else if (typeof input === 'string') {
    const [y, m, d] = input.split('-').map(Number);
    year = y;
    month0 = m - 1;
    day = d;
    if (isNaN(year) || isNaN(month0) || isNaN(day)) {
      throw new Error(`Invalid date: ${input}`);
    }
  } 
  else if (input == null) {
    const now = new Date();
    year = now.getFullYear();
    month0 = now.getMonth();
    day = now.getDate();
  } 
  else {
    throw new Error('toIFC expects a Gregorian ISO string, a Date object, or no argument');
  }

  const doy = gregToDoy(year, month0, day);
  const ifc = doyToIfc(year, doy);

  switch (format) {
    case 'short': return ifcToShort(year, ifc, locale);
    case 'long':  return ifcToLong(year, ifc, locale);
    case 'object': return { year, ...ifc };
    default: return ifcToString(year, ifc);
  }
}

/**
 * Converts an IFC date to a Gregorian ISO string.
 * @param {string|IFCDate|{year: number, month: number, day: number}} input
 * @param {'short'|'long'} [format]
 * @param {object} [locale] - defaults to EN
 * @returns {string}
 */
function toGregorian(input, format, locale = EN) {
  let year, month, day;

  if (typeof input === 'object' && input !== null) {
    ({ year, month, day } = input);
    if (!year || !month || !day) {
      throw new Error('IFC object must have year, month and day');
    }
  } 
  else if (typeof input === 'string') {
    if (!input.startsWith('IFC:')) {
      throw new Error('IFC strings must start with "IFC:"');
    }
    const parts = input.slice(4).split('-').map(Number);
    [year, month, day] = parts;
    if (!year || !month || !day) {
      throw new Error(`Invalid IFC string: ${input}`);
    }
  } 
  else {
    throw new Error('toGregorian expects an IFC string or object');
  }

  if (month < 1 || month > 13) throw new Error(`IFC month must be 1-13, got ${month}`);
  if (day < 1 || day > 29) throw new Error(`IFC day must be 1-29, got ${day}`);
  if (day === 29) {
    if (month === 6 && !isLeap(year)) throw new Error('Leap Day only exists in leap years');
    if (month !== 6 && month !== 13) throw new Error('Day 29 only valid for June (leap years) or December');
  }

  const doy = ifcToDoy(year, month, day);
  const g = doyToGreg(year, doy);

  const iso = `${year}-${pad(g.month + 1)}-${pad(g.day)}`;

  if (!format) return iso;

  const weekday = new Date(year, g.month, g.day).getDay();
  const mShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const mLong = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  if (format === 'short') {
    return `${locale.weekdaysShort[weekday]} ${mShort[g.month]} ${g.day}`;
  }
  if (format === 'long') {
    return `${locale.weekdaysLong[weekday]} ${mLong[g.month]} ${g.day}`;
  }

  return iso;
}

// Export the public API
export { 
  toIFC, 
  toGregorian, 
  isLeap, 
  EN 
};

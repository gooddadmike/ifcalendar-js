import EN from './locales/en.js';

function isLeap(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function gregToDoy(year, month0, day) {
  const dim = [31, isLeap(year)?29:28, 31,30,31,30,31,31,30,31,30,31];
  let doy = day;
  for (let i = 0; i < month0; i++) doy += dim[i];
  return doy;
}

function doyToGreg(year, doy) {
  const dim = [31, isLeap(year)?29:28, 31,30,31,30,31,31,30,31,30,31];
  let rem = doy;
  for (let m = 0; m < 12; m++) {
    if (rem <= dim[m]) return { month: m, day: rem };
    rem -= dim[m];
  }
}

function ifcToDoy(year, mi, day) {
  if (mi === 6 && day === 29 && isLeap(year)) return 169;
  let doy = (mi - 1) * 28 + day;
  if (mi > 6 && isLeap(year)) doy += 1;
  return doy;
}

function doyToIfc(year, doy) {
  const leap    = isLeap(year);
  const yearLen = leap ? 366 : 365;
  if (leap && doy === 169) return { month: 6,  day: 29, weekday: null, isLeapDay: true,  isYearDay: false };
  if (doy === yearLen)      return { month: 13, day: 29, weekday: null, isLeapDay: false, isYearDay: true  };
  const adjDoy  = leap && doy > 169 ? doy - 1 : doy;
  const mi      = Math.floor((adjDoy - 1) / 28) + 1;
  const day     = (adjDoy - 1) % 28 + 1;
  const weekday = (day - 1) % 7;
  return { month: mi, day, weekday, isLeapDay: false, isYearDay: false };
}

const pad = n => String(n).padStart(2, '0');

function ifcToString(year, ifc) {
  return `IFC:${year}-${pad(ifc.month)}-${pad(ifc.day)}`;
}

function ifcToShort(year, ifc, locale) {
  if (ifc.isLeapDay) return `Jun 29 ${locale.leapDay.short}`;
  if (ifc.isYearDay) return `Dec 29 ${locale.yearDay.short}`;
  return `${locale.weekdaysShort[ifc.weekday]} ${locale.monthsShort[ifc.month - 1]} ${ifc.day}`;
}

function ifcToLong(year, ifc, locale) {
  if (ifc.isLeapDay) return `June 29 ${locale.leapDay.long}`;
  if (ifc.isYearDay) return `December 29 ${locale.yearDay.long}`;
  return `${locale.weekdaysLong[ifc.weekday]} ${locale.monthsLong[ifc.month - 1]} ${ifc.day}`;
}

export function toIFC(input, format, locale = EN) {
  let year, month0, day;

  if (input instanceof Date) {
    year   = input.getFullYear();
    month0 = input.getMonth();
    day    = input.getDate();
  } else if (typeof input === 'string') {
    const [y, m, d] = input.split('-').map(Number);
    year = y; month0 = m - 1; day = d;
    if (isNaN(year) || isNaN(month0) || isNaN(day)) throw new Error(`Invalid date: ${input}`);
  } else if (input == null) {
    const now = new Date();
    year = now.getFullYear(); month0 = now.getMonth(); day = now.getDate();
  } else {
    throw new Error('toIFC expects a Gregorian ISO string, a Date object, or no argument');
  }

  const doy = gregToDoy(year, month0, day);
  const ifc = doyToIfc(year, doy);

  switch (format) {
    case 'short':  return ifcToShort(year, ifc, locale);
    case 'long':   return ifcToLong(year, ifc, locale);
    case 'object': return { year, ...ifc };
    default:       return ifcToString(year, ifc);
  }
}

export function toGregorian(input, format, locale = EN) {
  let year, month, day;

  if (typeof input === 'object' && input !== null) {
    ({ year, month, day } = input);
    if (!year || !month || !day) throw new Error('IFC object must have year, month and day');
  } else if (typeof input === 'string') {
    if (!input.startsWith('IFC:')) throw new Error('IFC strings must start with "IFC:"');
    const parts = input.slice(4).split('-').map(Number);
    [year, month, day] = parts;
    if (!year || !month || !day) throw new Error(`Invalid IFC string: ${input}`);
  } else {
    throw new Error('toGregorian expects an IFC string or object');
  }

  if (month < 1 || month > 13) throw new Error(`IFC month must be 1-13, got ${month}`);
  if (day < 1 || day > 29)     throw new Error(`IFC day must be 1-29, got ${day}`);
  if (day === 29) {
    if (month === 6 && !isLeap(year)) throw new Error('Leap Day only exists in leap years');
    if (month !== 6 && month !== 13)  throw new Error('Day 29 only valid for June (leap years) or December');
  }

  const doy    = ifcToDoy(year, month, day);
  const g      = doyToGreg(year, doy);
  const gYear  = year;
  const gMonth = g.month;
  const gDay   = g.day;
  const iso    = `${gYear}-${pad(gMonth + 1)}-${pad(gDay)}`;

  if (!format) return iso;

  const weekday = new Date(gYear, gMonth, gDay).getDay();
  const mShort  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const mLong   = ['January','February','March','April','May','June',
                   'July','August','September','October','November','December'];

  if (format === 'short') return `${locale.weekdaysShort[weekday]} ${mShort[gMonth]} ${gDay}`;
  if (format === 'long')  return `${locale.weekdaysLong[weekday]} ${mLong[gMonth]} ${gDay}`;
  return iso;
}

export { isLeap, EN };

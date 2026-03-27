'use strict';
const { toIFC, toGregorian, isLeap, EN } = require('../index.js');

// ─── isLeap ───────────────────────────────────────────────────────────────────
describe('isLeap', () => {
  test('2024 is a leap year',                () => expect(isLeap(2024)).toBe(true));
  test('2023 is not a leap year',            () => expect(isLeap(2023)).toBe(false));
  test('1900 is not a leap year (div 100)',  () => expect(isLeap(1900)).toBe(false));
  test('2000 is a leap year (div 400)',      () => expect(isLeap(2000)).toBe(true));
});

// ─── EN locale ────────────────────────────────────────────────────────────────
describe('EN locale', () => {
  test('has 13 months short',  () => expect(EN.monthsShort).toHaveLength(13));
  test('has 13 months long',   () => expect(EN.monthsLong).toHaveLength(13));
  test('has 7 weekdays short', () => expect(EN.weekdaysShort).toHaveLength(7));
  test('has 7 weekdays long',  () => expect(EN.weekdaysLong).toHaveLength(7));
  test('Sol is index 6 short', () => expect(EN.monthsShort[6]).toBe('Sol'));
  test('Sol is index 6 long',  () => expect(EN.monthsLong[6]).toBe('Sol'));
  test('leapDay short is LPD', () => expect(EN.leapDay.short).toBe('LPD'));
  test('leapDay long',         () => expect(EN.leapDay.long).toBe('Leap Day'));
  test('yearDay short is YRD', () => expect(EN.yearDay.short).toBe('YRD'));
  test('yearDay long',         () => expect(EN.yearDay.long).toBe('Year Day'));
});

// ─── toIFC — default format (IFC string) ─────────────────────────────────────
describe('toIFC — default IFC string', () => {
  test('normal date',        () => expect(toIFC('2026-03-22')).toBe('IFC:2026-03-25'));
  test('Sol 1 2026',         () => expect(toIFC('2026-06-18')).toBe('IFC:2026-07-01'));
  test('Leap Day 2024',      () => expect(toIFC('2024-06-17')).toBe('IFC:2024-06-29'));
  test('day after Leap Day', () => expect(toIFC('2024-06-18')).toBe('IFC:2024-07-01'));
  test('Year Day non-leap',  () => expect(toIFC('2026-12-31')).toBe('IFC:2026-13-29'));
  test('Year Day leap',      () => expect(toIFC('2024-12-31')).toBe('IFC:2024-13-29'));
  test('Jan 1',              () => expect(toIFC('2026-01-01')).toBe('IFC:2026-01-01'));
  test('Dec 28 before YRD',  () => expect(toIFC('2026-12-30')).toBe('IFC:2026-13-28'));

  test('no argument returns IFC string', () => {
    const result = toIFC();
    expect(result).toMatch(/^IFC:\d{4}-\d{2}-\d{2}$/);
  });

  test('Date object input', () => {
    // Construct with year/month/day to avoid UTC parsing
    expect(toIFC(new Date(2026, 2, 22))).toBe('IFC:2026-03-25');
  });

  test('throws on invalid string', () => {
    expect(() => toIFC('not-a-date')).toThrow('Invalid date');
  });
});

// ─── toIFC — short format ─────────────────────────────────────────────────────
describe('toIFC — short format', () => {
  test('normal date',   () => expect(toIFC('2026-03-22', 'short')).toBe('Wed Mar 25'));
  test('Sol 1',         () => expect(toIFC('2026-06-18', 'short')).toBe('Sun Sol 1'));
  test('Leap Day',      () => expect(toIFC('2024-06-17', 'short')).toBe('Jun 29 LPD'));
  test('Year Day',      () => expect(toIFC('2026-12-31', 'short')).toBe('Dec 29 YRD'));
  test('Jan 1 Sunday',  () => expect(toIFC('2026-01-01', 'short')).toBe('Sun Jan 1'));
});

// ─── toIFC — long format ──────────────────────────────────────────────────────
describe('toIFC — long format', () => {
  test('normal date', () => expect(toIFC('2026-03-22', 'long')).toBe('Wednesday March 25'));
  test('Sol 1',       () => expect(toIFC('2026-06-18', 'long')).toBe('Sunday Sol 1'));
  test('Leap Day',    () => expect(toIFC('2024-06-17', 'long')).toBe('June 29 Leap Day'));
  test('Year Day',    () => expect(toIFC('2026-12-31', 'long')).toBe('December 29 Year Day'));
});

// ─── toIFC — object format ────────────────────────────────────────────────────
describe('toIFC — object format', () => {
  test('normal date', () => {
    expect(toIFC('2026-03-22', 'object')).toMatchObject({
      year: 2026, month: 3, day: 25, weekday: 3,
      isLeapDay: false, isYearDay: false
    });
  });

  test('Leap Day', () => {
    expect(toIFC('2024-06-17', 'object')).toMatchObject({
      year: 2024, month: 6, day: 29,
      weekday: null, isLeapDay: true, isYearDay: false
    });
  });

  test('Year Day', () => {
    expect(toIFC('2026-12-31', 'object')).toMatchObject({
      year: 2026, month: 13, day: 29,
      weekday: null, isLeapDay: false, isYearDay: true
    });
  });
});

// ─── toIFC — locale override ──────────────────────────────────────────────────
describe('toIFC — locale override', () => {
  const FR = {
    ...EN,
    monthsShort:   ['Jan','Fév','Mar','Avr','Mai','Jun','Sol',
                    'Jul','Aoû','Sep','Oct','Nov','Déc'],
    weekdaysShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
  };

  test('French short format', () => {
    expect(toIFC('2026-03-22', 'short', FR)).toBe('Mer Mar 25');
  });
});

// ─── toGregorian — from IFC string ───────────────────────────────────────────
describe('toGregorian — IFC string', () => {
  test('normal date',  () => expect(toGregorian('IFC:2026-03-22')).toBe('2026-03-19'));
  test('Sol 1 2026',   () => expect(toGregorian('IFC:2026-07-01')).toBe('2026-06-18'));
  test('Leap Day',     () => expect(toGregorian('IFC:2024-06-29')).toBe('2024-06-17'));
  test('Year Day',     () => expect(toGregorian('IFC:2026-13-29')).toBe('2026-12-31'));
  test('Jan 1',        () => expect(toGregorian('IFC:2026-01-01')).toBe('2026-01-01'));
  test('Dec 28',       () => expect(toGregorian('IFC:2026-13-28')).toBe('2026-12-30'));

  test('throws without IFC: prefix', () => {
    expect(() => toGregorian('2024-06-17')).toThrow('IFC strings must start with "IFC:"');
  });
  test('throws on invalid month', () => {
    expect(() => toGregorian('IFC:2024-14-01')).toThrow('month must be 1-13');
  });
  test('throws on day 30', () => {
    expect(() => toGregorian('IFC:2026-03-30')).toThrow('day must be 1-29');
  });
  test('throws Leap Day in non-leap year', () => {
    expect(() => toGregorian('IFC:2026-06-29')).toThrow('leap years');
  });
  test('throws day 29 on non-special month', () => {
    expect(() => toGregorian('IFC:2024-03-29')).toThrow('Day 29 only valid');
  });
});

// ─── toGregorian — from IFC object ───────────────────────────────────────────
describe('toGregorian — IFC object', () => {
  test('from toIFC object', () => {
    const ifc = toIFC('2024-06-17', 'object');
    expect(toGregorian(ifc)).toBe('2024-06-17');
  });

  test('hand-built object', () => {
    expect(toGregorian({ year: 2026, month: 7, day: 1 })).toBe('2026-06-18');
  });

  test('throws on missing day', () => {
    expect(() => toGregorian({ year: 2026, month: 3 })).toThrow('year, month and day');
  });
});

// ─── toGregorian — formatted output ──────────────────────────────────────────
describe('toGregorian — formatted output', () => {
  test('short format', () => {
    expect(toGregorian('IFC:2026-03-22', 'short')).toBe('Thu Mar 19');
  });

  test('long format', () => {
    expect(toGregorian('IFC:2026-03-22', 'long')).toBe('Thursday March 19');
  });
});

// ─── Round trips ──────────────────────────────────────────────────────────────
describe('round trips', () => {
  test('Gregorian to IFC string to Gregorian', () => {
    const ifc  = toIFC('2024-08-15');
    const back = toGregorian(ifc);
    expect(back).toBe('2024-08-15');
  });

  test('post Leap Day 2024', () => {
    const ifc  = toIFC('2024-09-01');
    const back = toGregorian(ifc);
    expect(back).toBe('2024-09-01');
  });

  test('Jan 1 round trip', () => {
    const ifc  = toIFC('2026-01-01');
    const back = toGregorian(ifc);
    expect(back).toBe('2026-01-01');
  });

  test('Date object round trip', () => {
    const date = new Date(2026, 2, 22);
    const ifc  = toIFC(date);
    const back = toGregorian(ifc);
    expect(back).toBe('2026-03-22');
  });
});

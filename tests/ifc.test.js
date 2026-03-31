'use strict';
const { toIFC, toGregorian, isLeap, EN } = require('../src/index.js');

// ─── isLeap ───────────────────────────────────────────────────────────────────
describe('isLeap', () => {
  test('2024 is a leap year',               () => expect(isLeap(2024)).toBe(true));
  test('2023 is not a leap year',           () => expect(isLeap(2023)).toBe(false));
  test('1900 is not a leap year (div 100)', () => expect(isLeap(1900)).toBe(false));
  test('2000 is a leap year (div 400)',     () => expect(isLeap(2000)).toBe(true));
  test('1600 is a leap year (div 400)',     () => expect(isLeap(1600)).toBe(true));
  test('1800 is not a leap year (div 100)', () => expect(isLeap(1800)).toBe(false));
});

// ─── EN locale ────────────────────────────────────────────────────────────────
describe('EN locale shape', () => {
  test('ifcMonthsShort has 13 entries',  () => expect(EN.ifcMonthsShort).toHaveLength(13));
  test('ifcMonths has 13 entries',       () => expect(EN.ifcMonths).toHaveLength(13));
  test('weekdaysShort has 7 entries',    () => expect(EN.weekdaysShort).toHaveLength(7));
  test('weekdays has 7 entries',         () => expect(EN.weekdays).toHaveLength(7));
  test('gregMonthsShort has 12 entries', () => expect(EN.gregMonthsShort).toHaveLength(12));
  test('gregMonths has 12 entries',      () => expect(EN.gregMonths).toHaveLength(12));
  test('Sol is ifcMonthsShort[6]',       () => expect(EN.ifcMonthsShort[6]).toBe('Sol'));
  test('Sol is ifcMonths[6]',            () => expect(EN.ifcMonths[6]).toBe('Sol'));
  test('July is gregMonthsShort[6]',     () => expect(EN.gregMonthsShort[6]).toBe('Jul'));
  test('July is gregMonths[6]',          () => expect(EN.gregMonths[6]).toBe('July'));
  test('leapDay.short is LPD',           () => expect(EN.leapDay.short).toBe('LPD'));
  test('leapDay.long is Leap Day',       () => expect(EN.leapDay.long).toBe('Leap Day'));
  test('yearDay.short is YRD',           () => expect(EN.yearDay.short).toBe('YRD'));
  test('yearDay.long is Year Day',       () => expect(EN.yearDay.long).toBe('Year Day'));
});

// ─── toIFC — default IFC string ──────────────────────────────────────────────
describe('toIFC — default IFC string', () => {
  // Normal dates
  test('Jan 1',                    () => expect(toIFC('2026-01-01')).toBe('IFC:2026-01-01'));
  test('normal date Mar 22',       () => expect(toIFC('2026-03-22')).toBe('IFC:2026-03-25'));
  test('last day before Sol',      () => expect(toIFC('2026-06-17')).toBe('IFC:2026-06-28'));
  test('first day of Sol',         () => expect(toIFC('2026-06-18')).toBe('IFC:2026-07-01'));
  test('last day of Sol',          () => expect(toIFC('2026-07-15')).toBe('IFC:2026-07-28'));
  test('first day after Sol',      () => expect(toIFC('2026-07-16')).toBe('IFC:2026-08-01'));
  test('Dec 28 before YRD',        () => expect(toIFC('2026-12-30')).toBe('IFC:2026-13-28'));

  // Year Day
  test('Year Day non-leap',        () => expect(toIFC('2026-12-31')).toBe('IFC:2026-13-29'));
  test('Year Day leap',            () => expect(toIFC('2024-12-31')).toBe('IFC:2024-13-29'));

  // Leap Day and surrounding dates
  test('day before Leap Day',      () => expect(toIFC('2024-06-16')).toBe('IFC:2024-06-28'));
  test('Leap Day 2024',            () => expect(toIFC('2024-06-17')).toBe('IFC:2024-06-29'));
  test('day after Leap Day',       () => expect(toIFC('2024-06-18')).toBe('IFC:2024-07-01'));

  // No Leap Day in non-leap year
  test('Jun 17 non-leap is Jun 28', () => expect(toIFC('2026-06-17')).toBe('IFC:2026-06-28'));
  test('Jun 18 non-leap is Sol 1',  () => expect(toIFC('2026-06-18')).toBe('IFC:2026-07-01'));

  // Input types
  test('no argument returns IFC string', () => {
    expect(toIFC()).toMatch(/^IFC:\d{4}-\d{2}-\d{2}$/);
  });
  test('Date object input', () => {
    expect(toIFC(new Date(2026, 2, 22))).toBe('IFC:2026-03-25');
  });
  test('Date object Leap Day', () => {
    expect(toIFC(new Date(2024, 5, 17))).toBe('IFC:2024-06-29');
  });

  // Errors
  test('throws on invalid string', () => {
    expect(() => toIFC('not-a-date')).toThrow('Invalid date');
  });
  test('throws on wrong type', () => {
    expect(() => toIFC(12345)).toThrow('toIFC expects');
  });
});

// ─── toIFC — short format ─────────────────────────────────────────────────────
describe('toIFC — short format', () => {
  test('Jan 1 Sunday',         () => expect(toIFC('2026-01-01', 'short')).toBe('Sun Jan 1'));
  test('normal date',          () => expect(toIFC('2026-03-22', 'short')).toBe('Wed Mar 25'));
  test('last day of June',     () => expect(toIFC('2026-06-17', 'short')).toBe('Sat Jun 28'));
  test('Sol 1',                () => expect(toIFC('2026-06-18', 'short')).toBe('Sun Sol 1'));
  test('last day of Sol',      () => expect(toIFC('2026-07-15', 'short')).toBe('Sat Sol 28'));
  test('first day after Sol',  () => expect(toIFC('2026-07-16', 'short')).toBe('Sun Jul 1'));
  test('day before Leap Day',  () => expect(toIFC('2024-06-16', 'short')).toBe('Sat Jun 28'));
  test('Leap Day',             () => expect(toIFC('2024-06-17', 'short')).toBe('LPD Jun 29'));
  test('day after Leap Day',   () => expect(toIFC('2024-06-18', 'short')).toBe('Sun Sol 1'));
  test('Year Day non-leap',    () => expect(toIFC('2026-12-31', 'short')).toBe('YRD Dec 29'));
  test('Year Day leap',        () => expect(toIFC('2024-12-31', 'short')).toBe('YRD Dec 29'));
  test('Date object short',    () => expect(toIFC(new Date(2026, 2, 22), 'short')).toBe('Wed Mar 25'));
});

// ─── toIFC — long format ──────────────────────────────────────────────────────
describe('toIFC — long format', () => {
  test('Jan 1',               () => expect(toIFC('2026-01-01', 'long')).toBe('Sunday January 1, 2026'));
  test('normal date',         () => expect(toIFC('2026-03-22', 'long')).toBe('Wednesday March 25, 2026'));
  test('Sol 1',               () => expect(toIFC('2026-06-18', 'long')).toBe('Sunday Sol 1, 2026'));
  test('last day of Sol',     () => expect(toIFC('2026-07-15', 'long')).toBe('Saturday Sol 28, 2026'));
  test('first day after Sol', () => expect(toIFC('2026-07-16', 'long')).toBe('Sunday July 1, 2026'));
  test('day before Leap Day', () => expect(toIFC('2024-06-16', 'long')).toBe('Saturday June 28, 2024'));
  test('Leap Day',            () => expect(toIFC('2024-06-17', 'long')).toBe('Leap Day June 29, 2024'));
  test('day after Leap Day',  () => expect(toIFC('2024-06-18', 'long')).toBe('Sunday Sol 1, 2024'));
  test('Year Day non-leap',   () => expect(toIFC('2026-12-31', 'long')).toBe('Year Day December 29, 2026'));
  test('Year Day leap',       () => expect(toIFC('2024-12-31', 'long')).toBe('Year Day December 29, 2024'));
  test('Date object long',    () => expect(toIFC(new Date(2026, 2, 22), 'long')).toBe('Wednesday March 25, 2026'));
});

// ─── toIFC — object format ────────────────────────────────────────────────────
describe('toIFC — object format', () => {
  test('normal date', () => {
    expect(toIFC('2026-03-22', 'object')).toMatchObject({
      year: 2026, month: 3, day: 25, weekday: 3,
      isLeapDay: false, isYearDay: false
    });
  });
  test('Jan 1 is weekday 0 (Sunday)', () => {
    expect(toIFC('2026-01-01', 'object')).toMatchObject({
      year: 2026, month: 1, day: 1, weekday: 0
    });
  });
  test('day 28 is always Saturday (weekday 6)', () => {
    expect(toIFC('2026-01-28', 'object').weekday).toBe(6);
    expect(toIFC('2026-06-17', 'object').weekday).toBe(6);
  });
  test('Sol 1 is Sunday', () => {
    expect(toIFC('2026-06-18', 'object')).toMatchObject({
      month: 7, day: 1, weekday: 0
    });
  });
  test('Leap Day weekday is null', () => {
    expect(toIFC('2024-06-17', 'object')).toMatchObject({
      year: 2024, month: 6, day: 29,
      weekday: null, isLeapDay: true, isYearDay: false
    });
  });
  test('Year Day weekday is null', () => {
    expect(toIFC('2026-12-31', 'object')).toMatchObject({
      year: 2026, month: 13, day: 29,
      weekday: null, isLeapDay: false, isYearDay: true
    });
  });
  test('Date object returns object', () => {
    expect(toIFC(new Date(2026, 2, 22), 'object')).toMatchObject({
      year: 2026, month: 3, day: 25
    });
  });
});

// ─── toIFC — locale override ──────────────────────────────────────────────────
describe('toIFC — locale override', () => {
  const FR = {
    ...EN,
    ifcMonthsShort: ['Jan','Fév','Mar','Avr','Mai','Jun','Sol',
                     'Jul','Aoû','Sep','Oct','Nov','Déc'],
    ifcMonths:      ['Janvier','Février','Mars','Avril','Mai','Juin','Sol',
                     'Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    gregMonthsShort: ['Jan','Fév','Mar','Avr','Mai','Jun','Jul',
                      'Aoû','Sep','Oct','Nov','Déc'],
    gregMonths:      ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet',
                      'Août','Septembre','Octobre','Novembre','Décembre'],
  weekdaysShort:  ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
    weekdays:       ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
  };

  test('French short normal date',  () => expect(toIFC('2026-03-22', 'short', FR)).toBe('Mer Mar 25'));
  test('French long normal date',   () => expect(toIFC('2026-03-22', 'long',  FR)).toBe('Mercredi Mars 25, 2026'));
  test('French short Sol',          () => expect(toIFC('2026-06-18', 'short', FR)).toBe('Dim Sol 1'));
  test('French short Leap Day',     () => expect(toIFC('2024-06-17', 'short', FR)).toBe('LPD Jun 29'));
  test('French short Year Day',     () => expect(toIFC('2026-12-31', 'short', FR)).toBe('YRD Déc 29'));
});

// ─── toGregorian — from IFC string ───────────────────────────────────────────
describe('toGregorian — IFC string', () => {
  test('Jan 1',          () => expect(toGregorian('IFC:2026-01-01')).toBe('2026-01-01'));
  test('normal date',    () => expect(toGregorian('IFC:2026-03-22')).toBe('2026-03-19'));
  test('Jun 28',         () => expect(toGregorian('IFC:2026-06-28')).toBe('2026-06-17'));
  test('Sol 1 2026',     () => expect(toGregorian('IFC:2026-07-01')).toBe('2026-06-18'));
  test('Sol 28 2026',    () => expect(toGregorian('IFC:2026-07-28')).toBe('2026-07-15'));
  test('Jul 1 2026',     () => expect(toGregorian('IFC:2026-08-01')).toBe('2026-07-16'));
  test('Dec 28',         () => expect(toGregorian('IFC:2026-13-28')).toBe('2026-12-30'));
  test('Year Day',       () => expect(toGregorian('IFC:2026-13-29')).toBe('2026-12-31'));

  // Leap year
  test('Jun 28 leap',    () => expect(toGregorian('IFC:2024-06-28')).toBe('2024-06-16'));
  test('Leap Day',       () => expect(toGregorian('IFC:2024-06-29')).toBe('2024-06-17'));
  test('Sol 1 leap',     () => expect(toGregorian('IFC:2024-07-01')).toBe('2024-06-18'));
  test('Year Day leap',  () => expect(toGregorian('IFC:2024-13-29')).toBe('2024-12-31'));

  // Errors
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

// ─── toGregorian — formatted output ──────────────────────────────────────────
describe('toGregorian — formatted output', () => {
  // Key test: Sol maps to Gregorian June/July, not IFC Sol
  test('short format normal',          () => expect(toGregorian('IFC:2026-03-22', 'short')).toBe('Thu Mar 19 2026'));
  test('long format normal',           () => expect(toGregorian('IFC:2026-03-22', 'long')).toBe('Thursday March 19, 2026'));
  test('short Sol 1 uses Jun not Sol', () => expect(toGregorian('IFC:2026-07-01', 'short')).toBe('Thu Jun 18 2026'));
  test('long Sol 1 uses June not Sol', () => expect(toGregorian('IFC:2026-07-01', 'long')).toBe('Thursday June 18, 2026'));
  test('short IFC Jul 1 uses Jul',     () => expect(toGregorian('IFC:2026-08-01', 'short')).toBe('Thu Jul 16 2026'));
  test('long IFC Jul 1 uses July',     () => expect(toGregorian('IFC:2026-08-01', 'long')).toBe('Thursday July 16, 2026'));
  test('short Leap Day',               () => expect(toGregorian('IFC:2024-06-29', 'short')).toBe('Mon Jun 17 2024'));
  test('long Leap Day',                () => expect(toGregorian('IFC:2024-06-29', 'long')).toBe('Monday June 17, 2024'));
  test('short Year Day',               () => expect(toGregorian('IFC:2026-13-29', 'short')).toBe('Thu Dec 31 2026'));
  test('long Year Day',                () => expect(toGregorian('IFC:2026-13-29', 'long')).toBe('Thursday December 31, 2026'));
});

// ─── toGregorian — from IFC object ───────────────────────────────────────────
describe('toGregorian — IFC object', () => {
  test('from toIFC object', () => {
    const ifc = toIFC('2024-06-17', 'object');
    expect(toGregorian(ifc)).toBe('2024-06-17');
  });
  test('hand-built Sol 1',       () => expect(toGregorian({ year: 2026, month: 7,  day: 1  })).toBe('2026-06-18'));
  test('hand-built Leap Day',    () => expect(toGregorian({ year: 2024, month: 6,  day: 29 })).toBe('2024-06-17'));
  test('hand-built Year Day',    () => expect(toGregorian({ year: 2026, month: 13, day: 29 })).toBe('2026-12-31'));
  test('hand-built Jan 1',       () => expect(toGregorian({ year: 2026, month: 1,  day: 1  })).toBe('2026-01-01'));

  test('object short format', () => {
    expect(toGregorian({ year: 2026, month: 7, day: 1 }, 'short')).toBe('Thu Jun 18 2026');
  });
  test('object long format', () => {
    expect(toGregorian({ year: 2026, month: 7, day: 1 }, 'long')).toBe('Thursday June 18, 2026');
  });

  test('throws on missing day', () => {
    expect(() => toGregorian({ year: 2026, month: 3 })).toThrow('year, month and day');
  });
  test('throws on non-string non-object', () => {
    expect(() => toGregorian(12345)).toThrow('toGregorian expects');
  });
});

// ─── Round trips ──────────────────────────────────────────────────────────────
describe('round trips', () => {
  const dates = [
    '2026-01-01',  // Jan 1
    '2026-03-22',  // normal date
    '2026-06-17',  // day before Sol
    '2026-06-18',  // Sol 1
    '2026-07-15',  // Sol 28
    '2026-07-16',  // day after Sol
    '2026-12-30',  // IFC Dec 28
    '2026-12-31',  // Year Day
    '2024-06-16',  // day before Leap Day
    '2024-06-17',  // Leap Day
    '2024-06-18',  // day after Leap Day
    '2024-09-01',  // post-leap-day normal
    '2024-12-31',  // Year Day leap year
  ];

  dates.forEach(date => {
    test(`round trip ${date}`, () => {
      const ifc  = toIFC(date);
      const back = toGregorian(ifc);
      expect(back).toBe(date);
    });
  });

  test('Date object round trip', () => {
    const date = new Date(2026, 2, 22);
    const ifc  = toIFC(date);
    const back = toGregorian(ifc);
    expect(back).toBe('2026-03-22');
  });

  test('object format round trip', () => {
    const ifc  = toIFC('2024-06-17', 'object');
    const back = toGregorian(ifc);
    expect(back).toBe('2024-06-17');
  });
});

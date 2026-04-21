# ifcalendar-js 📅

A lightweight JavaScript library for converting dates between the normal calendar (A.K.A Gregorian) and the fixed calendar (A.K.A. International Fixed Calendar or IFC).

---

## What is the International Fixed Calendar? 🗓️

Imagine if every month started on the same day of the week. Imagine knowing
the weekday of any date instantly, without checking. No uneven month lengths,
no holidays that drift around the calendar year after year.

Also ..

&nbsp;&nbsp;&nbsp;&nbsp;**... June → ☀️ Sol → July ...**

... there is an extra month of summer right in the middle.

The normal calendar has months of different lengths so every month starts
on a different weekday and a month is "about 30 days". The fixed calendar solves this
with 13 months of exactly 28 days each. Every month starts on Sunday. Every
month ends on Saturday.

** Typical Month **

Sun,Mon,Tue,Wed,Thu,Fri,Sat
1,2,3,4,5,6,7
8,9,10,11,12,13,14
15,16,17,18,19,20,21
22,23,24,25,26,27,28

The IFC is also known as the **Cotsworth Calendar** and the **Eastman Calendar**
— named after Moses Cotsworth who proposed it in 1902 and George Eastman of
Kodak who famously adopted it for his company's internal calendar from 1928
to 1989.

### Bonus Days 🎁

The IFC has two special days called intercalary days. Intercalary means
inserted between — these days exist outside the normal week structure. They
have no weekday name and do not belong to any week.

- 🎆 **Year Day** (Dec 29) — the last day of every year. It sits after
  December 28th, outside the week, before the new year begins. Think of it
  as New Years Eve given its own special status outside the normal calendar.

- ☀️ **Leap Day** (Jun 29) — appears only in leap years, after June 28th.
  Like Year Day it has no weekday. It is a midsummer holiday that shows up
  once every four years, completely outside the flow of the week.

---

## Live Demos 🚀

Both demos are built entirely on this package via CDN. View source to see
the reference implementation.

### 🕐 IFC Desk Clock

[Open Desk Clock →](https://gooddadmike.github.io/ifcalendar-js/desk-clock.html)
[View Source →](https://github.com/gooddadmike/ifcalendar-js/blob/main/docs/desk-clock.html)

Keep it open on a spare monitor or tablet. Glancing at both dates together
is how the IFC date starts to feel real rather than abstract. The same way
setting a watch to military time gradually builds the mental mapping until
it becomes second nature.

### 📅 IFC Calendars

[Open Calendars →](https://gooddadmike.github.io/ifcalendar-js/calendars.html)
[View Source →](https://github.com/gooddadmike/ifcalendar-js/blob/main/docs/calendars.html)

An interactive dual calendar. Find any date on either side and the equivalent
date in the other calendar is shown instantly. Browse by month and year
independently on each side.

### 📱 Kiosk Mode

Add `?kiosk=true` to either URL to hide the navigation bar for a cleaner
display experience:
```
https://gooddadmike.github.io/ifcalendar-js/desk-clock.html?kiosk=true
https://gooddadmike.github.io/ifcalendar-js/calendars.html?kiosk=true
```

Pin it as a full-screen app with no browser chrome:

- **iOS / iPadOS** — Safari share button → Add to Home Screen
- **Android** — Chrome three-dot menu → Add to Home Screen
- **macOS** — Safari → File → Add to Dock (Sonoma and later)
- **Windows** — Edge → Apps → Install this site as an app

---

## How the Math Works 🧮

Every date in a year has a position from 1 to 365 called the day of year.
To find it, add the days in each month before the target date then add the
day itself — March 22nd is 31 + 28 + 22 = day 81. Divide by 28 and the
quotient gives the IFC month, the remainder gives the day — 81 divided by
28 is month 3 day 25, so March 22nd Gregorian is IFC March 25th. A 1 day
adjustment is made for any date after Leap Day in a leap year.

---

## Install 📦
```bash
npm install ifcalendar-js
```

For the CLI:
```bash
npm install -g ifcalendar-js
```

---

## CLI 💻
```bash
# Today's date in IFC
ifc

# Gregorian to IFC
ifc 2024-06-17

# IFC to Gregorian
ifc IFC:2024-06-29
```

Output:
```
IFC:2026-03-25
IFC:2024-06-29
2024-06-17
```

---

## API 📖

### `toIFC(input?, format?, locale?)`

Converts a Gregorian date to an IFC date. The return type depends on
the input type and the format you request.

Input accepts a Gregorian ISO string, a JavaScript `Date` object, or
nothing at all — no argument means today.
```js
const { toIFC } = require('ifcalendar-js');

// Default — returns an IFC string
toIFC('2026-03-22')            // 'IFC:2026-03-25'
toIFC('2024-06-17')            // 'IFC:2024-06-29'  (Leap Day)
toIFC('2026-12-31')            // 'IFC:2026-13-29'  (Year Day)
toIFC()                        // today e.g. 'IFC:2026-03-27'

// JavaScript Date object
toIFC(new Date(2026, 2, 22))   // 'IFC:2026-03-25'

// Short human string — weekday month day
toIFC('2026-03-22', 'short')   // 'Wed Mar 25'
toIFC('2026-06-18', 'short')   // 'Sun Sol 1'
toIFC('2024-06-17', 'short')   // 'LPD Jun 29'
toIFC('2026-12-31', 'short')   // 'YRD Dec 29'

// Long human string — weekday month day, year
toIFC('2026-03-22', 'long')    // 'Wednesday March 25, 2026'
toIFC('2026-06-18', 'long')    // 'Sunday Sol 1, 2026'
toIFC('2024-06-17', 'long')    // 'Leap Day June 29, 2024'
toIFC('2026-12-31', 'long')    // 'Year Day December 29, 2026'

// Structured object
toIFC('2026-03-22', 'object')
// {
//   year: 2026,
//   month: 3,        // 1-based: 1=January, 7=Sol, 13=December
//   day: 25,
//   weekday: 3,      // 0=Sun ... 6=Sat, null for intercalary days
//   isLeapDay: false,
//   isYearDay: false
// }
```

---

### `toGregorian(input, format?, locale?)`

Converts an IFC date back to a Gregorian date. Accepts an IFC string,
the object returned by `toIFC()`, or a hand-built object.
```js
const { toGregorian } = require('ifcalendar-js');

// Default — returns a Gregorian ISO string
toGregorian('IFC:2024-06-29')                  // '2024-06-17'  (Leap Day)
toGregorian('IFC:2026-07-01')                  // '2026-06-18'  (Sol 1)
toGregorian('IFC:2026-13-29')                  // '2026-12-31'  (Year Day)

// From toIFC() result — round trip
const ifc = toIFC('2024-06-17', 'object');
toGregorian(ifc)                               // '2024-06-17'

// Hand-built object
toGregorian({ year: 2026, month: 7, day: 1 }) // '2026-06-18'

// Short human string — weekday month day year
toGregorian('IFC:2026-07-01', 'short')         // 'Thu Jun 18 2026'
toGregorian('IFC:2024-06-29', 'short')         // 'Mon Jun 17 2024'

// Long human string — weekday month day, year
toGregorian('IFC:2026-07-01', 'long')          // 'Thursday June 18, 2026'
toGregorian('IFC:2024-06-29', 'long')          // 'Monday June 17, 2024'
```

The `IFC:` prefix is required when passing a string. The same numeric
string means different things in each calendar:
```
2024-07-15       -> Gregorian July 15
IFC:2024-07-15   -> IFC Sol 15 (Gregorian July 2nd)
```

IFC month numbers are 1-based and go up to 13:

| Number | Month   |
|--------|---------|
| 1 - 6  | Jan-Jun |
| 7      | Sol ☀️  |
| 8 - 13 | Jul-Dec |

---

### `isLeap(year)`

Quick check — is this year a leap year? ✅
```js
const { isLeap } = require('ifcalendar-js');

isLeap(2024);  // true
isLeap(2026);  // false
isLeap(1900);  // false  (divisible by 100 but not 400)
isLeap(2000);  // true   (divisible by 400)
```

---

### ES Modules

Drop the `require` and use `import` instead.
```js
import { toIFC, toGregorian, isLeap, EN } from 'ifcalendar-js';
```

---

### Locale Support 🌍

The library ships with an English locale (`EN`) used by default for
`'short'` and `'long'` format output. Pass your own locale object as
the third argument to use a different language.
```js
const { toIFC, EN } = require('ifcalendar-js');

// The EN locale shape — use it as a template
// {
//   ifcMonths:      [...13 full IFC month names...],
//   ifcMonthsShort: [...13 short IFC month names...],
//   gregMonths:      [...12 full Gregorian month names...],
//   gregMonthsShort: [...12 short Gregorian month names...],
//   weekdays:       ['Sunday', 'Monday', ...],
//   weekdaysShort:  ['Sun', 'Mon', ...],
//   leapDay:        { short: 'LPD', long: 'Leap Day' },
//   yearDay:        { short: 'YRD', long: 'Year Day' }
// }

// Partial override — spread EN and replace what you need
const FR = {
  ...EN,
  ifcMonthsShort:  ['Jan','Fév','Mar','Avr','Mai','Jun','Sol',
                    'Jul','Aoû','Sep','Oct','Nov','Déc'],
  ifcMonths:       ['Janvier','Février','Mars','Avril','Mai','Juin','Sol',
                    'Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthsShort:     ['Jan','Fév','Mar','Avr','Mai','Jun','Jul',
                    'Aoû','Sep','Oct','Nov','Déc'],
  months:          ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet',
                    'Août','Septembre','Octobre','Novembre','Décembre'],
  weekdaysShort:   ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
  weekdays:        ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
};

toIFC('2026-03-22', 'short', FR);  // 'Mer Mar 25'
toIFC('2026-03-22', 'long',  FR);  // 'Mercredi Mars 25, 2026'
```

Locale files live in `src/locales/`. To add a new language open a PR
adding `src/locales/fr.js` (or your language code) with the same shape
as `src/locales/en.js`.

---

### TypeScript Shape

Not a TypeScript package but here is the shape of an IFC date object
for reference:
```ts
type IFCDate = {
  year:      number
  month:     number        // 1-based: 1=January, 7=Sol, 13=December
  day:       number        // 1-28 for normal days, 29 for intercalary days
  weekday:   number | null // 0=Sun ... 6=Sat, null for Leap Day / Year Day
  isLeapDay: boolean
  isYearDay: boolean
}
```

---

## Timezones

`toIFC()` with no argument uses the local system time. To use a specific
timezone, pass an ISO string calculated in that zone:
```js
const iso = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'UTC'
}).format(new Date());

toIFC(iso);
```

Replace `'UTC'` with any IANA timezone string such as `'America/New_York'`,
`'Europe/London'`, or `'Pacific/Auckland'`.

---

## Implementations 🔧

- [pebble-ifc-complication](https://github.com/gooddadmike/pebble-ifc-complication) — Pebble watch face complication built on this package

---

## Go Deeper 🐇

**ifcalendar-js** focuses on converting between the IFC and Gregorian
calendars with clean human-readable formatting built in. For heavier date
and time needs these are worth knowing about:

- **[date-fns](https://date-fns.org/)** — modern, functional, tree-shakeable Gregorian utilities
- **[Luxon](https://moment.github.io/luxon/)** — powerful formatting, timezones, and internationalization
- **[day.js](https://day.js.org/)** — tiny (~2kb) with a familiar Moment-like API
- **[Temporal](https://tc39.es/proposal-temporal/)** — the new official JavaScript date/time API, part of ECMAScript 2026 and already shipping in modern browsers

If you need heavy timezone handling or a full-featured date picker, combine
**ifcalendar-js** with one of the above.

The white rabbit goes as deep as you want. 🐇

---

## A Note on How This Was Built 🤖

The ideation, code, and tests for this package were written lovingly alongside
[Claude.ai](https://claude.ai) and a little [Grok](https://grok.com) when
tokens were low. Not simply generated and pasted — actually discussed,
debugged, argued over, and refined through conversation. The bugs were real
and the fixes were earned.

---

## Contributing 🤝

Locale files welcome — add `src/locales/xx.js` matching the shape of
`src/locales/en.js` and open a PR.

See [CONTRIBUTING.md](https://github.com/gooddadmike/ifcalendar-js/blob/main/CONTRIBUTING.md) for full guidelines.

---

## Credits 🙏

- [Lucide Icons](https://lucide.dev) — MIT
- [Marked.js](https://marked.js.org) — MIT
- [jsDelivr](https://jsdelivr.com) — free open source CDN

---

## License

MIT

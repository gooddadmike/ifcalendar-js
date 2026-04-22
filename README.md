# ifcalendar-js 📅

A lightweighti, zero-dependency JavaScript library for converting dates between the normal (Gregorian) calendar and the International Fixed Calendar (IFC or just fixed calendar).

---

## What is the International Fixed Calendar? 🗓️

In the fixed calendar, every month begins on a Sunday and ends on a Saturday. This structure remains constant for all 13 months, every year.

| Sun | Mon | Tue | Wed | Thu | Fri | Sat |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| 8 | 9 | 10 | 11 | 12 | 13 | 14 |
| 15 | 16 | 17 | 18 | 19 | 20 | 21 |
| 22 | 23 | 24 | 25 | 26 | 27 | 28 |

&nbsp;&nbsp;&nbsp;&nbsp;**... June → ☀️ Sol → July ...**

By adding a 13th month called **Sol** in mid-summer, every month becomes exactly 28 days long. This eliminates the "30 or 31 days" guesswork. If you know the date, you know the weekday instantly. 

The IFC is also known as the **Cotsworth Calendar** and the **Eastman Calendar**. It is named after Moses Cotsworth who proposed it in 1902 and George Eastman of the Kodak company who famously adopted it for his company's internal calendar from 1928 to 1989.

### Bonus Days 🎁

The IFC has two special days called intercalary days. Intercalary means "inserted between". These days exist outside the normal week structure. They have no weekday name and do not belong to any week.

- 🎆 **Year Day** (Dec 29) — the last day of every year. 
> It is the final day of every year. It sits after December 28th and yet before Jan 1st outside the week. Think of it as New Years Eve given its own special status outside the normal calendar. That week goes `Sat Dec 28` then `Year Day Dec` then `Sun Jan 1`. We can write it as a 1-time 29th day for short.

- ☀️ **Leap Day** (Jun 29) — appears only in leap years, after June 28th.
> Similar to Year Day, it has no weekday. It is a midsummer holiday that shows up once every four years, completely outside the flow of the week.

---

## Live Demos 🚀

Both demos are built entirely on this package code. The UI supports a `?24h=true` parameter to maintain your time format preference when navigating between the clock and calendar views.

### 🕐 IFC Desk Clock

[Open Desk Clock →](https://gooddadmike.github.io/ifcalendar-js/desk-clock.html)
[View Source →](https://github.com/gooddadmike/ifcalendar-js/blob/main/docs/desk-clock.html)

> A minimalist clock for a secondary display. Glancing at both dates together builds a mental mapping similar to learning military time.

### 📅 IFC Calendars

[Open Calendars →](https://gooddadmike.github.io/ifcalendar-js/calendars.html)
[View Source →](https://github.com/gooddadmike/ifcalendar-js/blob/main/docs/calendars.html)
An interactive dual-calendar. Find any date on either side and see the equivalent instantly.

Pin either as a full-screen app with no browser chrome:

- **iOS / iPadOS** — Safari share button → Add to Home Screen
- **Android** — Chrome three-dot menu → Add to Home Screen
- **macOS** — Safari → File → Add to Dock (Sonoma and later)
- **Windows** — Edge → Apps → Install this site as an app

---

## How the Math Works 🧮

Every date in a year has a position from 1 to 365 called the day of year. To find it, add the days in each month before the target date then add the day itself. March 22nd is 31 + 28 + 22 = day 81. Divide by 28 and the quotient gives the IFC month, the remainder gives the day. 81 divided by 28 is month 3 day 25, so March 22nd Gregorian is IFC March 25th. A 1 day adjustment is made for any date after Leap Day in a leap year.

---

## Install 📦
```bash
npm install ifcalendar-js
```


---

## Basic Usage 🚀

```JavaScript
import { toIFC, toGregorian } from 'ifcalendar-js';

// Convert Gregorian to IFC
toIFC('2026-03-22')     // 'IFC:2026-03-25'

// Convert IFC back to Gregorian (requires IFC: prefix)
toGregorian('IFC:2026-07-01')     // '2026-06-18' (Sol 1st)
```


## API 📖

### `toIFC(input?, format?, locale?)`

Accepts a Gregorian ISO string, JS Date object, or empty (defaults to today)

| Format | Output Example |
| :--- | :--- |
| `default` | `'IFC:2026-03-25'` |
| `'short'` | `'Wed Mar 25'` |
| `'long'` | `'Wednesday March 25, 2026'` |
| `'object'` | Returns the structured `IFCDate` object (see below) |

### The IFCDate object

When using the 'object' format, you get a structured response including localized strings based on your provided locale:

```JavaScript
const date = toIFC('2026-03-22', 'object', EN);

// Result:
// {
// year: 2026,
// month: 3,    // 1-based (1=Jan, 7=Sol, 13=Dec)
// day:25,
// weekday: 3, // 0=Sun...6=Sat (null for intercalary days)
// isLeapDay: false,
// isYearDay: false,
// short: 'Wed Mar 25',   // Formatted via locale w EN default
// long: 'Wednesday March 25, 2026'
// }
```
---

### toGregorian(input, format?, locale?)

Converts an IFC date back to Gregorian. Accepts an IFC string (prefixed with IFC:) or an IFCDate object.

```JavaScript
toGregorian('IFC:2026-07-01');    // '2026-06-18'

toGregorian('IFC:2026-07-01', 'long');    // Thursday June 18, 2026
```

The `IFC:` prefix is required when passing a string. The same numeric string means different things in each calendar:

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

### isLeap(year)

Returns a boolean indicating if the given year follows leap rules (same as Gregorian)

```JavaScript
isLeap(2024); // true
isLeap(2026); // false
```

## CLI 💻️

Install globally to use the ifc command anywhere

```bash
npm install -g ifcalendar-js
```

### Usage 🚀

```bash
ifc              # Today's date in IFC
ifc 2024-06-17   # Convert specific date
```

## Locale Support 🌍

The library uses English (EN) by default. You can easily implement auto-detection in your apps:

```js
const userLang = navigator.language.split('-')[0];
const locales = { en: EN, fr: FR }; // Map your imported locales
const currentLocale = locales[userLang] || EN;

toIFC(new Date(), 'long', currentLocale);
```

---

### TypeScript Shape

Not a TypeScript package but here is the shape of an IFC date object for reference:

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

`toIFC()` with no argument uses the local system time. To use a specific timezone, pass an ISO string calculated in that zone:

```js
const iso = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'UTC'
}).format(new Date());

toIFC(iso);
```

Replace `'UTC'` with any IANA timezone string such as `'America/New_York'`, `'Europe/London'`, or `'Pacific/Auckland'`.

---

## Implementations 🔧

- [pebble-ifcalendar-complication](https://github.com/gooddadmike/pebble-ifcalendar-complication) — Pebble watch face complication built on this package

---

## Go Deeper 🐇

**ifcalendar-js** focuses on converting between the IFC and Gregorian calendars with clean human-readable formatting built in. For heavier date and time needs these are worth knowing about:

- **[date-fns](https://date-fns.org/)** — modern, functional, tree-shakeable Gregorian utilities
- **[Luxon](https://moment.github.io/luxon/)** — powerful formatting, timezones, and internationalization
- **[day.js](https://day.js.org/)** — tiny (~2kb) with a familiar Moment-like API
- **[Temporal](https://tc39.es/proposal-temporal/)** — the new official JavaScript date/time API, part of ECMAScript 2026 and already shipping in modern browsers

If you need heavy timezone handling or a full-featured date picker, combine **ifcalendar-js** with one of the above.

The white rabbit goes as deep as you want. 🐇

---

## A Note on How This Was Built 🤖

The ideation, code, and tests for this package were written lovingly alongside [Claude.ai](https://claude.ai) and a little [Grok](https://grok.com) when tokens were low. Not simply generated and pasted — actually discussed, debugged, argued over, and refined through conversation. The bugs were real and the fixes were earned.

---

## Contributing 🤝

Locale files welcome — add `src/locales/xx.js` matching the shape of `src/locales/en.js` and open a PR.

See [CONTRIBUTING.md](https://github.com/gooddadmike/ifcalendar-js/blob/main/CONTRIBUTING.md) for full guidelines.

---

## License

MIT

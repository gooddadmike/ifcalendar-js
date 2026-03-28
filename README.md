# ifcalendar-js 📅

A lightweight JavaScript library for converting dates between the normal
Gregorian calendar and the International Fixed Calendar (IFC).

---

## What is the International Fixed Calendar? 🗓️

Imagine knowing the day of the week for any date without checking. The first
of every month is always a Sunday. The last is always a Saturday. Every month
is exactly 4 weeks. No uneven lengths. No drifting holidays.

&nbsp;&nbsp;&nbsp;&nbsp;**... June → ☀️ Sol → July ...**

And there is an extra month of summer right in the middle.

The Gregorian calendar has months of different lengths so every month starts
on a different weekday and a month is "about 30 days". The IFC fixes this
with 13 months of exactly 28 days each.

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

Keep it open on a spare monitor or tablet. Glancing at both dates together
is how the IFC date starts to feel real rather than abstract. The same way
setting a watch to military time gradually builds the mental mapping until
it becomes second nature.

### 📅 IFC Calendars
[Open Calendars →](https://gooddadmike.github.io/ifcalendar-js/calendars.html)

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

On iOS, tap the share button in Safari and choose **Add to Home Screen** to
pin it as a full-screen app icon. Combined with kiosk mode it makes a clean
desk clock or calendar reference with no browser chrome.

---

## How the Math Works 🧮

To get the day of year for any Gregorian date, add up the days in each month
before it then add the day of the month. March 22nd for example: January has
31 days, February has 28 days in a normal year, so 31 + 28 + 22 = day 81.

Now divide by 28. Each IFC month is exactly 28 days so this tells you which
month you are in. Day 81 divided by 28 is 2 remainder 25 — IFC month 3
(March), day 25. That is how March 22nd Gregorian becomes IFC March 25th.
A 1 day adjustment has to be made after Leap Day.

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

### `toIFC(date?)`

Turn any Gregorian date into an IFC date object. Pass an ISO string or
nothing at all — no argument means today.
```js
const { toIFC } = require('@gooddadmike/ifcalendar-js');

toIFC('2026-03-22');
// {
//   year: 2026,
//   month: 3,      // 1-based: 1=January, 7=Sol, 13=December
//   day: 25,
//   weekday: 4,    // 0=Sun, 1=Mon ... 6=Sat, null for intercalary days
//   isLeapDay: false,
//   isYearDay: false
// }

toIFC('2024-06-17');
// { year: 2024, month: 6, day: 29, weekday: null, isLeapDay: true,  isYearDay: false }

toIFC('2026-12-31');
// { year: 2026, month: 13, day: 29, weekday: null, isLeapDay: false, isYearDay: true  }

// No argument uses today
toIFC();
```

---

### `toGregorian(input)`

Turn an IFC date back into a Gregorian ISO string. Pass a string, the
result of `toIFC()`, or build the object yourself.
```js
const { toGregorian } = require('ifcalendar-js');

// From an IFC date string
toGregorian('IFC:2024-06-29');  // '2024-06-17'  (Leap Day)
toGregorian('IFC:2026-07-01');  // '2026-06-18'  (Sol 1)
toGregorian('IFC:2026-13-29');  // '2026-12-31'  (Year Day)

// Pass the result of toIFC() directly
const ifc = toIFC('2024-06-17');
toGregorian(ifc);               // '2024-06-17'

// Or build an IFC date object by hand
toGregorian({ year: 2026, month: 7, day: 1 });  // '2026-06-18'  (Sol 1)
```

The `IFC:` prefix is required when passing a string. Without it the parser
assumes Gregorian. The same numeric string means different things in each
calendar:
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
import { toIFC, toGregorian, isLeap } from 'ifcalendar-js';
```

---

### Formatting and Locale

`toIFC()` returns a structured object with numeric values for month,
day and weekday. Formatting those numbers into display strings is
intentionally left to the consumer — this keeps the library focused
on math and gives you full control over language and style:
```js
const ifc    = toIFC('2026-03-22');
const months = ['Jan','Feb','Mar','Apr','May','Jun','Sol',
                'Jul','Aug','Sep','Oct','Nov','Dec'];
const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

console.log(`${months[ifc.month - 1]} ${ifc.day} ${days[ifc.weekday]}`);
// "Mar 25 Wed"
```

If you need a pre-formatted watch-friendly string with locale support,
see [pebble-ifc-complication](https://github.com/gooddadmike/pebble-ifc-complication)
which wraps this library with configurable month names, weekday names,
and special day labels.

---

### TypeScript Shape

Not a TypeScript package but here is the shape of an IFC date object
for reference — useful if you are writing `.d.ts` types or just want
to understand what `toIFC()` returns.
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

## Timezones 🌍

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

Curious about date and time handling in general? These are worth knowing about:

- [date-fns](https://date-fns.org) — modern JavaScript date utility library, functional and tree-shakeable
- [Temporal](https://tc39.es/proposal-temporal/docs/) — the upcoming JavaScript standard for date and time, fixing everything `Date` got wrong
- [Luxon](https://moment.github.io/luxon/) — powerful and friendly date/time library with full timezone support
- [day.js](https://day.js.org) — tiny 2kb date library with a familiar API

The white rabbit goes as deep as you want. 🐇

---

## A Note on How This Was Built 🤖

The ideation, code, and tests for this package were written lovingly alongside
[Claude.ai](https://claude.ai). Not generated and pasted — actually discussed,
debugged, argued over, and refined through conversation. The bugs were real,
the fixes were earned, and the documentation went through more drafts than
anyone should admit.

---
## Contributing 🤝

See [CONTRIBUTING.md](https://github.com/gooddadmike/ifcalendar-js/blob/main/CONTRIBUTING.md) for guidelines.

---

## Credits 🙏

- [Lucide Icons](https://lucide.dev) — MIT
- [Marked.js](https://marked.js.org) — MIT
- [jsDelivr](https://jsdelivr.com) — free open source CDN

---

## License

MIT


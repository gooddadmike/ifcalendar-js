# Contributing

Pull requests are welcome. A few guidelines:

## Core IFC rules — do not change lightly
The IFC math follows the standard Cotsworth/Eastman specification:
- 13 months x 28 days
- Leap Day inserted after June 28 (doy 169) in leap years only
- Year Day is the last day of the year (doy 365 or 366)
- Every month starts on Sunday, ends on Saturday
- Leap Day and Year Day have no weekday

Any PR that changes this behavior needs a very compelling reason and
must update the test suite accordingly.

## Adding features
- New config options should be additive and not break existing behavior
- `toIFC()` must always return a complete result object, don't change the shape
- New output formats go in a `format` option, not as separate functions
- Locale and language support is welcome, add to a `locale` option

## Code style
- Keep it simple, this is intentionally a zero-dependency library
- Pure functions only in `src/index.js`, no side effects
- Tests for every new behavior in `tests/ifc.test.js`
- Run `npm test` before submitting, all tests must pass

## Adding tests
- Edge cases around Leap Day and Year Day are especially important
- Round trip tests (Gregorian to IFC to Gregorian) for any new date paths
- If you find a date that converts incorrectly, add a failing test first

## What we would love to see
- Locale and language support for month and weekday names
- A `format` option for controlling output string style
- Additional CLI flags

## What to avoid
- Changing the `IFC:` prefix format, it exists to prevent ambiguity
- Returning raw strings from `toIFC()`, the result object is intentional
- Adding dependencies to the main package

## License

MIT

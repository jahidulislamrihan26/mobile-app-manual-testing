# QA status and summary report

**App:** My Demo App 1.3.0 (build 244), Android
**Environment:** Android 11 emulator (API 30, Pixel 6 profile, 1080 x 2400)
**Tester:** Md. Jahidul Islam Rihan
**Scope:** the buying journey: catalog, sorting, cart, login, checkout, order confirmation, menu

## Verdict: not ready for release

One **Critical** defect is open in the buying journey (BUG-001), and three **Major** ones are open in checkout. The exit rule in the [test strategy](01-test-strategy.md) (no open Critical or Major defects in the buying journey) is not met.

## Results at a glance

| | |
|---|---|
| Test cases | 38 |
| Executed | 32 (24 passed, 8 failed) |
| Not run | 6 (iOS, other Android versions and screens, rotation, interruptions, log-out then checkout, Reset App State) |
| Smoke cases | 5 of 5 passed: the app is usable, and a customer can complete a purchase |
| Defects | 8 open: 1 Critical, 3 Major, 3 Minor, 1 Cosmetic |

Pass rate of the executed cases: 24 of 32 (75%). The failures are concentrated in checkout validation, which is where a shop should be strictest.

## Defects

| ID | Severity | Summary |
|---|---|---|
| [BUG-001](../defects/BUG-001.md) | **Critical** | Back from the order confirmation opens a review screen that lets an empty order be placed (verified: Place Order confirms it) |
| [BUG-002](../defects/BUG-002.md) | Major | The review screen shows the full card number |
| [BUG-003](../defects/BUG-003.md) | Major | A 1-digit security code is accepted (verified: the order is confirmed) |
| [BUG-004](../defects/BUG-004.md) | Major | An expired card is refused without any message |
| [BUG-005](../defects/BUG-005.md) | Minor | A zip code of symbols is accepted |
| [BUG-006](../defects/BUG-006.md) | Minor | A full name of only digits is accepted |
| [BUG-007](../defects/BUG-007.md) | Minor | With the keyboard open, the address form does not scroll to the fields being filled |
| [BUG-008](../defects/BUG-008.md) | Cosmetic | Log-out confirmation reads "Are you sure you sure" |

The [Jira import file](../defects/jira-import.csv) loads these into Jira with severity mapped to priority.

## Recommendations, in order

1. **Fix BUG-001 first.** Reset the checkout state when an order completes and make Back on the confirmation screen go to the catalog. Add a rule that Place Order is disabled when the cart is empty. A regression test for it is a single automated flow.
2. **Mask the card number (BUG-002)** on the review screen and show only the last four digits.
3. **Validate the payment form as the address form is validated:** a 3 or 4 digit security code (BUG-003), and a visible message for an expired date (BUG-004).
4. **Tighten the address form** (zip code format by country, no digits-only names) and make it scroll with the keyboard (BUG-005, 006, 007).
5. **Fix the log-out wording** when someone is next in that file.

## What went well

- Prices, quantities and totals were correct in every path tried, including shipping.
- Sorting by name and by price is correct.
- Login refuses empty input, a wrong password and a locked-out user, each with a clear message, and the password is hidden.
- The cart handles colour, quantity and removal correctly.

## What was not tested, and the risk

| Not tested | Risk |
|---|---|
| iOS | Unknown. Nothing here says the app works or fails on iOS |
| Other Android versions, small screens, tablets, real devices | Layout and keyboard problems like BUG-007 are more likely on small screens and older versions |
| Rotation, interruptions, no network | A call or lost connection in the middle of payment is a common cause of duplicate or lost orders |
| Accessibility with a screen reader, large text | Possible exclusion of customers; not assessed |
| Performance, battery, memory | No baseline to compare with |

## How the work was done

The steps are written for a person holding a phone, and each was executed on the emulator, driven by script so that every result and screenshot can be repeated exactly. Each result was checked from the screenshot and the screen's UI tree. This is the same app and emulator as the [Maestro](https://github.com/jahidulislamrihan26/mobile-e2e-maestro) and [Appium](https://github.com/jahidulislamrihan26/appium-android-pytest) automation projects, so the passing cases are also covered by automated regression tests. Cases marked Maestro in the test suite are the ones those flows execute. A screen recording of a complete purchase is in [evidence/full-purchase.mp4](../evidence/full-purchase.mp4).

## Retest plan

When a fix arrives: retest the linked test case, re-run the smoke set, and re-run every case in the module that changed. Record the build number on the defect when it is closed.

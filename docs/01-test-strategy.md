# Test strategy: mobile shopping app

## The app and the goal

**My Demo App** (React Native, version 1.3.0, Android build 244) is a small shop published by Sauce Labs for demos and testing: browse products, sort, fill a cart, log in, enter an address and a card, place an order.

Goal of this test effort: decide whether the buying journey is safe to release, and give the team a ranked list of what to fix. The app is a public demo, not a client's product, so the defects are logged as if it were one, and the report says so.

## Scope

| In scope | Out of scope (and why) |
|---|---|
| Catalog, sorting, product page | Camera / QR scanner, location, fingerprint, drawing: need real hardware |
| Cart: add, change quantity, remove | The payment service: there is none behind the demo |
| Login (valid, invalid, locked-out) | Performance and battery: no baseline to compare with |
| Checkout: address, payment, review, place order | Localisation: the demo has English only |
| Menu actions (About, Reset App State, Log In/Out) | iOS: not executed (see the compatibility plan) |
| Data shown on screen: prices, totals, personal data | |

## Approach: risk first

| Risk | Why it matters | How it is tested |
|---|---|---|
| The purchase cannot be completed | No sales | Full purchase from catalog to confirmation, with a screen recording |
| Wrong money on screen | Wrong charge, complaints | Totals with one item, two items, different quantities; shipping |
| Bad data accepted at checkout | Failed deliveries, fraud | Boundary and invalid values for every address and card field |
| Sensitive data exposed | Card data is regulated | What the review screen and the fields show and hide |
| Users get stuck | Abandoned carts | Back button, logging out half-way, resetting state, empty cart |
| Sorting or product data is wrong | Customers pick the wrong thing | Check the order of every sort option against the prices |

## Test types used

- **Functional**: test cases with steps and expected results, written first, then executed.
- **Smoke**: the shortest set that proves the app is usable (a subset of the functional cases, marked in the test-case file).
- **Regression**: the full set, re-run after each fix. Retests are recorded on the defect.
- **Exploratory**: time-boxed sessions with a charter, to find what the written cases would not. Notes are in [03-exploratory-sessions.md](03-exploratory-sessions.md).
- **Compatibility**: planned across Android versions, screen sizes and iOS; see [02-device-compatibility.md](02-device-compatibility.md) for what was and was not run.
- **API**: not applicable here (the demo app has no backend of its own to test). On a real project this is done with Postman; see the [API testing project](https://github.com/jahidulislamrihan26/api-testing-newman-openapi).

## Severity and priority

| Severity (how bad) | Meaning here |
|---|---|
| Critical | The buying journey is blocked, money is wrong, or private data is exposed |
| Major | A core feature misbehaves, with a workaround |
| Minor | Small functional problem, little impact |
| Cosmetic | Wording, alignment |

Priority (how soon) is a separate decision made with the product owner. Each defect report states both.

## Entry and exit criteria

- **Entry:** a build that installs and starts, test accounts available, test data defined.
- **Exit (ready to release):** no open Critical or Major defects in the buying journey; every smoke case passes; all failed cases have a defect; known gaps in coverage are stated.

## How the tests were executed

The steps are written for a person holding a phone. Here, each was executed on an Android 11 emulator, with the steps driven by script so that the result and the screenshot can be repeated exactly, and the screen checked from the screenshot and the UI tree of each step. This is stated plainly in the summary report. No part of the work was run on an iOS device or a physical Android device.

## Tools

Android emulator (API 30), `adb` for screenshots and screen recording, Maestro to drive the steps, GitHub Actions to run it all, Markdown and Excel for the documents, and a Jira-ready CSV for the defects.

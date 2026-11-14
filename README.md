# Manual Mobile App Testing: Android

[![CI](https://github.com/jahidulislamrihan26/mobile-app-manual-testing/actions/workflows/ci.yml/badge.svg)](https://github.com/jahidulislamrihan26/mobile-app-manual-testing/actions/workflows/ci.yml)

A manual test package for a mobile shopping app, built the way a QA team hands work to a client: strategy, test cases with results, exploratory sessions, defect reports with screenshots and a video, a device compatibility plan and a final QA report.

**The app:** My Demo App 1.3.0 (React Native, Android build) by Sauce Labs, a public demo shop. Defects are reported as they would be on a real product; the demo has no real customers or payments.

## Result in one look

| | |
|---|---|
| Test cases | **38**, traced to 10 requirements and to the Maestro and Appium tests that automate them; 32 executed, 24 passed, 8 failed, 6 not run |
| Smoke | 5 of 5 passed: a customer can complete a purchase |
| Defects | **8** with steps, expected and actual results, screenshots: **1 Critical**, 3 Major, 3 Minor, 1 Cosmetic |
| Worst finding | After an order, pressing Back opens a checkout screen with an empty cart, and **Place Order confirms an order with no items** (verified) |
| Other findings | Full card number shown on the review screen; a 1-digit security code accepted and the order confirmed; an expired card refused with no message |
| Verdict | **Not ready for release** (exit rule not met) |
| Not tested | iOS, other Android versions and screen sizes, real devices, rotation, interruptions, accessibility with a screen reader |

## What is inside

| Deliverable | File |
|---|---|
| Test strategy: scope, risks, severity, exit criteria | [docs/01-test-strategy.md](docs/01-test-strategy.md) |
| Device and OS compatibility: what was run, what a real project would cover | [docs/02-device-compatibility.md](docs/02-device-compatibility.md) |
| Exploratory sessions: charters, what was tried, what was found | [docs/03-exploratory-sessions.md](docs/03-exploratory-sessions.md) |
| **QA summary report** (start here): verdict, defects, recommendations, gaps | [docs/04-qa-summary-report.md](docs/04-qa-summary-report.md) |
| Defect workflow: report fields, severity versus priority, life of a defect | [docs/05-defect-workflow.md](docs/05-defect-workflow.md) |
| Traceability matrix: 10 requirements, every case traced, state of each requirement | [docs/06-traceability-matrix.md](docs/06-traceability-matrix.md) |
| Excel workbook: summary, test cases with results, traceability, defects | [test-suite/Mobile-Test-Suite.xlsx](test-suite/Mobile-Test-Suite.xlsx) |
| Test cases as CSV | [test-suite/test-cases.csv](test-suite/test-cases.csv) |
| Defect reports, log and a [Jira import file](defects/jira-import.csv) | [defects/](defects) |
| Screenshots and a screen recording of a full purchase | [evidence/](evidence) |

## How the tests were executed

The steps are written for a person holding a phone. Here each was executed on an **Android 11 emulator**, with the steps driven by script so that every result and screenshot can be repeated exactly, and each result checked from the screenshot and the screen's UI tree. The scenarios are in [exploration/](exploration) and the [workflow](.github/workflows/explore.yml) runs them on GitHub Actions; the test cases marked "Maestro" are executed by the flows of my [Maestro project](https://github.com/jahidulislamrihan26/mobile-e2e-maestro). The same journey is also automated with [Appium and pytest](https://github.com/jahidulislamrihan26/appium-android-pytest).

Nothing here was run on iOS or on a physical device, and the report says so.

## How the files are built

Test cases and defects live in one data file ([tools/suite-data.js](tools/suite-data.js)); the CSV files, the Excel workbook, the defect pages and the Jira import are generated from it, and the data is checked first (every failed case has a defect, every defect has steps and an existing screenshot, a case that was not run claims no result).

```bash
cd tools
npm install
npm test
npm run build
```

## Skills shown

Risk-based test design, boundary and negative testing, exploratory charters, severity and priority judgement, evidence-based defect reports (steps, expected, actual, screenshot, video), Jira-ready export, device and OS compatibility planning, retest planning, and clear reporting of what was not tested.

The app is downloaded at run time for the exploratory session and is not stored here. It is published by Sauce Labs for demos and testing; it is not mine.

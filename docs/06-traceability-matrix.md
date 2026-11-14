# Traceability matrix

Generated from `tools/suite-data.js` by `npm run build`. It answers two questions: *is every requirement covered by a test*, and *what is the state of each requirement*.

| Requirement | Statement | Cases | Pass | Fail | Not run | Defects | State |
|---|---|---|---:|---:|---:|---|---|
| REQ-01 | A customer can browse the catalog and sort it by name or price | TC-001, TC-002, TC-003, TC-004 | 4 | 0 | 0 |  | Passing |
| REQ-02 | A customer can see a product and choose its options (colour, quantity) | TC-005, TC-006 | 2 | 0 | 0 |  | Passing |
| REQ-03 | A customer can add products to a cart, change quantities and remove them, and the cart shows the right totals | TC-007, TC-008, TC-009, TC-010, TC-011, TC-013 | 6 | 0 | 0 |  | Passing |
| REQ-04 | A customer can log in and out; wrong or locked-out accounts are refused clearly; the password is hidden | TC-014, TC-015, TC-016, TC-017, TC-018, TC-019, TC-020 | 5 | 1 | 1 | BUG-008 | Failing |
| REQ-05 | Checkout collects a valid shipping address and refuses invalid input | TC-021, TC-022, TC-023, TC-024 | 1 | 3 | 0 | BUG-005, BUG-006, BUG-007 | Failing |
| REQ-06 | Checkout collects a valid card and refuses invalid input, and protects the card data | TC-025, TC-026, TC-027, TC-028 | 1 | 3 | 0 | BUG-004, BUG-003, BUG-002 | Failing |
| REQ-07 | A customer can review and place an order once, and cannot place an order that is empty or already placed | TC-030, TC-031, TC-032 | 2 | 1 | 0 | BUG-001 | Failing |
| REQ-08 | Prices, shipping and totals shown are correct at every step | TC-012, TC-029 | 2 | 0 | 0 |  | Passing |
| REQ-09 | The menu and app information work as labelled | TC-033, TC-034 | 1 | 0 | 1 |  | Passing, partly untested |
| REQ-10 | The app works across supported devices, OS versions and interruptions | TC-035, TC-036, TC-037, TC-038 | 0 | 0 | 4 |  | Not tested |

Every requirement has at least one case, and every case traces to a requirement (checked by the data tests). The `Automated by` column of the [test cases](../test-suite/test-cases.csv) shows which cases are also executed by the [Maestro](https://github.com/jahidulislamrihan26/mobile-e2e-maestro) flows and the [Appium](https://github.com/jahidulislamrihan26/appium-android-pytest) tests, so a failing automated test can be traced back to the requirement it protects.

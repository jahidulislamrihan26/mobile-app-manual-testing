# Exploratory sessions

Exploratory testing means testing without a fixed script: pick a goal (a *charter*), try things, watch what the app does, and follow whatever looks odd. The written test cases cover what was expected. These sessions look for what was not.

Each session below has a charter, what was tried (the scenario files in [exploration/scenarios](../exploration/scenarios) repeat the steps exactly) and what was found. Every scenario saves a screenshot and the screen's UI tree, so a finding can be checked afterwards.

## Session 1: Can bad input get through checkout?

**Charter:** Explore the address and payment forms with unusual values, to find input the app should refuse and accepts.

| Tried | Result |
|---|---|
| Zip code `!!!???` | Accepted: **BUG-005** |
| Full name `12345` | Accepted: **BUG-006** |
| Expiry `01/20` (in the past) | Refused, but silently: **BUG-004** |
| Security code `1` | Accepted, and Place Order confirms the order: **BUG-003** |
| Card number that fails the checksum (`...1112`) | Refused (stays on the payment step) |
| All fields empty | Refused with a message for each field |

**Observation:** the address form shows a message under each empty field, so the app can show field errors; the payment form does not do the same for a past expiry date.

## Session 2: Is the money right?

**Charter:** Follow the prices from the catalog to the review screen with different quantities and products, and check every total by hand.

| Tried | Result |
|---|---|
| One Backpack to the review screen | 29.99 + 5.99 shipping = $35.98: correct |
| Backpack + Bike Light to the review screen | 29.99 + 9.99 + 5.99 = $45.97: correct |
| Quantity 3 on the product page | Badge 3, "3 items", $89.97: correct |
| Colour changed before adding | The chosen colour is shown in the cart |
| Sort by price and by name | Both orders correct |

No money defect found in these paths. Shipping is a flat $5.99 in every case tried; a second shipping option was not seen.

## Session 3: Can a customer get lost or stuck?

**Charter:** Use the back button, the menu and the end of the flow in unexpected ways, and look for screens that should not be reachable.

| Tried | Result |
|---|---|
| Press Back on the order confirmation, then tap Place Order | An empty "Review your order" screen; Place Order then shows "Checkout Complete: Thank you for your order": **BUG-001** (Critical) |
| Minus at quantity 1 | The item is removed at once, with no confirmation |
| Open the cart with nothing in it | A clear "No Items" message with a Go Shopping button |
| After an order, Continue Shopping | Catalog shown, cart badge cleared |
| Log Out from the menu | A confirmation dialog with a repeated word: **BUG-008** |
| Reset App State with an item in the cart | **Inconclusive**: the session never got past the open menu, so it is recorded as not run (TC-034) |

## Session 4: What does the app show and hide?

**Charter:** Look at what personal and payment data appears on screen, and where.

| Tried | Result |
|---|---|
| Type a password | Hidden as dots |
| Review screen after entering a card | Full card number and expiry shown: **BUG-002** |
| Address form with the keyboard open | The keyboard and footer cover the lower fields and the form does not scroll: **BUG-007** |

## What these sessions did not cover

- iOS, other Android versions and real devices (see [device compatibility](02-device-compatibility.md))
- Rotation, interruptions, loss of network
- The menu items that need hardware (QR scanner, location, fingerprint, drawing) and the Webview, Api Calls and Sauce Bot Video screens
- Accessibility with a screen reader, large text and dark mode

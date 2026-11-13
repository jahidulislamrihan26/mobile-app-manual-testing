# Device and OS compatibility

## What was actually run

| Platform | OS | Device | Screen | Status |
|---|---|---|---|---|
| Android | 11 (API 30) | Emulator, Pixel 6 profile | 1080 x 2400 | **Executed**: all results in this repository |
| Android | other versions | | | Not run |
| Android | small or large screens, tablets | | | Not run |
| iOS | any | | | **Not run** |
| Real devices | any | | | **Not run** |

Nothing in the results should be read as "works on iOS" or "works on all Android phones". One emulator profile was used. Claiming more would be guessing.

## What a real engagement would cover

The device list is chosen from the app's own analytics, not from a standard list: the devices and OS versions its users have today. With no analytics available, this is a sensible default for a consumer shopping app.

| Group | Examples | Why |
|---|---|---|
| Newest OS, mainstream phone | Android 15 on a recent Pixel or Samsung; iOS 18 on a current iPhone | Most users update, and new OS versions change permissions and keyboards |
| One or two versions back | Android 13 and 12; iOS 17 | Large share of users |
| Oldest supported OS | The app's minimum (Android API level and iOS version from its release notes) | Where missing features show up first |
| Small screen | Compact phone, about 5 inches | Buttons pushed off screen, text cut off |
| Large screen / tablet | Large phone, one tablet | Stretched layouts |
| Low-end hardware | Phone with 2-3 GB of RAM | Slow screens, crashes under memory pressure |
| Different manufacturers | Samsung, Xiaomi, one other | Custom Android skins change the keyboard, back gesture and permission dialogs |

## What to check on each device

- App installs, starts and the catalog loads
- The full purchase, once, with a real keyboard open (it covers fields on small screens)
- Rotation, if the app allows it, in the middle of checkout
- Back button / back gesture in every checkout step
- Interruptions: an incoming call, a notification, switching to another app and back, losing the network
- Text size and display size set to the largest values (accessibility settings)
- Dark mode on and off

## How to run the same cases on more devices

The test cases are written independently of the device, and the automated flows in the [Maestro suite](https://github.com/jahidulislamrihan26/mobile-e2e-maestro) can be pointed at any Android emulator or phone. A device cloud (BrowserStack, Sauce Labs, Firebase Test Lab) gives access to many real devices; the smoke set would run on all of them and the full set on the top few.

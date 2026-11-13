# Defect workflow

## What every defect report contains

| Field | Why |
|---|---|
| ID and a one-line title that says what is wrong | Searchable; readable in a list |
| Severity and priority | How bad, and how soon (see below) |
| Build, device and OS | A defect that happens on one device only is a different defect |
| Steps to reproduce | Numbered, short, starting from a known state. Anyone should be able to follow them without asking |
| Expected and actual result | Side by side, so the gap is obvious |
| Evidence | A screenshot of the bad state; a video when the problem is in the sequence of steps |
| Linked test case | So the retest knows what to run |
| Impact | Why anyone should care, in the reader's terms |

## Severity and priority are different

- **Severity** is how bad the problem is, decided by the tester: Critical (buying is blocked, money is wrong or private data is exposed), Major (a core feature misbehaves), Minor, Cosmetic.
- **Priority** is how soon it should be fixed, decided with the product owner. A Cosmetic typo on the home screen can be high priority before a launch; a Major problem in a screen nobody can reach can be low.

Here, severity drives the proposed priority, and the report is open to the product owner changing it.

## Life of a defect

`New` → `Open` (confirmed, reproduced) → `In progress` → `Fixed` (build number recorded) → `Retest` → `Closed` or `Reopened`.

Also: `Rejected` (not a defect, with the reason), `Duplicate` (linked to the original), `Deferred` (accepted, scheduled later).

## Retest rules

- Retest on the build that contains the fix, and write its number on the defect.
- Re-run the failed test case, then the smoke set, then every case in the module that changed.
- A defect that comes back is reopened, not replaced by a new one.

## Importing into Jira

[defects/jira-import.csv](../defects/jira-import.csv) maps the fields to Jira's CSV importer: Summary, Issue Type, Priority (Critical to Highest, Major to High, Minor to Medium, Cosmetic to Low), Labels, Component, Environment and a Description that holds the steps, expected and actual results.

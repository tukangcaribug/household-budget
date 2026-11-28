[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/tukangcaribug/household-budget/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/tukangcaribug/household-budget/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# The Alvarez Household — Family Ledger

A household budget site for a fictional family of four: Marco, Elena, Sofia and Leo Alvarez. One ledger for the whole household — income in, spending out, budgets per category, recurring bills, savings goals and a six-month report — kept entirely in the browser. No account, no network, nothing leaves the device.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — on a desktop or at a phone's size. Everything is static files under `app/` with no build step.

## What it does

- **Dashboard** (`#/`): income, spending, what's left and the savings rate for the month, each with its change since last month; a spending breakdown chart, the biggest costs, bills due this month, and the latest entries. Switch months with the Earlier / Later buttons.
- **Transactions** (`#/transactions`): add, edit and delete income and expenses, with category, date and note; search and filter by type and category; export the shown entries as CSV.
- **Budgets** (`#/budgets`): a monthly limit per spending category with progress bars and an over-budget warning; limits are editable and saved.
- **Bills** (`#/bills`): recurring monthly bills with due dates — rent, utilities, passes and subscriptions. A bill counts as paid when the ledger shows a matching payment that month, so nothing needs ticking by hand; add a bill or remove one.
- **Goals** (`#/goals`): savings goals with progress bars, add funds to a goal, and start a new goal.
- **Reports** (`#/reports`): income vs spending over six months, totals for the year so far, spending by category, the biggest single costs, and what the numbers say.

All entries are saved in the browser's `localStorage`, so the book survives a reload. The footer offers "Restore the sample November ledger" to reset the sample data. Sample figures cover June–November 2026, with November in full detail.

## Files

- `app/index.html` — page shell and navigation
- `app/style.css` — warm paper, dark green ink, amber accent
- `app/main.js` — hash router and event wiring
- `app/views.js` — page templates (dashboard, transactions, budgets, bills, goals, reports)
- `app/store.js` — localStorage persistence, month math and bill status
- `app/data.js` — categories, budgets, savings goals, recurring bills and seed transactions
- `app/charts.js` — hand-built SVG donut and bar charts
- `main.ts` — hands the site in (copies `app/` and `screenshots/`, writes `dossier.json`)
- `serve.ts` — local static server on port 8080

## License

MIT — see `LICENSE`.

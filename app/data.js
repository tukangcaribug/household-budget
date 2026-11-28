// Seed data for the Alvarez household ledger. All figures are fictional sample
// data for November 2026, with lighter history back to June 2026 so the monthly
// trend chart has something honest to draw from.

export const CATEGORIES = {
  expense: [
    { name: 'Housing', color: '#1f4d3a', budget: 1650 },
    { name: 'Groceries', color: '#b97a12', budget: 900 },
    { name: 'Transport', color: '#4a6b8a', budget: 260 },
    { name: 'Utilities', color: '#7a5a8a', budget: 230 },
    { name: 'Dining Out', color: '#a43d24', budget: 180 },
    { name: 'Entertainment', color: '#c25e7a', budget: 120 },
    { name: 'Health', color: '#3e7d5a', budget: 150 },
    { name: 'Kids', color: '#8a6d3b', budget: 260 },
    { name: 'Savings', color: '#2e5f4b', budget: 500 },
  ],
  income: [
    { name: 'Salary', color: '#1f4d3a', budget: 0 },
    { name: 'Freelance', color: '#b97a12', budget: 0 },
    { name: 'Other Income', color: '#4a6b8a', budget: 0 },
  ],
};

export function categoryColor(name) {
  for (const group of Object.values(CATEGORIES)) {
    const found = group.find((c) => c.name === name);
    if (found) return found.color;
  }
  return '#5c6b60';
}

export function defaultBudget(name) {
  const found = CATEGORIES.expense.find((c) => c.name === name);
  return found ? found.budget : 0;
}

export const GOALS_SEED = [
  { id: 'g1', name: 'Emergency fund', target: 6000, saved: 4250, note: 'Six months of essentials, kept in a separate savings account.' },
  { id: 'g2', name: 'Family summer trip', target: 2400, saved: 980, note: 'A week at the coast — train tickets, a small cottage, ice cream money.' },
  { id: 'g3', name: 'New car down payment', target: 8000, saved: 2150, note: 'The old sedan is on its last legs; aiming for a reliable used car.' },
  { id: 'g4', name: "Kids' college fund", target: 10000, saved: 1400, note: 'A little each month for Sofia and Leo, started this year.' },
];

// Recurring monthly bills: the fixed payments the household must not miss.
// `dueDay` is the day of the month the bill falls due; `amount` is the usual
// amount (utility bills vary a little, so "paid" is detected generously — see
// billStatus in store.js). `category` ties each bill to the transactions that
// pay it, so the bills page can tell at a glance what is settled and what is
// still to pay.
export const BILLS_SEED = [
  { id: 'b1', name: 'Rent', amount: 1650, dueDay: 1, category: 'Housing', note: 'Monthly rent, paid on the 1st.' },
  { id: 'b2', name: 'Electric bill', amount: 95, dueDay: 3, category: 'Utilities', note: 'Varies with the season — about $90–$105.' },
  { id: 'b3', name: 'Internet', amount: 65, dueDay: 8, category: 'Utilities', note: 'Fibre, same amount every month.' },
  { id: 'b4', name: 'Water bill', amount: 54, dueDay: 16, category: 'Utilities', note: 'Varies a little with usage.' },
  { id: 'b5', name: 'Streaming', amount: 15.99, dueDay: 19, category: 'Entertainment', note: 'Family streaming subscription.' },
  { id: 'b6', name: 'Bus passes', amount: 96, dueDay: 21, category: 'Transport', note: 'Monthly passes for Marco and Elena.' },
];

// Each row: [date, type, category, amount, note]
const SEED_ROWS = [
  // ---- June 2026 ----
  ['2026-06-01', 'income', 'Salary', 6000, 'Marco + Elena, monthly pay'],
  ['2026-06-05', 'income', 'Freelance', 320, 'Elena — logo work for a bakery'],
  ['2026-06-01', 'expense', 'Housing', 1650, 'Monthly rent'],
  ['2026-06-03', 'expense', 'Groceries', 152.4, 'Market Street weekly shop'],
  ['2026-06-10', 'expense', 'Groceries', 138.9, 'Market Street weekly shop'],
  ['2026-06-17', 'expense', 'Groceries', 121.6, 'Market Street weekly shop'],
  ['2026-06-24', 'expense', 'Groceries', 146.2, 'Market Street weekly shop'],
  ['2026-06-04', 'expense', 'Utilities', 88.3, 'Electric bill'],
  ['2026-06-08', 'expense', 'Utilities', 65, 'Internet'],
  ['2026-06-15', 'expense', 'Utilities', 48.9, 'Water bill'],
  ['2026-06-06', 'expense', 'Transport', 52.4, 'Fuel'],
  ['2026-06-20', 'expense', 'Transport', 96, 'Bus passes for the month'],
  ['2026-06-12', 'expense', 'Dining Out', 64.5, 'Pizza night with the kids'],
  ['2026-06-19', 'expense', 'Entertainment', 42, 'Cinema — family film'],
  ['2026-06-22', 'expense', 'Health', 36.8, 'Pharmacy'],
  ['2026-06-25', 'expense', 'Kids', 110, 'Summer camp deposit — Leo'],
  ['2026-06-28', 'expense', 'Savings', 500, 'Transfer to emergency fund'],
  // ---- July 2026 ----
  ['2026-07-01', 'income', 'Salary', 6000, 'Marco + Elena, monthly pay'],
  ['2026-07-14', 'income', 'Freelance', 410, 'Elena — menu design'],
  ['2026-07-01', 'expense', 'Housing', 1650, 'Monthly rent'],
  ['2026-07-02', 'expense', 'Groceries', 149.8, 'Market Street weekly shop'],
  ['2026-07-09', 'expense', 'Groceries', 133.2, 'Market Street weekly shop'],
  ['2026-07-16', 'expense', 'Groceries', 158.4, 'Market Street weekly shop'],
  ['2026-07-23', 'expense', 'Groceries', 129.7, 'Market Street weekly shop'],
  ['2026-07-05', 'expense', 'Utilities', 102.5, 'Electric bill — summer cooling'],
  ['2026-07-08', 'expense', 'Utilities', 65, 'Internet'],
  ['2026-07-18', 'expense', 'Utilities', 51.3, 'Water bill'],
  ['2026-07-07', 'expense', 'Transport', 48.9, 'Fuel'],
  ['2026-07-21', 'expense', 'Transport', 96, 'Bus passes for the month'],
  ['2026-07-11', 'expense', 'Dining Out', 78.2, 'Birthday dinner — Elena'],
  ['2026-07-15', 'expense', 'Entertainment', 29.9, 'Streaming + a rented film'],
  ['2026-07-19', 'expense', 'Health', 74.5, 'Dentist check-up — Sofia'],
  ['2026-07-26', 'expense', 'Kids', 145, 'Swimming lessons — both kids'],
  ['2026-07-28', 'expense', 'Savings', 500, 'Transfer to emergency fund'],
  // ---- August 2026 ----
  ['2026-08-01', 'income', 'Salary', 6000, 'Marco + Elena, monthly pay'],
  ['2026-08-20', 'income', 'Freelance', 275, 'Elena — flyer for the school fair'],
  ['2026-08-01', 'expense', 'Housing', 1650, 'Monthly rent'],
  ['2026-08-03', 'expense', 'Groceries', 141.5, 'Market Street weekly shop'],
  ['2026-08-10', 'expense', 'Groceries', 152.8, 'Market Street weekly shop'],
  ['2026-08-17', 'expense', 'Groceries', 118.3, 'Market Street weekly shop'],
  ['2026-08-24', 'expense', 'Groceries', 139.9, 'Market Street weekly shop'],
  ['2026-08-04', 'expense', 'Utilities', 94.7, 'Electric bill'],
  ['2026-08-08', 'expense', 'Utilities', 65, 'Internet'],
  ['2026-08-16', 'expense', 'Utilities', 49.6, 'Water bill'],
  ['2026-08-06', 'expense', 'Transport', 55.2, 'Fuel'],
  ['2026-08-12', 'expense', 'Transport', 210, 'Car service + new tyres'],
  ['2026-08-13', 'expense', 'Dining Out', 58.9, 'Lunch out after the fair'],
  ['2026-08-15', 'expense', 'Entertainment', 86, 'Day trip — zoo tickets'],
  ['2026-08-21', 'expense', 'Health', 28.9, 'Pharmacy'],
  ['2026-08-25', 'expense', 'Kids', 198, 'Back-to-school clothes + supplies'],
  ['2026-08-28', 'expense', 'Savings', 500, 'Transfer to emergency fund'],
  // ---- September 2026 ----
  ['2026-09-01', 'income', 'Salary', 6000, 'Marco + Elena, monthly pay'],
  ['2026-09-11', 'income', 'Freelance', 540, 'Elena — wedding invitations'],
  ['2026-09-01', 'expense', 'Housing', 1650, 'Monthly rent'],
  ['2026-09-02', 'expense', 'Groceries', 147.3, 'Market Street weekly shop'],
  ['2026-09-09', 'expense', 'Groceries', 129.5, 'Market Street weekly shop'],
  ['2026-09-16', 'expense', 'Groceries', 151.1, 'Market Street weekly shop'],
  ['2026-09-23', 'expense', 'Groceries', 133.8, 'Market Street weekly shop'],
  ['2026-09-04', 'expense', 'Utilities', 89.2, 'Electric bill'],
  ['2026-09-08', 'expense', 'Utilities', 65, 'Internet'],
  ['2026-09-14', 'expense', 'Utilities', 52.4, 'Water bill'],
  ['2026-09-05', 'expense', 'Transport', 47.6, 'Fuel'],
  ['2026-09-19', 'expense', 'Transport', 96, 'Bus passes for the month'],
  ['2026-09-12', 'expense', 'Dining Out', 66.4, 'Dinner with friends'],
  ['2026-09-18', 'expense', 'Entertainment', 34.5, 'Cinema — Leo chose'],
  ['2026-09-21', 'expense', 'Health', 92, 'Glasses — Marco'],
  ['2026-09-24', 'expense', 'Kids', 85, 'Football fees — Leo'],
  ['2026-09-27', 'expense', 'Savings', 500, 'Transfer to emergency fund'],
  // ---- October 2026 ----
  ['2026-10-01', 'income', 'Salary', 6000, 'Marco + Elena, monthly pay'],
  ['2026-10-16', 'income', 'Freelance', 385, 'Elena — poster for the library'],
  ['2026-10-22', 'income', 'Other Income', 120, 'Sold the old bike'],
  ['2026-10-01', 'expense', 'Housing', 1650, 'Monthly rent'],
  ['2026-10-02', 'expense', 'Groceries', 155.2, 'Market Street weekly shop'],
  ['2026-10-09', 'expense', 'Groceries', 142.6, 'Market Street weekly shop'],
  ['2026-10-16', 'expense', 'Groceries', 128.4, 'Market Street weekly shop'],
  ['2026-10-23', 'expense', 'Groceries', 149.9, 'Market Street weekly shop'],
  ['2026-10-30', 'expense', 'Groceries', 96.3, 'Top-up shop before the holiday'],
  ['2026-10-05', 'expense', 'Utilities', 91.8, 'Electric bill'],
  ['2026-10-08', 'expense', 'Utilities', 65, 'Internet'],
  ['2026-10-15', 'expense', 'Utilities', 55.1, 'Water bill'],
  ['2026-10-06', 'expense', 'Transport', 51.3, 'Fuel'],
  ['2026-10-20', 'expense', 'Transport', 96, 'Bus passes for the month'],
  ['2026-10-10', 'expense', 'Dining Out', 71.5, 'Anniversary dinner'],
  ['2026-10-17', 'expense', 'Entertainment', 48, 'Board game + cinema'],
  ['2026-10-19', 'expense', 'Health', 41.2, 'Pharmacy + vitamins'],
  ['2026-10-25', 'expense', 'Kids', 132, 'Halloween costumes + party'],
  ['2026-10-28', 'expense', 'Savings', 500, 'Transfer to emergency fund'],
  // ---- November 2026 (the current month, in full detail) ----
  ['2026-11-01', 'income', 'Salary', 6000, 'Marco + Elena, monthly pay'],
  ['2026-11-13', 'income', 'Freelance', 480, 'Elena — branding for a cafe'],
  ['2026-11-20', 'income', 'Other Income', 86, 'Refund — returned jacket'],
  ['2026-11-01', 'expense', 'Housing', 1650, 'Monthly rent'],
  ['2026-11-02', 'expense', 'Groceries', 148.2, 'Market Street weekly shop'],
  ['2026-11-03', 'expense', 'Utilities', 96.4, 'Electric bill'],
  ['2026-11-04', 'expense', 'Transport', 42.1, 'Fuel'],
  ['2026-11-05', 'expense', 'Groceries', 96.75, 'Market Street weekly shop'],
  ['2026-11-06', 'expense', 'Dining Out', 58.4, 'Friday dinner out'],
  ['2026-11-07', 'expense', 'Kids', 85, 'Football fees — Leo'],
  ['2026-11-08', 'expense', 'Utilities', 65, 'Internet'],
  ['2026-11-09', 'expense', 'Groceries', 132.55, 'Market Street weekly shop'],
  ['2026-11-10', 'expense', 'Entertainment', 34.5, 'Cinema — family film'],
  ['2026-11-11', 'expense', 'Health', 28.9, 'Pharmacy'],
  ['2026-11-12', 'expense', 'Transport', 38.6, 'Fuel'],
  ['2026-11-13', 'expense', 'Groceries', 121.3, 'Market Street weekly shop'],
  ['2026-11-14', 'expense', 'Kids', 45, 'School lunches — Sofia'],
  ['2026-11-15', 'expense', 'Dining Out', 72.15, 'Lunch with Elena’s parents'],
  ['2026-11-16', 'expense', 'Utilities', 54.2, 'Water bill'],
  ['2026-11-17', 'expense', 'Groceries', 108.9, 'Market Street weekly shop'],
  ['2026-11-18', 'expense', 'Health', 60, 'Dentist copay — Marco'],
  ['2026-11-19', 'expense', 'Entertainment', 15.99, 'Streaming subscription'],
  ['2026-11-20', 'expense', 'Groceries', 142.1, 'Market Street weekly shop'],
  ['2026-11-21', 'expense', 'Transport', 96, 'Bus passes for the month'],
  ['2026-11-22', 'expense', 'Kids', 42.75, 'Storybooks — Sofia'],
  ['2026-11-23', 'expense', 'Dining Out', 41.8, 'Takeaway — busy Tuesday'],
  ['2026-11-24', 'expense', 'Groceries', 118.45, 'Market Street weekly shop'],
  ['2026-11-25', 'expense', 'Savings', 500, 'Transfer to emergency fund'],
  ['2026-11-26', 'expense', 'Groceries', 87.6, 'Top-up shop — milk, bread, fruit'],
];

export function seedTransactions() {
  return SEED_ROWS.map((row, i) => ({
    id: `seed-${i + 1}`,
    date: row[0],
    type: row[1],
    category: row[2],
    amount: row[3],
    note: row[4],
  }));
}

export function seedBudgets() {
  const budgets = {};
  for (const c of CATEGORIES.expense) budgets[c.name] = c.budget;
  return budgets;
}

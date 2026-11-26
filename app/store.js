// The ledger store: everything the family enters is kept in localStorage, so the
// book survives a reload and never leaves this browser. Seed data is loaded once.

import { seedTransactions, seedBudgets, GOALS_SEED } from './data.js';

const KEY = 'alvarez-ledger-v1';
export const CURRENT_MONTH = '2026-11';

function freshState() {
  return {
    transactions: seedTransactions(),
    budgets: seedBudgets(),
    goals: GOALS_SEED.map((g) => ({ ...g })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const state = freshState();
      saveState(state);
      return state;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || !parsed.budgets || !Array.isArray(parsed.goals)) {
      return freshState();
    }
    return parsed;
  } catch {
    return freshState();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  const state = freshState();
  saveState(state);
  return state;
}

export function monthOf(date) {
  return String(date).slice(0, 7);
}

export function monthTransactions(state, month) {
  return state.transactions
    .filter((t) => monthOf(t.date) === month)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function monthSummary(state, month) {
  let income = 0;
  let spending = 0;
  const byCategory = {};
  for (const t of state.transactions) {
    if (monthOf(t.date) !== month) continue;
    if (t.type === 'income') {
      income += t.amount;
    } else {
      spending += t.amount;
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    }
  }
  return { income, spending, remaining: income - spending, byCategory };
}

export function allMonths(state) {
  const months = new Set(state.transactions.map((t) => monthOf(t.date)));
  return [...months].sort();
}

export function monthLabel(month) {
  const [year, m] = month.split('-').map(Number);
  const name = new Date(Date.UTC(year, m - 1, 1)).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return name;
}

export function shiftMonth(month, delta) {
  const [year, m] = month.split('-').map(Number);
  const d = new Date(Date.UTC(year, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function money(amount) {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function shortDate(date) {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function newId(state) {
  return `t${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
}

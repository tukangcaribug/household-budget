// The Alvarez Household ledger — router and wiring. Hash routes:
//
//   #/                dashboard for the chosen month
//   #/transactions    add, edit, delete, search and filter transactions
//   #/budgets         monthly budget per category
//   #/goals           savings goals and adding funds
//   #/reports         six-month trend, breakdown and insights
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { CATEGORIES, defaultBudget } from './data.js';
import {
  loadState, saveState, resetState, CURRENT_MONTH,
  monthOf, shiftMonth, allMonths, newId,
} from './store.js';
import {
  dashboardPage, transactionsPage, budgetsPage, goalsPage, reportsPage,
  notFoundPage, transactionForm,
} from './views.js';

const app = document.getElementById('app');
let state = loadState();
let month = CURRENT_MONTH;
let filter = { q: '', type: 'all', category: 'all' };
let editingId = null;

function route() {
  const hash = location.hash || '#/';
  if (hash.startsWith('#/transactions')) return 'transactions';
  if (hash.startsWith('#/budgets')) return 'budgets';
  if (hash.startsWith('#/goals')) return 'goals';
  if (hash.startsWith('#/reports')) return 'reports';
  if (hash === '#/' || hash === '' || hash === '#') return 'dashboard';
  return 'missing';
}

function render() {
  window.__shotReady = false;
  const page = route();
  const months = allMonths(state);
  if (!months.includes(month)) month = months[months.length - 1] || CURRENT_MONTH;
  const editing = editingId ? state.transactions.find((t) => t.id === editingId) || null : null;
  const ctx = { state, month, filter, editing };
  let html;
  let title;
  if (page === 'dashboard') { html = dashboardPage(ctx); title = 'The Alvarez Household — Family Ledger'; }
  else if (page === 'transactions') { html = transactionsPage(ctx); title = 'Transactions | The Alvarez Household'; }
  else if (page === 'budgets') { html = budgetsPage(ctx); title = 'Budgets | The Alvarez Household'; }
  else if (page === 'goals') { html = goalsPage(ctx); title = 'Savings Goals | The Alvarez Household'; }
  else if (page === 'reports') { html = reportsPage(ctx); title = 'Reports | The Alvarez Household'; }
  else { html = notFoundPage(); title = 'Not found | The Alvarez Household'; }
  document.title = title;
  app.innerHTML = html;
  for (const link of document.querySelectorAll('[data-nav]')) {
    link.classList.toggle('active', link.dataset.nav === page);
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function categoryOptions(type, selected) {
  return CATEGORIES[type].map((c) => `<option value="${c.name}" ${c.name === selected ? 'selected' : ''}>${c.name}</option>`).join('');
}

function saveTransaction(form) {
  const data = new FormData(form);
  const id = String(data.get('txid') || '');
  const type = data.get('type') === 'income' ? 'income' : 'expense';
  const category = String(data.get('category') || '');
  const date = String(data.get('date') || '');
  const amount = Math.round(Number(data.get('amount')) * 100) / 100;
  const note = String(data.get('note') || '').trim();
  const validCategory = CATEGORIES[type].some((c) => c.name === category);
  if (!validCategory || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !(amount > 0) || !note) return;
  if (id) {
    const t = state.transactions.find((x) => x.id === id);
    if (t) Object.assign(t, { type, category, date, amount, note });
  } else {
    state.transactions.push({ id: newId(state), type, category, date, amount, note });
  }
  month = monthOf(date);
  editingId = null;
  saveState(state);
  render();
}

app.addEventListener('submit', (event) => {
  const form = event.target;
  event.preventDefault();
  // NB: form.id is shadowed by the hidden input named "id" in some forms, so
  // read the attribute instead.
  const formId = form.getAttribute('id');
  if (formId === 'tx-form') {
    saveTransaction(form);
    return;
  }
  if (formId === 'budgets-form') {
    const data = new FormData(form);
    for (const [key, value] of data.entries()) {
      if (!key.startsWith('budget:')) continue;
      const name = key.slice('budget:'.length);
      const amount = Math.max(0, Math.round(Number(value)));
      if (Number.isFinite(amount) && name in state.budgets) state.budgets[name] = amount;
    }
    saveState(state);
    render();
    const note = document.getElementById('budgets-saved');
    if (note) note.textContent = 'Saved — the dashboard already shows the new limits.';
    return;
  }
  if (formId === 'goal-form') {
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const target = Math.round(Number(data.get('target')) * 100) / 100;
    const saved = Math.round(Number(data.get('saved')) * 100) / 100;
    const note = String(data.get('note') || '').trim();
    if (!name || !(target > 0) || !(saved >= 0)) return;
    state.goals.push({ id: newId(state), name, target, saved, note });
    saveState(state);
    render();
    return;
  }
  if (form.classList.contains('add-funds')) {
    const goal = state.goals.find((g) => g.id === form.dataset.goal);
    const data = new FormData(form);
    const amount = Math.round(Number(data.get('amount')) * 100) / 100;
    if (goal && amount > 0) {
      goal.saved = Math.round((goal.saved + amount) * 100) / 100;
      state.transactions.push({
        id: newId(state),
        type: 'expense',
        category: 'Savings',
        date: new Date().toISOString().slice(0, 10),
        amount,
        note: `Added to goal: ${goal.name}`,
      });
      saveState(state);
      render();
    }
  }
});

app.addEventListener('input', (event) => {
  const el = event.target;
  if (el.id === 'filter-q') { filter.q = el.value; render(); restoreFilterFocus('filter-q'); }
  if (el.id === 'filter-type') { filter.type = el.value; render(); }
  if (el.id === 'filter-category') { filter.category = el.value; render(); }
});

function restoreFilterFocus(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.focus();
  const len = el.value.length;
  el.setSelectionRange(len, len);
}

app.addEventListener('change', (event) => {
  const el = event.target;
  if (el.id === 'tx-type') {
    const select = document.getElementById('tx-category');
    if (select) {
      const first = CATEGORIES[el.value][0].name;
      select.innerHTML = categoryOptions(el.value, first);
    }
  }
});

app.addEventListener('click', (event) => {
  const el = event.target.closest('button, a');
  if (!el) return;
  if (el.dataset.month) {
    month = el.dataset.month;
    render();
    return;
  }
  if (el.dataset.edit) {
    editingId = el.dataset.edit;
    const t = state.transactions.find((x) => x.id === editingId);
    if (t) month = monthOf(t.date);
    render();
    const form = document.getElementById('tx-form');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (el.dataset.delete) {
    const t = state.transactions.find((x) => x.id === el.dataset.delete);
    if (t && window.confirm(`Delete this entry?\n${t.note} — $${t.amount.toFixed(2)}`)) {
      state.transactions = state.transactions.filter((x) => x.id !== t.id);
      saveState(state);
      render();
    }
    return;
  }
  if (el.hasAttribute('data-cancel-edit')) {
    editingId = null;
    render();
    return;
  }
  if (el.hasAttribute('data-reset-budgets')) {
    for (const c of CATEGORIES.expense) state.budgets[c.name] = defaultBudget(c.name);
    saveState(state);
    render();
  }
});

document.getElementById('reset-data').addEventListener('click', () => {
  if (window.confirm('Restore the sample November ledger? Your own entries will be replaced.')) {
    state = resetState();
    month = CURRENT_MONTH;
    editingId = null;
    filter = { q: '', type: 'all', category: 'all' };
    render();
  }
});

window.addEventListener('hashchange', () => {
  editingId = null;
  render();
});
render();

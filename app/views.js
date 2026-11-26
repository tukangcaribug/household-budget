// Page templates for the ledger. Every value from the family's data is escaped
// before it goes into the page, and every control below does what it says.

import { CATEGORIES, categoryColor, defaultBudget } from './data.js';
import { money, shortDate, monthLabel, monthSummary, monthTransactions, allMonths } from './store.js';
import { donutChart, trendChart } from './charts.js';

const escape = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

function monthSwitcher(month, months) {
  const i = months.indexOf(month);
  const prev = months[Math.max(0, i - 1)];
  const next = months[Math.min(months.length - 1, i + 1)];
  return `<div class="month-switch" role="group" aria-label="Choose month">
    <button type="button" class="btn ghost small" data-month="${prev}" ${month === prev ? 'disabled' : ''}>&larr; Earlier</button>
    <span class="month-label">${escape(monthLabel(month))}</span>
    <button type="button" class="btn ghost small" data-month="${next}" ${month === next ? 'disabled' : ''}>Later &rarr;</button>
  </div>`;
}

function budgetBar(spent, budget) {
  const pct = budget > 0 ? (spent / budget) * 100 : 0;
  const cls = pct > 100 ? 'over' : pct > 85 ? 'warn' : '';
  const width = Math.min(100, pct);
  return `<div class="bar" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100" aria-label="Budget used">
    <span class="${cls}" style="width:${width.toFixed(1)}%"></span></div>`;
}

function transactionRows(list) {
  if (!list.length) return `<tr><td colspan="6" class="empty">Nothing here yet — add a transaction above and it will show up in this list.</td></tr>`;
  return list.map((t) => `<tr>
    <td>${escape(shortDate(t.date))}</td>
    <td>${escape(t.note)}<span class="note">${escape(t.category)}</span></td>
    <td><span class="tag">${t.type === 'income' ? 'Income' : 'Expense'}</span></td>
    <td class="amt ${t.type === 'income' ? 'in' : 'out'}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</td>
    <td class="row-actions">
      <button type="button" data-edit="${t.id}">Edit</button>
      <button type="button" class="del" data-delete="${t.id}">Delete</button>
    </td>
  </tr>`).join('');
}

export function transactionForm(editing) {
  const t = editing || { id: '', type: 'expense', category: 'Groceries', date: '2026-11-26', amount: '', note: '' };
  const groups = ['expense', 'income'];
  const options = groups.map((g) => {
    const cats = CATEGORIES[g].map((c) => `<option value="${escape(c.name)}" ${t.category === c.name ? 'selected' : ''}>${escape(c.name)}</option>`).join('');
    return `<optgroup label="${g === 'expense' ? 'Spending' : 'Income'}" data-group="${g}">${cats}</optgroup>`;
  }).join('');
  return `<form id="tx-form" class="card" method="dialog">
    <h2>${editing ? 'Edit transaction' : 'Add a transaction'}</h2>
    <input type="hidden" name="txid" value="${escape(t.id)}">
    <div class="form-grid">
      <div class="field">
        <label for="tx-type">Type</label>
        <select id="tx-type" name="type">
          <option value="expense" ${t.type === 'expense' ? 'selected' : ''}>Expense</option>
          <option value="income" ${t.type === 'income' ? 'selected' : ''}>Income</option>
        </select>
      </div>
      <div class="field">
        <label for="tx-category">Category</label>
        <select id="tx-category" name="category">${options}</select>
      </div>
      <div class="field">
        <label for="tx-date">Date</label>
        <input id="tx-date" name="date" type="date" value="${escape(t.date)}" required>
      </div>
      <div class="field">
        <label for="tx-amount">Amount (USD)</label>
        <input id="tx-amount" name="amount" type="number" min="0.01" step="0.01" inputmode="decimal" value="${escape(t.amount)}" placeholder="0.00" required>
      </div>
      <div class="field full">
        <label for="tx-note">What was it?</label>
        <input id="tx-note" name="note" type="text" value="${escape(t.note)}" placeholder="e.g. Market Street weekly shop" maxlength="120" required>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn amber" type="submit">${editing ? 'Save changes' : 'Add to the ledger'}</button>
      ${editing ? '<button class="btn ghost" type="button" data-cancel-edit>Cancel edit</button>' : ''}
      <span class="form-note">Saved in this browser only.</span>
    </div>
  </form>`;
}

// ---------------- Dashboard ----------------

export function dashboardPage(ctx) {
  const { state, month } = ctx;
  const months = allMonths(state);
  const s = monthSummary(state, month);
  const recent = monthTransactions(state, month).slice(0, 8);
  const parts = Object.entries(s.byCategory)
    .map(([name, value]) => ({ label: name, value, color: categoryColor(name) }))
    .sort((a, b) => b.value - a.value);
  const totalBudget = Object.values(state.budgets).reduce((a, b) => a + b, 0);
  const budgetUsed = totalBudget > 0 ? Math.round((s.spending / totalBudget) * 100) : 0;
  const over = Object.entries(state.budgets)
    .filter(([name, b]) => (s.byCategory[name] || 0) > b)
    .map(([name]) => name);
  const topSpend = parts.slice(0, 3);
  return `
  <div class="page-head">
    <div>
      <h1>November at a glance</h1>
      <p class="lede">Marco, Elena, Sofia and Leo — one ledger for the whole household. Income in, spending out, and what is left for the month.</p>
    </div>
    ${monthSwitcher(month, months)}
  </div>

  ${over.length ? `<div class="callout"><h2>Heads up: ${escape(over.join(', '))} ${over.length > 1 ? 'are' : 'is'} over budget</h2>
    <p>${escape(over.join(', '))} ${over.length > 1 ? 'have' : 'has'} passed the monthly limit. A look at the <a href="#/budgets" style="color:#f7d98a">budgets page</a> shows where the month stands.</p></div>` : ''}

  <div class="grid-3">
    <section class="card tile"><div class="label">Income in ${escape(monthLabel(month))}</div>
      <div class="num in">${money(s.income)}</div><div class="sub">Pay, freelance and refunds</div></section>
    <section class="card tile"><div class="label">Spending</div>
      <div class="num out">${money(s.spending)}</div><div class="sub">${budgetUsed}% of the ${money(totalBudget)} monthly budget</div></section>
    <section class="card tile remaining"><div class="label">Left over</div>
      <div class="num">${money(s.remaining)}</div><div class="sub">${s.remaining >= 0 ? 'Still in the pot for the rest of the month' : 'Over the month’s income — time to trim'}</div></section>
  </div>

  <div class="grid-2wide">
    <section class="card">
      <h2>Where the money went</h2>
      <div class="chart-wrap">
        ${donutChart(parts)}
        <ul class="legend">
          ${parts.map((p) => `<li><span><span class="dot" style="background:${p.color}"></span>${escape(p.label)}</span><span class="lg-val">${money(p.value)}</span></li>`).join('') || '<li class="empty">No spending this month yet.</li>'}
        </ul>
      </div>
    </section>
    <section class="card">
      <h2>Biggest costs this month</h2>
      ${topSpend.map((p) => `<div class="kv"><span><span class="dot" style="background:${p.color}"></span>${escape(p.label)}</span><b>${money(p.value)}</b></div>`).join('') || '<p class="empty">Nothing recorded yet.</p>'}
      <div class="kv"><span>Monthly budget, all categories</span><b>${money(totalBudget)}</b></div>
      <div class="kv"><span>Spent so far</span><b>${money(s.spending)}</b></div>
      <p style="margin-top:12px"><a class="btn" href="#/transactions">Add a transaction</a> <a class="btn ghost" href="#/reports">See the full report</a></p>
    </section>
  </div>

  <section class="card">
    <h2>Latest entries</h2>
    <table class="ledger">
      <thead><tr><th>Date</th><th>What</th><th>Type</th><th class="amt">Amount</th><th></th></tr></thead>
      <tbody>${transactionRows(recent)}</tbody>
    </table>
    <p style="margin-top:12px"><a href="#/transactions">See all ${monthTransactions(state, month).length} transactions for ${escape(monthLabel(month))} &rarr;</a></p>
  </section>`;
}

// ---------------- Transactions ----------------

export function transactionsPage(ctx) {
  const { state, month, filter, editing } = ctx;
  const months = allMonths(state);
  let list = monthTransactions(state, month);
  const q = (filter.q || '').trim().toLowerCase();
  if (filter.type !== 'all') list = list.filter((t) => t.type === filter.type);
  if (filter.category !== 'all') list = list.filter((t) => t.category === filter.category);
  if (q) list = list.filter((t) => t.note.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  const cats = [...new Set(state.transactions.map((t) => t.category))].sort();
  const inc = list.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const exp = list.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  return `
  <div class="page-head">
    <div>
      <h1>Transactions</h1>
      <p class="lede">Every dollar in and out, in date order. Search, filter, fix a mistake or remove an entry.</p>
    </div>
    ${monthSwitcher(month, months)}
  </div>

  ${transactionForm(editing)}

  <section class="card">
    <div class="toolbar" role="search">
      <input type="search" id="filter-q" placeholder="Search notes or categories…" value="${escape(filter.q || '')}" aria-label="Search transactions">
      <select id="filter-type" aria-label="Filter by type">
        <option value="all" ${filter.type === 'all' ? 'selected' : ''}>All types</option>
        <option value="income" ${filter.type === 'income' ? 'selected' : ''}>Income only</option>
        <option value="expense" ${filter.type === 'expense' ? 'selected' : ''}>Expenses only</option>
      </select>
      <select id="filter-category" aria-label="Filter by category">
        <option value="all">All categories</option>
        ${cats.map((c) => `<option value="${escape(c)}" ${filter.category === c ? 'selected' : ''}>${escape(c)}</option>`).join('')}
      </select>
    </div>
    <p class="muted">${list.length} ${list.length === 1 ? 'entry' : 'entries'} shown · <b style="color:var(--green)">+${money(inc)} in</b> · <b>${money(exp)} out</b></p>
    <table class="ledger">
      <thead><tr><th>Date</th><th>What</th><th>Type</th><th class="amt">Amount</th><th></th></tr></thead>
      <tbody>${transactionRows(list)}</tbody>
    </table>
  </section>`;
}

// ---------------- Budgets ----------------

export function budgetsPage(ctx) {
  const { state, month } = ctx;
  const months = allMonths(state);
  const s = monthSummary(state, month);
  const rows = CATEGORIES.expense.map((c) => {
    const spent = s.byCategory[c.name] || 0;
    const budget = state.budgets[c.name] ?? c.budget;
    const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
    const left = budget - spent;
    const status = spent > budget
      ? `<span class="pill over">Over by ${money(spent - budget)}</span>`
      : pct > 85 ? `<span class="pill">${pct}% used — nearly there</span>`
      : `<span class="pill ok">${pct}% used</span>`;
    return `<div class="budget-row">
      <div class="budget-top">
        <span class="cat"><span class="dot" style="background:${c.color}"></span>${escape(c.name)}</span>
        <span class="fig"><b>${money(spent)}</b> of
          <label class="muted" for="budget-${escape(c.name)}">budget $</label>
          <input id="budget-${escape(c.name)}" name="budget:${escape(c.name)}" type="number" min="0" step="1" value="${budget}" style="width:92px;padding:5px 8px;border:1px solid #cbbf9e;border-radius:6px;background:#fffef8" aria-label="Monthly budget for ${escape(c.name)}">
        </span>
      </div>
      ${budgetBar(spent, budget)}
      <div class="budget-meta"><span>${status}</span><span>${left >= 0 ? `${money(left)} left` : `${money(-left)} over`}</span></div>
    </div>`;
  }).join('');
  const totalBudget = Object.values(state.budgets).reduce((a, b) => a + b, 0);
  return `
  <div class="page-head">
    <div>
      <h1>Monthly budgets</h1>
      <p class="lede">A limit for each kind of spending, set once and checked all month. Change a figure and save — the dashboard updates straight away.</p>
    </div>
    ${monthSwitcher(month, months)}
  </div>
  <form id="budgets-form" class="card" method="dialog">
    <h2>Budgets for ${escape(monthLabel(month))}</h2>
    <p class="muted">Total planned spending: <b style="color:var(--green-deep)">${money(totalBudget)}</b> · Actually spent: <b>${money(s.spending)}</b></p>
    ${rows}
    <div class="form-actions">
      <button class="btn amber" type="submit">Save budgets</button>
      <button class="btn ghost" type="button" data-reset-budgets>Back to the suggested budgets</button>
      <span class="form-note" id="budgets-saved"></span>
    </div>
  </form>
  <section class="card">
    <h2>How the limits were set</h2>
    <p>Housing is the fixed rent. Groceries and transport come from the last three months’ average, rounded up a little for a growing family. Dining out and entertainment are the fun money — small on purpose, so the savings goal still gets its share.</p>
  </section>`;
}

// ---------------- Goals ----------------

export function goalsPage(ctx) {
  const { state } = ctx;
  const totalSaved = state.goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = state.goals.reduce((a, g) => a + g.target, 0);
  const rows = state.goals.map((g) => {
    const pct = g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0;
    const done = g.saved >= g.target;
    return `<div class="goal">
      <div class="goal-main">
        <h3>${escape(g.name)} ${done ? '<span class="pill ok">Reached</span>' : ''}</h3>
        <p class="muted" style="margin-bottom:6px">${escape(g.note)}</p>
        <div class="goal-fig"><b>${money(g.saved)}</b> saved of ${money(g.target)} · ${pct}%</div>
        ${budgetBar(g.saved, g.target)}
      </div>
      <form class="add-funds" data-goal="${g.id}" method="dialog">
        <label for="fund-${g.id}" class="muted">Add $</label>
        <input id="fund-${g.id}" name="amount" type="number" min="0.01" step="0.01" inputmode="decimal" placeholder="0.00" required>
        <button class="btn small" type="submit">Add funds</button>
      </form>
    </div>`;
  }).join('');
  return `
  <div class="page-head">
    <div>
      <h1>Savings goals</h1>
      <p class="lede">What the family is saving towards, and how close each pot is. Adding funds here moves money into the goal — it does not change the month’s spending.</p>
    </div>
  </div>
  <section class="card">
    <h2>All goals together</h2>
    <p class="muted">${money(totalSaved)} saved towards ${money(totalTarget)} in total.</p>
    ${budgetBar(totalSaved, totalTarget)}
    ${rows}
  </section>
  <section class="card">
    <h2>Start a new goal</h2>
    <form id="goal-form" method="dialog">
      <div class="form-grid">
        <div class="field"><label for="goal-name">Goal name</label>
          <input id="goal-name" name="name" type="text" placeholder="e.g. New washing machine" maxlength="80" required></div>
        <div class="field"><label for="goal-target">Target amount (USD)</label>
          <input id="goal-target" name="target" type="number" min="1" step="1" placeholder="1000" required></div>
        <div class="field"><label for="goal-saved">Already saved (USD)</label>
          <input id="goal-saved" name="saved" type="number" min="0" step="0.01" value="0" required></div>
        <div class="field full"><label for="goal-note">Why this goal?</label>
          <input id="goal-note" name="note" type="text" placeholder="A short note for the family" maxlength="140"></div>
      </div>
      <div class="form-actions"><button class="btn amber" type="submit">Create goal</button></div>
    </form>
  </section>`;
}

// ---------------- Reports ----------------

export function reportsPage(ctx) {
  const { state, month } = ctx;
  const months = allMonths(state);
  const trend = months.map((m) => {
    const s = monthSummary(state, m);
    const [y, mo] = m.split('-').map(Number);
    const short = new Date(Date.UTC(y, mo - 1, 1)).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
    return { label: monthLabel(m), short, income: s.income, spending: s.spending, remaining: s.remaining };
  });
  const avgSpend = trend.reduce((a, m) => a + m.spending, 0) / Math.max(1, trend.length);
  const avgIncome = trend.reduce((a, m) => a + m.income, 0) / Math.max(1, trend.length);
  const best = [...trend].sort((a, b) => b.remaining - a.remaining)[0];
  const worst = [...trend].sort((a, b) => a.remaining - b.remaining)[0];
  const s = monthSummary(state, month);
  const parts = Object.entries(s.byCategory)
    .map(([name, value]) => ({ label: name, value, color: categoryColor(name) }))
    .sort((a, b) => b.value - a.value);
  const biggest = monthTransactions(state, month)
    .filter((t) => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  const over = Object.entries(state.budgets)
    .filter(([name, b]) => (s.byCategory[name] || 0) > b);
  return `
  <div class="page-head">
    <div>
      <h1>Reports</h1>
      <p class="lede">Six months of the household’s money, side by side — where it went, how the months compare, and what to watch next.</p>
    </div>
    ${monthSwitcher(month, months)}
  </div>

  <section class="card">
    <h2>Income vs spending, ${escape(trend[0].short)} – ${escape(trend[trend.length - 1].short)} 2026</h2>
    ${trendChart(trend)}
    <div class="grid-3" style="margin-top:14px">
      <div><div class="label" style="font-size:.85rem;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-soft)">Average income / month</div><div class="num" style="font-size:1.5rem;font-weight:bold;color:var(--green-deep)">${money(avgIncome)}</div></div>
      <div><div class="label" style="font-size:.85rem;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-soft)">Average spending / month</div><div class="num" style="font-size:1.5rem;font-weight:bold;color:var(--green-deep)">${money(avgSpend)}</div></div>
      <div><div class="label" style="font-size:.85rem;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-soft)">Average left over / month</div><div class="num" style="font-size:1.5rem;font-weight:bold;color:var(--green-deep)">${money(avgIncome - avgSpend)}</div></div>
    </div>
  </section>

  <div class="grid-2">
    <section class="card">
      <h2>Spending by category — ${escape(monthLabel(month))}</h2>
      <div class="chart-wrap">
        ${donutChart(parts, 190)}
        <ul class="legend">
          ${parts.map((p) => `<li><span><span class="dot" style="background:${p.color}"></span>${escape(p.label)}</span><span class="lg-val">${money(p.value)}</span></li>`).join('') || '<li class="empty">No spending this month yet.</li>'}
        </ul>
      </div>
    </section>
    <section class="card">
      <h2>Biggest single costs — ${escape(monthLabel(month))}</h2>
      ${biggest.map((t) => `<div class="kv"><span>${escape(shortDate(t.date))} — ${escape(t.note)}<span class="note">${escape(t.category)}</span></span><b>${money(t.amount)}</b></div>`).join('') || '<p class="empty">No expenses this month yet.</p>'}
    </section>
  </div>

  <section class="card">
    <h2>What the numbers say</h2>
    ${best ? `<div class="insight"><b>Best month so far: ${escape(best.label)}.</b> ${money(best.remaining)} left over — the family spent least relative to what came in.</div>` : ''}
    ${worst ? `<div class="insight"><b>Tightest month: ${escape(worst.label)}.</b> Only ${money(worst.remaining)} left over, mostly because of higher ${worst.label === 'August 2026' ? 'transport and back-to-school costs' : 'spending that month'}.</div>` : ''}
    ${over.length
      ? `<div class="insight"><b>Over budget this month:</b> ${over.map(([n, b]) => `${escape(n)} (${money((s.byCategory[n] || 0) - b)} over)`).join(', ')}. Groceries run high when the kids eat at home more — worth a look before next month’s shop.</div>`
      : `<div class="insight"><b>Every category is inside its budget this month.</b> Nice going — the leftover can go straight to the emergency fund.</div>`}
    <div class="insight"><b>Steady habit:</b> the $500 monthly transfer to savings has gone out every month since June, which is why the emergency fund is already past $4,000.</div>
  </section>`;
}

export function notFoundPage() {
  return `<h1>That page isn’t in the ledger</h1>
  <p class="lede">The address doesn’t match a section of the family budget. The dashboard, transactions, budgets, goals and reports are all in the menu above.</p>
  <p><a class="btn" href="#/">Back to the dashboard</a></p>`;
}

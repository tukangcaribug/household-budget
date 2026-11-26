// Hand-built SVG charts: a donut for the spending breakdown and grouped bars for
// the monthly trend. No chart library, no network — just geometry.

import { money } from './store.js';

const escape = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

export function donutChart(parts, size = 220) {
  const total = parts.reduce((sum, p) => sum + p.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r * 0.62;
  if (total <= 0) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="No spending recorded">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e6ddc2" stroke-width="26"/>
      <text x="${cx}" y="${cy}" text-anchor="middle" font-size="15" fill="#5c6b60">No spending</text>
    </svg>`;
  }
  let angle = -Math.PI / 2;
  const slices = parts.map((p) => {
    const frac = p.value / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    const d = `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z`;
    return `<path d="${d}" fill="${p.color}"><title>${escape(p.label)} — ${money(p.value)}</title></path>`;
  });
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category">
    ${slices.join('')}
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="13" fill="#5c6b60">Spent in month</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="18" font-weight="bold" fill="#143627">${money(total)}</text>
  </svg>`;
}

export function trendChart(months, width = 520, height = 240) {
  const padL = 46;
  const padB = 26;
  const padT = 12;
  const max = Math.max(...months.flatMap((m) => [m.income, m.spending]), 1);
  const innerW = width - padL - 8;
  const innerH = height - padT - padB;
  const groupW = innerW / months.length;
  const barW = Math.min(26, groupW / 3);
  const scale = (v) => innerH * (v / max);
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padT + innerH * (1 - f);
    return `<line x1="${padL}" y1="${y}" x2="${width - 8}" y2="${y}" stroke="#e6ddc2" stroke-width="1"/>
      <text x="${padL - 6}" y="${y + 4}" text-anchor="end" font-size="11" fill="#5c6b60">$${Math.round((max * f) / 1000)}k</text>`;
  }).join('');
  const bars = months.map((m, i) => {
    const gx = padL + i * groupW + groupW / 2;
    const incH = scale(m.income);
    const spH = scale(m.spending);
    return `<rect x="${(gx - barW - 3).toFixed(1)}" y="${(padT + innerH - incH).toFixed(1)}" width="${barW}" height="${incH.toFixed(1)}" rx="2" fill="#1f4d3a">
        <title>${escape(m.label)} income — ${money(m.income)}</title></rect>
      <rect x="${(gx + 3).toFixed(1)}" y="${(padT + innerH - spH).toFixed(1)}" width="${barW}" height="${spH.toFixed(1)}" rx="2" fill="#b97a12">
        <title>${escape(m.label)} spending — ${money(m.spending)}</title></rect>
      <text x="${gx.toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="11" fill="#5c6b60">${escape(m.short)}</text>`;
  }).join('');
  return `<svg width="100%" viewBox="0 0 ${width} ${height}" role="img" aria-label="Monthly income and spending trend" style="max-width:${width}px">
    ${grid}
    <line x1="${padL}" y1="${padT + innerH}" x2="${width - 8}" y2="${padT + innerH}" stroke="#cbbf9e" stroke-width="1"/>
    ${bars}
  </svg>
  <p class="chart-note"><span style="color:#1f4d3a">■</span> Income &nbsp; <span style="color:#b97a12">■</span> Spending</p>`;
}

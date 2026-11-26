// Measures the rendered DOM in headless Chrome and fails when containers do not line up (top/bottom/margins/gaps, to the
// pixel, 1 px of rounding) or when an icon leaves its box. The dev server must be running.
// Usage: CHROME=/path/to/chrome-headless-shell [URL=http://localhost:5185/] node scripts/check-layout.mjs
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL_BASE = process.env.URL || 'http://localhost:5185/';
const SIZES = process.env.ONLY ? [process.env.ONLY.split('x').map(Number)] : [[1920, 1080], [1920, 945], [1280, 720], [1024, 768], [1080, 1920], [1080, 1080], [1920, 480], [1920, 52], [1920, 120], [200, 1920]];
const SCENARIOS = ['code=801', 'code=800&days=3', 'code=500&night=1&theme=dark'];
const TOL = 1;

function measure(w, h, query) {
  const out = execFileSync(process.env.CHROME, [
    '--no-sandbox', '--disable-gpu', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'wl-'))}`, `--window-size=${w},${h}`,
    '--virtual-time-budget=8000', '--dump-dom', `${URL_BASE}?measure=1&${query}`,
  ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  const m = /MEASURE(.*?)END/s.exec(out);
  if (!m) {
    throw new Error('no measurement');
  }
  return JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
}

const failures = [];
const check = (label, a, b) => {
  if (Math.abs(a - b) > TOL) {
    failures.push(`${label}: ${a.toFixed(2)} != ${b.toFixed(2)}`);
  }
};

SIZES.forEach(([w, h]) => SCENARIOS.forEach((query) => {
  const tag = `${w}x${h} ${query}`;
  let m;
  try {
    m = measure(w, h, query);
  } catch (error) {
    failures.push(`${tag}: ${error.message}`);
    return;
  }
  const rem = m.remPx;
  const s = m.stage;
  const [now] = m.now;
  const [fc] = m.forecast;
  if (now && fc) {
    if (w / h >= 3 && w / h < 6) { // wide: side by side
      check(`${tag} top`, now.top, fc.top);
      check(`${tag} bottom`, now.bottom, fc.bottom);
      check(`${tag} left margin`, now.left - s.left, 4 * rem);
      check(`${tag} right margin`, s.right - fc.right, 4 * rem);
      check(`${tag} gap`, fc.left - now.right, 4 * rem);
    } else if (w / h >= 1.2) { // landscape
      check(`${tag} top`, now.top, fc.top);
      check(`${tag} bottom`, now.bottom, fc.bottom);
      check(`${tag} left margin`, now.left - s.left, 4 * rem);
      check(`${tag} right margin`, s.right - fc.right, 4 * rem);
      check(`${tag} gap`, fc.left - now.right, 4 * rem);
      check(`${tag} top margin`, now.top - s.top, 4 * rem);
      check(`${tag} bottom margin`, s.bottom - now.bottom, 4 * rem);
    } else { // portrait and square: stacked, same width
      check(`${tag} left`, now.left, fc.left);
      check(`${tag} right`, now.right, fc.right);
      check(`${tag} left margin`, now.left - s.left, 4 * rem);
      check(`${tag} right margin`, s.right - now.right, 4 * rem);
      check(`${tag} top margin`, now.top - s.top, 4 * rem);
      check(`${tag} bottom margin`, s.bottom - fc.bottom, 4 * rem);
      if (w / h > 0.8) {
        check(`${tag} gap`, fc.top - now.bottom, 4 * rem);
      }
    }
    if (w / h <= 0.8 && m.wells.length) {
      check(`${tag} details left`, m.wells[0].left, now.left);
      check(`${tag} details right`, m.wells[m.wells.length - 1].right, now.right);
    }
    m.company.forEach((c) => {
      if (c.right - now.right > TOL || now.left - c.left > TOL) failures.push(`${tag}: company tile outside the now card`);
    });
  }
  m.icons.forEach((icon, i) => {
    const { box: b, parent: p } = icon;
    if (b.left < p.left - TOL || b.top < p.top - TOL || b.right > p.right + TOL || b.bottom > p.bottom + TOL) {
      failures.push(`${tag}: icon ${i} leaves its box`);
    }
  });
  console.log(`measured ${tag}`);
}));

if (failures.length) {
  console.error(`\nFAIL (${failures.length})\n${failures.join('\n')}`);
  process.exit(1);
}
console.log('\nall containers aligned, no icon out of its box');

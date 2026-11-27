// Measures the rendered DOM in headless Chrome for every format and message: nothing outside the screen, text >= 2.6 rem,
// block (with its hard shadow) inside the plate. The dev server must be running.
// Usage: CHROME=/path/to/chrome-headless-shell [URL=http://localhost:5182/] node scripts/check-layout.mjs
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL_BASE = process.env.URL || 'http://localhost:5182/';
const SIZES = [[1920, 1080], [1080, 1920], [1080, 1080], [1920, 480], [1920, 52], [200, 1920], [1280, 720], [1366, 768], [1024, 768], [768, 1024]];
const q = encodeURIComponent;
const MESSAGES = {
  short: 'Perigo',
  m5: 'Fogo!',
  m60: 'Atenção: risco biológico, use proteção e evite a área até liberação'.slice(0, 60),
  m200: 'Atenção: vazamento de produto químico no setor 4. Evacue a área imediatamente pelas saídas de emergência e aguarde instruções da brigada responsável. Não use elevadores. Siga a sinalização de rota de fuga até o ponto de encontro externo.'.slice(0, 200),
  longword: 'Desinstitucionalização',
  empty: '',
};
const SHADOW = { 'landscape': 12, 'portrait': 12, 'square': 12, 'wide': 8, 'strip-h': 0, 'strip-v': 0 };

function measure(w, h, query) {
  const out = execFileSync(process.env.CHROME, [
    '--no-sandbox', '--disable-gpu', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'ai-'))}`, `--window-size=${w},${h}`,
    '--virtual-time-budget=15000', '--dump-dom', `${URL_BASE}?measure=1&${query}`,
  ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  const m = /MEASURE(.*?)END/s.exec(out);
  return m ? JSON.parse(m[1]) : null;
}

let failures = 0;
const report = [];
SIZES.forEach(([w, h]) => {
  Object.entries(MESSAGES).forEach(([name, message]) => {
    const m = measure(w, h, `icon=fire&alert_message=${q(message)}`);
    const problems = [];
    if (!m) {
      problems.push('no measurement');
    } else {
      const layout = (m.layout || '').split(' ')[1];
      const shadow = (SHADOW[layout] || 0) * (m.remPx / 10);
      if (m.docOverflowX > 1 || m.docOverflowY > 1) problems.push(`page overflow ${m.docOverflowX}x${m.docOverflowY}`);
      if (m.panel && m.field) {
        if (m.panel.r + shadow > m.field.r + 1 || m.panel.b + shadow > m.field.b + 1 || m.panel.x < m.field.x - 1 || m.panel.y < m.field.y - 1) problems.push('block (with shadow) outside the plate');
      }
      if (m.fontRem !== undefined && m.fontRem < 2.6 - 0.01) problems.push(`font ${m.fontRem.toFixed(2)} rem < 2.6`);
      if (m.textOverflowX > 1 && layout !== 'strip-h') problems.push(`text wider than its box by ${m.textOverflowX}px`);
      if (m.textOverflowY > 1 && layout !== 'strip-h') problems.push(`text taller than its box by ${m.textOverflowY}px`);
      report.push(`${w}x${h} ${name}: layout ${layout}, font ${m.fontRem === undefined ? '-' : m.fontRem.toFixed(1)} rem${m.clamped ? ' (ellipsis)' : ''}${problems.length ? ` PROBLEMS: ${problems.join('; ')}` : ''}`);
    }
    if (problems.length) failures += 1;
  });
});
console.log(report.join('\n'));
console.log(failures ? `${failures} scenarios with problems` : 'all scenarios OK');
process.exit(failures ? 1 : 0);

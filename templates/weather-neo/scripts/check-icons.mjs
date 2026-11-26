// Draws every weather icon (both themes, as the template renders them) on a canvas in headless Chrome and fails
// when any non-transparent pixel touches the edge of the image (= a clipped sun ray, drop or outline).
// Usage: CHROME=/path/to/chrome-headless-shell node scripts/check-icons.mjs
import { readFileSync, readdirSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { iconSource } from '../src/util/weather.js';

// ICONS_DIR + RAW=1 renders files as they are (no padding), e.g. to prove the check catches the original defect
const dir = process.env.ICONS_DIR || resolve(import.meta.dirname, '../src/assets/weather');
const icons = readdirSync(dir).filter((f) => f.endsWith('.svg')).map((f) => [f.replace('.svg', ''), readFileSync(join(dir, f), 'utf8')]);
const variants = [];
icons.forEach(([name, svg]) => {
  if (process.env.RAW) {
    variants.push({ id: name, src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` });
    return;
  }
  variants.push({ id: `${name}/light`, src: iconSource(svg, '#E4E9F0', true) });
  variants.push({ id: `${name}/dark`, src: iconSource(svg, '#23272E', false) });
});

const html = `<!doctype html><body><pre id="out"></pre><script>
var variants = ${JSON.stringify(variants)};
var results = [];
var pending = variants.length;
variants.forEach(function (v) {
  var img = new Image();
  img.onload = function () {
    var size = 512, c = document.createElement('canvas');
    c.width = size; c.height = size;
    var x = c.getContext('2d');
    x.drawImage(img, 0, 0, size, size);
    var d = x.getImageData(0, 0, size, size).data, touched = 0, inked = 0;
    for (var i = 0; i < size; i += 1) {
      [[i, 0], [i, size - 1], [0, i], [size - 1, i]].forEach(function (p) {
        if (d[(p[1] * size + p[0]) * 4 + 3] > 8) touched += 1;
      });
    }
    for (var j = 3; j < d.length; j += 4) { if (d[j] > 8) inked += 1; }
    results.push({ id: v.id, touched: touched, inked: inked });
    pending -= 1;
    if (!pending) document.getElementById('out').textContent = 'RESULT' + JSON.stringify(results) + 'END';
  };
  img.onerror = function () { results.push({ id: v.id, error: true }); pending -= 1; };
  img.src = v.src;
});
</script></body>`;
const file = join(mkdtempSync(join(tmpdir(), 'icons-')), 'check.html');
writeFileSync(file, html);
const out = execFileSync(process.env.CHROME, ['--no-sandbox', '--disable-gpu', '--virtual-time-budget=5000', '--dump-dom', `file://${file}`], { encoding: 'utf8' });
const m = /RESULT(.*?)END/s.exec(out);
if (!m) {
  console.error('no result from the browser');
  process.exit(2);
}
const results = JSON.parse(m[1].replace(/&quot;/g, '"'));
const bad = results.filter((r) => r.error || r.touched > 0 || r.inked === 0);
results.forEach((r) => console.log(`${r.error || r.touched > 0 || r.inked === 0 ? 'FAIL' : 'ok  '} ${r.id} edge-pixels=${r.touched} ink=${r.inked}`));
process.exit(bad.length ? 1 : 0);

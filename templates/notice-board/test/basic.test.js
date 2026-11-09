'use strict';

// Minimal smoke tests for this bundler-less template - no test runner is
// installed (Vitest et al. assume a bundler this template deliberately
// doesn't have), so these use only Node's built-in node:test/node:assert/
// node:vm. Run with `node --test`.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

test('index.html only references local files that actually exist', () => {
  const html = readFileSync(path.join(root, 'index.html'), 'utf-8');
  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((ref) => !/^https?:/.test(ref));

  assert.ok(refs.length > 0, 'expected index.html to reference at least one local file');
  for (const ref of refs) {
    assert.ok(existsSync(path.join(root, ref)), `referenced file not found: ${ref}`);
  }
});

test('dsplay-data.js defines dsplay_config/dsplay_media/dsplay_template as objects', () => {
  const code = readFileSync(path.join(root, 'scripts/dsplay-data.js'), 'utf-8');
  const sandbox = {};
  vm.createContext(sandbox);
  new vm.Script(code, { filename: 'dsplay-data.js' }).runInContext(sandbox);

  for (const name of ['dsplay_config', 'dsplay_media', 'dsplay_template']) {
    assert.equal(typeof sandbox[name], 'object', `${name} should be defined as an object`);
    assert.notEqual(sandbox[name], null, `${name} should not be null`);
  }
});

test('app.js has valid JavaScript syntax', () => {
  const code = readFileSync(path.join(root, 'scripts/app.js'), 'utf-8');
  assert.doesNotThrow(() => new vm.Script(code, { filename: 'app.js' }));
});

// The layout choice: run app.js against a tiny fake DOM and check which layout shows what.
function run(media, template) {
  const els = {};
  const element = (name) => ({ style: {}, children: [], _text: '', get textContent() { return this.children.length ? this.children.map((c) => c.textContent).join('') : this._text; }, set textContent(v) { this._text = v; this.children = []; }, appendChild(c) { this.children.push(c); }, className: name, offsetWidth: 600, clientWidth: 1000, scrollWidth: 0, clientHeight: 200, get scrollHeight() { return parseFloat(this.style.fontSize || 0) * 10; }, querySelector: (s) => make(name + ' ' + s) });
  const make = (name) => (els[name] = element(name));
  const document = {
    body: { style: {} },
    createElement: () => element('span'),
    querySelector: (s) => (s.indexOf('.layout.') === 0 ? make(s.slice(8)) : make(s)),
  };
  const sandbox = {
    document,
    window: { innerWidth: 1000, innerHeight: 500 },
    dsplayTemplateUtils: {
      media,
      tval: (k, d) => (template[k] !== undefined ? template[k] : d),
      tfval: (k, d) => (template[k] !== undefined ? parseFloat(template[k]) : d),
      tbval: (k, d) => (template[k] !== undefined ? template[k] === 'true' : d),
    },
  };
  vm.createContext(sandbox);
  new vm.Script(readFileSync(path.join(root, 'scripts/app.js'), 'utf-8')).runInContext(sandbox);
  return els;
}

const text = (blocks) => blocks.map((t) => (typeof t === 'string' ? { text: t } : t));

test('a card shows its title and draws its blocks in the card layout', () => {
  const els = run({ kind: 'card', title: 'Aviso', blocks: [{ text: 'Oi ' }, { text: 'você', bold: true, color: 'red' }] }, {});
  assert.equal(els.card.style.display, 'flex');
  assert.equal(els['card .title'].textContent, 'Aviso');
  assert.equal(els['card .text'].textContent, 'Oi você');
  assert.equal(els['card .text'].children[1].style.fontWeight, 'bold');
  assert.equal(els['card .text'].children[1].style.color, '#ff8a80');
  assert.equal(els.notice, undefined);
});

test('markup in a post is text, never elements; an unknown colour is ignored', () => {
  const els = run({ kind: 'card', title: '<img src=x>', blocks: [{ text: '<b>x</b>', color: 'url(javascript:1)' }, { nope: 1 }] }, {});
  assert.equal(els['card .title'].textContent, '<img src=x>');
  assert.equal(els['card .text'].children.length, 1);
  assert.equal(els['card .text'].children[0].textContent, '<b>x</b>');
  assert.equal(els['card .text'].children[0].style.color, undefined);
});

test('show_title false hides the title of a notice', () => {
  const els = run({ kind: 'notice', title: 'Aviso', blocks: text(['x']) }, { show_title: 'false' });
  assert.equal(els.notice.style.display, 'flex');
  assert.equal(els['notice .title'].style.display, 'none');
});

test('the ticker scrolls its line, never faster than the speed allows and never under 5 s', () => {
  const els = run({ kind: 'ticker', blocks: text(['a', '   •   ', 'b']) }, { ticker_speed: '100' });
  assert.equal(els['ticker .track'].textContent, 'a   •   b');
  assert.equal(els['ticker .track'].style.animationDuration, '16s');
});

test('the ticker crosses the whole line within the showing, faster than the speed when it must', () => {
  const cut = run({ kind: 'ticker', blocks: text(['a']), duration: 10000 }, { ticker_speed: '100' });
  assert.equal(cut['ticker .track'].style.animationDuration, '9.5s');
  const roomy = run({ kind: 'ticker', blocks: text(['a']), duration: 60000 }, { ticker_speed: '100' });
  assert.equal(roomy['ticker .track'].style.animationDuration, '16s');
});

test('an unknown kind falls back to the card layout', () => {
  const els = run({ kind: 'surprise', blocks: text(['x']) }, {});
  assert.equal(els.card.style.display, 'flex');
});

test('the text shrinks until it fits the region, and the ticker follows the region height', () => {
  const card = run({ kind: 'card', title: 'a', blocks: text(['b']) }, {});
  const size = parseFloat(card.card.style.fontSize);
  assert.ok(size <= 20 && size >= 10, 'fitted size ' + size);
  const ticker = run({ kind: 'ticker', blocks: text(['a']) }, {});
  assert.equal(ticker.ticker.style.fontSize, '60px', 'width caps the text: 6% of 1000 px is under 40% of 500 px');
});

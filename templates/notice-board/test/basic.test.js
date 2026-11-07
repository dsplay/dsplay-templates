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
  const make = (name) => (els[name] = { style: {}, innerHTML: '', className: name, offsetWidth: 600, querySelector: (s) => make(name + ' ' + s) });
  const document = {
    body: { style: {} },
    querySelector: (s) => (s.indexOf('.layout.') === 0 ? make(s.slice(8)) : make(s)),
  };
  const sandbox = {
    document,
    window: { innerWidth: 1000 },
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

test('a card shows its title and html in the card layout', () => {
  const els = run({ kind: 'card', title: 'Aviso', html: 'Oi <b>você</b>' }, {});
  assert.equal(els.card.style.display, 'flex');
  assert.equal(els['card .title'].innerHTML, 'Aviso');
  assert.equal(els['card .text'].innerHTML, 'Oi <b>você</b>');
  assert.equal(els.notice, undefined);
});

test('show_title false hides the title of a notice', () => {
  const els = run({ kind: 'notice', title: 'Aviso', html: 'x' }, { show_title: 'false' });
  assert.equal(els.notice.style.display, 'flex');
  assert.equal(els['notice .title'].style.display, 'none');
});

test('the ticker scrolls its line, never faster than the speed allows and never under 5 s', () => {
  const els = run({ kind: 'ticker', html: 'a &nbsp;&bull;&nbsp; b' }, { ticker_speed: '100' });
  assert.equal(els['ticker .track'].innerHTML, 'a &nbsp;&bull;&nbsp; b');
  assert.equal(els['ticker .track'].style.animationDuration, '16s');
});

test('an unknown kind falls back to the card layout', () => {
  const els = run({ kind: 'surprise', html: 'x' }, {});
  assert.equal(els.card.style.display, 'flex');
});

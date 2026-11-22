import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from '.';
import { lookOf } from '../../lib/post-look';

// The hooks read what the player hands over; the tests hand over a post and the template variables directly.
const state = vi.hoisted(() => ({ media: {}, template: {} }));
vi.mock('@dsplay/react-template-utils', () => ({
  useMedia: () => state.media,
  useTemplateVal: (key, fallback) => (state.template[key] !== undefined ? state.template[key] : fallback),
  useTemplateBoolVal: (key, fallback) => (state.template[key] !== undefined ? state.template[key] === 'true' : fallback),
  useTemplateFloatVal: (key, fallback) => (state.template[key] !== undefined ? Number.parseFloat(state.template[key]) : fallback),
}));

const text = (blocks) => blocks.map((block) => (typeof block === 'string' ? { text: block } : block));

function show(media, template = {}, { width = 1000, height = 500 } = {}) {
  state.media = media;
  state.template = template;
  window.innerWidth = width;
  window.innerHeight = height;
  const { container } = render(<App />);
  return container;
}

const pick = (container, selector) => container.querySelector(selector);
const px = (value) => `${value}px`;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('layouts', () => {
  it('a card shows its title and draws its blocks in the card layout', () => {
    const c = show({ kind: 'card', title: 'Aviso', blocks: [{ text: 'Oi ' }, { text: 'você', bold: true, color: 'red' }] });
    expect(pick(c, '.post.card')).toBeInTheDocument();
    expect(pick(c, '.post.long_post')).toBeNull();
    expect(pick(c, '.title')).toHaveTextContent('Aviso');
    expect(pick(c, '.text')).toHaveTextContent('Oi você');
    const [, second] = pick(c, '.text').children;
    expect(second.style.fontWeight).toBe('bold');
    expect(second).toHaveStyle({ color: '#ff8a80' });
  });

  it('a long post draws the long post layout, and show_title false hides its title', () => {
    const c = show({ kind: 'long_post', title: 'Aviso', blocks: text(['x']) }, { show_title: 'false' });
    expect(pick(c, '.post.long_post')).toBeInTheDocument();
    expect(pick(c, '.title')).toBeNull();
    cleanup();
    expect(pick(show({ kind: 'long_post', title: 'Aviso', blocks: text(['x']) }), '.title')).toHaveTextContent('Aviso');
  });

  it('an unknown kind, and the retired name notice, fall back to the card layout', () => {
    for (const kind of ['surprise', 'notice', undefined]) {
      const c = show({ kind, blocks: text(['x']) });
      expect(pick(c, '.post.card')).toBeInTheDocument();
      cleanup();
    }
  });
});

describe('text', () => {
  it('markup in a post is text, never elements; an unknown colour is ignored', () => {
    const c = show({ kind: 'card', title: '<img src=x>', blocks: [{ text: '<b>x</b>', color: 'url(javascript:1)' }, { nope: 1 }] });
    expect(pick(c, '.title')).toHaveTextContent('<img src=x>');
    expect(pick(c, '.title img')).toBeNull();
    expect(pick(c, '.text').children).toHaveLength(1);
    expect(pick(c, '.text').children[0]).toHaveTextContent('<b>x</b>');
    expect(pick(c, '.text').children[0].style.color).toBe('');
  });

  it('underline, a size and the wider palette are drawn on the run', () => {
    const c = show({
      kind: 'card',
      blocks: [{ text: 'a', underline: true }, { text: 'b', size: 'large', color: 'blue' }, { text: 'c', size: 'small' }, { text: 'd', size: 'huge', color: 'pink' }],
    });
    const [a, b, d, e] = pick(c, '.text').children;
    expect(a).toHaveStyle({ textDecoration: 'underline' });
    expect(b.style.fontSize).toBe('1.4em');
    expect(b).toHaveStyle({ color: '#93c5fd' });
    expect(d.style.fontSize).toBe('0.75em');
    expect(e.style.fontSize).toBe('');
    expect(e).toHaveStyle({ color: '#f9a8d4' });
  });

  it('the text takes the largest size the region allows, and shrinks to 10 px when it never fits', () => {
    const c = show({ kind: 'card', title: 'a', blocks: text(['b']) });
    expect(pick(c, '.post').style.fontSize).toBe('80px');
    cleanup();
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(10_000);
    expect(pick(show({ kind: 'card', blocks: text(['b']) }), '.post').style.fontSize).toBe('10px');
  });

  it('the alignment of a post sets the text and the flex alignment of the body, and none leaves the layout default', () => {
    const left = show({ kind: 'card', blocks: text(['a']), align: 'left' });
    expect(pick(left, '.body')).toHaveStyle({ textAlign: 'left', alignItems: 'flex-start' });
    cleanup();
    expect(pick(show({ kind: 'long_post', blocks: text(['a']), align: 'right' }), '.body')).toHaveStyle({ alignItems: 'flex-end' });
    cleanup();
    expect(pick(show({ kind: 'card', blocks: text(['a']), align: 'justify' }), '.body').style.textAlign).toBe('');
  });
});

describe('room for the art of a design', () => {
  it('a design keeps the text clear of its art on the sides it takes, a plain post only has the base margin', () => {
    const themed = pick(show({ kind: 'long_post', blocks: text(['x']), theme: 'maintenance' }), '.post');
    expect(themed.style.padding).toBe(`${px(50)} ${px(150)} ${px(50)} ${px(30)}`);
    cleanup();
    expect(pick(show({ kind: 'long_post', blocks: text(['x']) }), '.post').style.padding).toBe(px(20));
    cleanup();
    expect(pick(show({ kind: 'card', blocks: text(['x']) }), '.post').style.padding).toBe(px(30));
  });

  it('a narrow tall region starts the text larger than 8% of its width', () => {
    const c = show({ kind: 'card', blocks: text(['x']) }, {}, { width: 292, height: 1080 });
    expect(pick(c, '.post').style.fontSize).toBe('40px');
  });
});

describe('colours and designs', () => {
  it('a post brings its own background, and the white one switches to dark text and darker colours', () => {
    const plain = show({ kind: 'card', blocks: [{ text: 'a', color: 'red' }] });
    expect(pick(plain, '.app')).toHaveStyle({ backgroundColor: '#0b3b4a', color: '#ffffff' });
    cleanup();

    const navy = show({ kind: 'card', blocks: text(['a']), background: 'navy' });
    expect(pick(navy, '.app')).toHaveStyle({ backgroundColor: '#12284c', color: '#ffffff' });
    cleanup();

    // the text follows the template's own background too: a light one gets dark text and the darker colours
    const light = show({ kind: 'card', blocks: [{ text: 'a', color: 'red' }] }, { background_color: '#fde68a' });
    expect(pick(light, '.app')).toHaveStyle({ backgroundColor: '#fde68a', color: '#111827' });
    expect(pick(light, '.text').children[0]).toHaveStyle({ color: '#b91c1c' });
    cleanup();

    const white = show({ kind: 'card', blocks: [{ text: 'a', color: 'red' }], background: 'white' });
    expect(pick(white, '.app')).toHaveStyle({ backgroundColor: '#ffffff', color: '#111827' });
    expect(pick(white, '.text').children[0]).toHaveStyle({ color: '#b91c1c' });
    cleanup();

    expect(pick(show({ kind: 'card', blocks: text(['a']), background: 'pink' }), '.app')).toHaveStyle({ backgroundColor: '#0b3b4a' });
  });

  it('a design paints an SVG at the size of the region with light text; an unknown design is ignored', () => {
    const c = show({ kind: 'card', blocks: text(['a']), theme: 'birthday' });
    expect(pick(c, '.app')).toHaveStyle({ color: '#ffffff', backgroundColor: '#6d28d9' });
    // jsdom drops a data url from the style, so the url itself is checked where it is made
    const { style } = lookOf({ theme: 'birthday' }, '#000', 1000, 500);
    expect(style.backgroundImage).toMatch(/^url\("data:image\/svg\+xml;utf8,%3Csvg/);
    const payload = style.backgroundImage.slice('url("data:image/svg+xml;utf8,'.length, -2);
    expect(payload).not.toMatch(/[()']/);
    expect(style.backgroundSize).toBe('100% 100%');
    cleanup();
    expect(pick(show({ kind: 'card', blocks: text(['a']), theme: 'nope' }), '.app').style.backgroundImage).toBe('');
  });
});

describe('pictures', () => {
  const url = 'https://s3-us-west-2.amazonaws.com/b/uploads/notice-1-a.jpg';

  it('a picture goes on top of a tall region and on the left of a wide one', () => {
    const tall = show({ kind: 'card', blocks: text(['x']), image: url }, {}, { width: 500, height: 1000 });
    expect(pick(tall, '.pic img')).toHaveAttribute('src', url);
    expect(pick(tall, '.post')).toHaveStyle({ flexDirection: 'column' });
    expect(pick(tall, '.pic').style.height).toBe(px(Math.round((1000 - 2 * 30) * 0.46)));
    cleanup();
    const wide = show({ kind: 'card', blocks: text(['x']), image: url });
    expect(pick(wide, '.post')).toHaveStyle({ flexDirection: 'row' });
    expect(pick(wide, '.pic').style.width).toBe(px(Math.round((1000 - 2 * 30) * 0.34)));
  });

  it('no picture, or a url that is not safe, draws none', () => {
    for (const image of ['', 'javascript:alert(1)', 'file:///etc/passwd', 'data:text/html;base64,AAAA', 42, null]) {
      const c = show({ kind: 'long_post', blocks: text(['x']), image });
      expect(pick(c, '.pic'), String(image)).toBeNull();
      cleanup();
    }
  });

  it('a picture that fails to load gives its room back to the text', () => {
    const c = show({ kind: 'long_post', blocks: text(['x']), image: url });
    fireEvent.error(pick(c, '.pic img'));
    expect(pick(c, '.pic')).toBeNull();
    expect(pick(c, '.post')).toHaveStyle({ flexDirection: 'column' });
  });

  it('a backdrop fills the region instead of the picture beside the text, and one that cannot load is taken away', () => {
    const c = show({ kind: 'card', blocks: text(['x']), image: url, imageMode: 'backdrop' });
    expect(pick(c, '.backdrop')).toBeInTheDocument();
    expect(pick(c, '.pic')).toBeNull();
    fireEvent.error(pick(c, '.backdrop .whole'));
    expect(pick(c, '.backdrop')).toBeNull();
  });

  it('a backdrop is cropped to fill only when its shape is close to the region', () => {
    const c = show({ kind: 'card', blocks: text(['x']), image: url, imageMode: 'backdrop' });
    const whole = pick(c, '.backdrop .whole');
    Object.defineProperty(whole, 'naturalWidth', { value: 1000, configurable: true });
    Object.defineProperty(whole, 'naturalHeight', { value: 480, configurable: true });
    fireEvent.load(whole);
    expect(whole.style.objectFit).toBe('cover');
    Object.defineProperty(whole, 'naturalHeight', { value: 2000, configurable: true });
    fireEvent.load(whole);
    expect(whole.style.objectFit).toBe('contain');
  });
});

describe('ticker', () => {
  const track = (container) => pick(container, '.ticker .track');

  it('scrolls its line, never faster than the speed allows and never under 5 s', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);
    const c = show({ kind: 'ticker', blocks: text(['a', '   •   ', 'b']) }, { ticker_speed: '100' });
    expect(track(c)).toHaveTextContent('a • b');
    expect(track(c)).toHaveClass('run');
    expect(track(c).style.animationDuration).toBe('16s');
    cleanup();
    const fast = show({ kind: 'ticker', blocks: text(['a']) }, { ticker_speed: '100000' });
    expect(track(fast).style.animationDuration).toBe('5s');
  });

  it('crosses the whole line within the showing, faster than the speed when it must', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);
    expect(track(show({ kind: 'ticker', blocks: text(['a']), duration: 10_000 }, { ticker_speed: '100' })).style.animationDuration).toBe('9.5s');
    cleanup();
    expect(track(show({ kind: 'ticker', blocks: text(['a']), duration: 60_000 }, { ticker_speed: '100' })).style.animationDuration).toBe('16s');
  });

  it('is one line: a line break in the text becomes a space', () => {
    expect(track(show({ kind: 'ticker', blocks: text(['a\nb', 'c \n d']) }))).toHaveTextContent('a bc d');
  });

  it('follows the region height, capped by 6% of its width', () => {
    const c = show({ kind: 'ticker', blocks: text(['a']) });
    expect(pick(c, '.ticker').style.fontSize).toBe('60px');
    cleanup();
    expect(pick(show({ kind: 'ticker', blocks: text(['a']) }, {}, { width: 1920, height: 100 }), '.ticker').style.fontSize).toBe('40px');
  });
});

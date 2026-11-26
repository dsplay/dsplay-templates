import {
  describe, it, expect, vi,
} from 'vitest';
import { feedStories, nextImages } from './feed';

const item = (n, extra) => ({
  title: `T${n}`, description: `Descrição ${n} com texto suficiente para passar da limpeza.`, link: `https://x/${n}`, categories: [`C${n}`], images: [{ url: `i${n}.jpg` }], ...extra,
});
const media = (count, iteration) => ({
  iteration,
  title: 'Feed',
  result: { data: { title: 'Feed', items: Array.from({ length: count }, (_, i) => item(i + 1)) } },
});

describe('feedStories', () => {
  it('N1, N2, N3 are consecutive items, rotating with the iteration', () => {
    expect(feedStories(media(8, 0)).map((s) => s.headline)).toEqual(['T1', 'T2', 'T3']);
    expect(feedStories(media(8, 3)).map((s) => s.headline)).toEqual(['T4', 'T5', 'T6']);
    expect(feedStories(media(8, 7)).map((s) => s.headline)).toEqual(['T8', 'T1', 'T2']);
  });

  it('every item is the lead once per cycle', () => {
    const leads = [0, 1, 2, 3, 4].map((i) => feedStories(media(5, i))[0].headline);
    expect(leads).toEqual(['T1', 'T2', 'T3', 'T4', 'T5']);
  });

  it('1 or 2 items never repeat', () => {
    expect(feedStories(media(1, 5))).toHaveLength(1);
    expect(feedStories(media(2, 1)).map((s) => s.headline)).toEqual(['T2', 'T1']);
  });

  it('flat keys of the Android player give one story; nothing gives none', () => {
    const flat = feedStories({ itemTitle: 'Plano', itemDescription: 'Desc', title: 'Feed' });
    expect(flat).toHaveLength(1);
    expect(flat[0].headline).toBe('Plano');
    expect(feedStories({})).toEqual([]);
  });

  it('keeps the kicker, link and image of each story', () => {
    const [lead] = feedStories(media(3, 0));
    expect(lead).toMatchObject({ kicker: 'C1', link: 'https://x/1', image: 'i1.jpg' });
    expect(lead.description).toMatch(/^Descrição 1/);
  });

  it('hides a category that is only the feed name, ignoring case and accents (g1 x G1)', () => {
    const m = media(3, 0);
    m.title = 'g1';
    m.result.data.title = 'g1';
    m.result.data.items.forEach((it) => { it.categories = ['G1']; });
    expect(feedStories(m).map((s) => s.kicker)).toEqual(['', '', '']);
  });

  it('hides a category that is the same in every item', () => {
    const m = media(3, 0);
    m.result.data.items.forEach((it) => { it.categories = ['Brasil']; });
    expect(feedStories(m).map((s) => s.kicker)).toEqual(['', '', '']);
  });

  it('a link over 180 characters hides the QR of the lead only; only the lead warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const long = `https://x/${'a'.repeat(190)}`;
    const m = media(3, 0);
    m.result.data.items[0].link = long;
    m.result.data.items[2].link = long;
    const stories = feedStories(m);
    expect(stories[0].link).toBe('');
    expect(stories[1].link).toBe('https://x/2');
    expect(stories[2].link).toBe('');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatch(/^\[rss-feed\]/);
    warn.mockRestore();
  });

  it('warms the images of the next showing', () => {
    expect(nextImages(media(8, 0))).toEqual(['i2.jpg', 'i3.jpg', 'i4.jpg']);
  });
});

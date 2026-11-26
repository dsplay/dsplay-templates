import { describe, it, expect } from 'vitest';
import { newsFrom, currentNews, cardNews } from './news';

const config = { appVersion: 40100, platform: 'ANDROID' };
const items = [1, 2, 3, 4].map((n) => ({
  title: `Manchete ${n}`,
  description: `Descrição ${n} &amp; mais`,
  link: `https://x/${n}`,
  categories: [`Cat ${n}`],
  images: [{ url: `img-${n}.jpg` }],
}));
const media = { title: 'Feed', iteration: 0, result: { data: { title: 'Feed', items } } };

describe('newsFrom', () => {
  it('plain text, category as kicker', () => {
    const n = newsFrom({
      itemTitle: 'T &amp; U', itemDescription: 'D', categories: ['Esporte'], link: 'l', hasImage: true, imageUrl: 'i.jpg',
    }, config);
    expect(n).toEqual({
      headline: 'T & U', description: 'D', kicker: 'Esporte', link: 'l', source: '', image: 'i.jpg',
    });
  });
  it('uses the media title when the item has no title; no kicker equal to the headline', () => {
    const n = newsFrom({ title: 'Só título' }, config);
    expect(n.headline).toBe('Só título');
    expect(n.kicker).toBe('');
  });
  it('hasImage false drops the image', () => {
    expect(newsFrom({ itemTitle: 'a', hasImage: false, imageUrl: 'x' }, config).image).toBe('');
  });
  it('keeps the UOLIndoor swap for old apps without platform', () => {
    const flat = { itemTitle: 'Celebridades', itemDescription: 'A manchete', source: 'UOLIndoor' };
    const old = newsFrom(flat, { appVersion: 40000 });
    expect(old.headline).toBe('A manchete');
    expect(old.kicker).toBe('Celebridades');
    expect(newsFrom(flat, config).headline).toBe('Celebridades');
  });
});

describe('currentNews / cardNews', () => {
  it('takes the item of the iteration from the gateway body', () => {
    expect(currentNews({ ...media, iteration: 2 }, config).headline).toBe('Manchete 3');
  });
  it('flat keys win over the gateway body', () => {
    expect(currentNews({ ...media, itemTitle: 'Plano' }, config).headline).toBe('Plano');
  });
  it('cards: the current and the next ones, circular, never repeating', () => {
    const list = cardNews({ ...media, iteration: 3 }, config, 3);
    expect(list.map((n) => n.headline)).toEqual(['Manchete 4', 'Manchete 1', 'Manchete 2']);
  });
  it('cards: fewer items than cards shows what exists; one item or no body gives nothing', () => {
    const two = { ...media, result: { data: { items: items.slice(0, 2) } } };
    expect(cardNews(two, config, 3)).toHaveLength(2);
    expect(cardNews({ ...media, result: { data: { items: items.slice(0, 1) } } }, config, 3)).toEqual([]);
    expect(cardNews({ itemTitle: 'x' }, config, 3)).toEqual([]);
  });
});

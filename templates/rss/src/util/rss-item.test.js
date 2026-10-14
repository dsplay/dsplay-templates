import { describe, it, expect } from 'vitest';
import rssItemOf, { hasFlatItem, itemsOf, pickItem, flatKeysOf } from './rss-item';

const items = [
  {
    title: 'First', description: 'First text', content: 'First body', link: 'https://a.example/1', categories: ['news'],
    images: [{ url: 'https://a.example/1.jpg', title: 'Photo 1' }, { url: 'https://a.example/1b.jpg', title: null }],
  },
  {
    title: 'Second', description: null, content: null, link: null, categories: [], images: [],
  },
  {
    title: 'Third', description: 'Third text', content: 'Third body', link: 'https://a.example/3', categories: [], images: [{ url: 'https://a.example/3.jpg', title: null }],
  },
];
const result = { data: { title: 'Feed title', link: 'https://a.example', items } };

describe('hasFlatItem', () => {
  it('is true when the player sent the item title or description', () => {
    expect(hasFlatItem({ itemTitle: 'x' })).toBe(true);
    expect(hasFlatItem({ itemDescription: 'x' })).toBe(true);
    expect(hasFlatItem({ itemTitle: '' })).toBe(true);
  });

  it('is false without them', () => {
    expect(hasFlatItem({})).toBe(false);
    expect(hasFlatItem({ itemTitle: null })).toBe(false);
  });
});

describe('itemsOf', () => {
  it('reads the items of the gateway body', () => {
    expect(itemsOf({ result })).toBe(items);
  });

  it('is empty when there is no body, no data or no list', () => {
    expect(itemsOf({})).toEqual([]);
    expect(itemsOf({ result: {} })).toEqual([]);
    expect(itemsOf({ result: { data: { items: 'x' } } })).toEqual([]);
  });
});

describe('pickItem', () => {
  it('takes the next item at every showing and starts over after the last', () => {
    expect([0, 1, 2, 3, 4].map((i) => pickItem(items, i).title)).toEqual(['First', 'Second', 'Third', 'First', 'Second']);
  });

  it('copes with a missing, string or negative iteration', () => {
    expect(pickItem(items, undefined).title).toBe('First');
    expect(pickItem(items, '4').title).toBe('Second');
    expect(pickItem(items, -1).title).toBe('Second');
  });

  it('is null without items', () => {
    expect(pickItem([], 3)).toBeNull();
  });
});

describe('flatKeysOf', () => {
  it('builds the keys the Android player sets', () => {
    expect(flatKeysOf(items[0], result.data)).toEqual({
      itemTitle: 'First',
      itemDescription: 'First text',
      itemContent: 'First body',
      categories: ['news'],
      link: 'https://a.example/1',
      hasImage: true,
      imageUrl: 'https://a.example/1.jpg',
      imageTitle: 'Photo 1',
      title: 'Feed title',
    });
  });

  it('has no image and no link when the item has none', () => {
    const flat = flatKeysOf(items[1], result.data);
    expect(flat).toMatchObject({ itemTitle: 'Second', itemDescription: '', itemContent: '', hasImage: false });
    expect(flat.imageUrl).toBeUndefined();
    expect(flat.link).toBeUndefined();
  });
});

describe('rssItemOf', () => {
  it('leaves the media alone when the player sent the flat keys', () => {
    const media = { itemTitle: 'From the player', result };
    expect(rssItemOf(media)).toBe(media);
  });

  it('fills the flat keys from the picked item, keeping the media own title', () => {
    const media = { iteration: 2, title: 'Breaking News', result };
    expect(rssItemOf(media)).toMatchObject({
      title: 'Breaking News', itemTitle: 'Third', itemDescription: 'Third text', hasImage: true, imageUrl: 'https://a.example/3.jpg',
    });
  });

  it('uses the feed title when the media has none', () => {
    expect(rssItemOf({ iteration: 0, result }).title).toBe('Feed title');
  });

  it('returns the media as it is without flat keys and without items', () => {
    const media = { iteration: 1 };
    expect(rssItemOf(media)).toBe(media);
  });
});

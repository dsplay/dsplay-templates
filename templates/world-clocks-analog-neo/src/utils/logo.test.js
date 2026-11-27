import { describe, it, expect } from 'vitest';
import { cleanUrl, candidatesOf } from './logo';

describe('cleanUrl', () => {
  it('accepts plain http(s) links, trimmed', () => {
    expect(cleanUrl('  https://example.com/a.png ')).toBe('https://example.com/a.png');
    expect(cleanUrl('HTTP://example.com/a.svg')).toBe('HTTP://example.com/a.svg');
  });
  it('rejects everything else', () => {
    ['javascript:alert(1)', 'data:image/png;base64,AAAA', 'blob:x', 'file:///a.png', '/a.png', 'a.png', '//example.com/a.png',
      'https://user:pass@example.com/a.png', 'https://exa mple.com', '', null, undefined,
      `https://example.com/${'a'.repeat(2048)}`].forEach((bad) => expect(cleanUrl(bad)).toBe(''));
  });
});

describe('candidatesOf', () => {
  it('upload first, then the link; invalid links are empty', () => {
    expect(candidatesOf('/up.png', 'https://x.com/a.png')).toEqual(['/up.png', 'https://x.com/a.png']);
    expect(candidatesOf('', 'https://x.com/a.png')).toEqual(['https://x.com/a.png']);
    expect(candidatesOf('/up.png', 'javascript:1')).toEqual(['/up.png']);
    expect(candidatesOf('', '')).toEqual([]);
    expect(candidatesOf('https://x.com/a.png', 'https://x.com/a.png')).toEqual(['https://x.com/a.png']);
  });
});

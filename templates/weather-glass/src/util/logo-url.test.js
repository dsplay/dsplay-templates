import { describe, it, expect } from 'vitest';
import { validLogoUrl, logoSources } from './logo-url';

describe('validLogoUrl', () => {
  it('accepts http and https, trimmed, any case', () => {
    expect(validLogoUrl('  https://x.com/logo.png ')).toBe('https://x.com/logo.png');
    expect(validLogoUrl('HTTP://x.com/a.svg')).toBe('HTTP://x.com/a.svg');
  });
  it('rejects other schemes, relative, protocol-relative and credentials', () => {
    ['javascript:alert(1)', 'data:image/png;base64,AAAA', 'file:///etc/passwd', 'blob:https://x/1', '/logo.png', 'logo.png', '//x.com/a.png', 'https://user:pass@x.com/a.png', 'https://user@x.com/a.png', '']
      .forEach((bad) => expect(validLogoUrl(bad)).toBe(''));
    expect(validLogoUrl(undefined)).toBe('');
  });
  it('rejects links longer than 2048 characters', () => {
    expect(validLogoUrl(`https://x.com/${'a'.repeat(2048)}`)).toBe('');
  });
});

describe('logoSources', () => {
  it('upload first, then the link; invalid link dropped', () => {
    expect(logoSources('up.png', 'https://x.com/a.png')).toEqual(['up.png', 'https://x.com/a.png']);
    expect(logoSources('', 'https://x.com/a.png')).toEqual(['https://x.com/a.png']);
    expect(logoSources('up.png', 'javascript:1')).toEqual(['up.png']);
    expect(logoSources('', '')).toEqual([]);
  });
});

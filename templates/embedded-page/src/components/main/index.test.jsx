import { describe, it, expect } from 'vitest';
import { embeddedUrl } from '.';

describe('embeddedUrl', () => {
  it('reads the signed address from the gateway answer', () => {
    expect(embeddedUrl({ data: { url: 'https://metabase.example.com/embed/dashboard/abc#bordered=false' } }))
      .toBe('https://metabase.example.com/embed/dashboard/abc#bordered=false');
    expect(embeddedUrl({ data: { url: 'http://192.168.1.10:3000/embed/dashboard/abc' } }))
      .toBe('http://192.168.1.10:3000/embed/dashboard/abc');
  });

  it('draws nothing for a missing or unusable address', () => {
    expect(embeddedUrl(undefined)).toBeNull();
    expect(embeddedUrl({})).toBeNull();
    expect(embeddedUrl({ data: {} })).toBeNull();
    expect(embeddedUrl({ data: { url: 'javascript:alert(1)' } })).toBeNull();
    expect(embeddedUrl({ data: { url: 42 } })).toBeNull();
  });
});

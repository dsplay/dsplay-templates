import { describe, it, expect } from 'vitest';
import plainText from './text';

describe('plainText', () => {
  it('decodes entities and strips tags', () => {
    expect(plainText('a &amp; b &#36; &#x41; &eacute;&nbsp;x')).toBe('a & b $ A é x');
    expect(plainText('<b>bold</b> <script>x</script>')).toBe('bold x');
  });
  it('handles missing values and unknown entities', () => {
    expect(plainText(undefined)).toBe('');
    expect(plainText('&nope;')).toBe('&nope;');
  });
});

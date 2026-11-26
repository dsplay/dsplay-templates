// Public image links for the company logo (contract of the logos, section 3). Only http(s), no credentials, no relative or
// protocol-relative URLs, at most 2048 characters. Anything else is treated as empty.

export const MAX_URL_LENGTH = 2048;
export const LOAD_TIMEOUT_MS = 8000;

/** The trimmed URL when it is acceptable, else ''. */
export function validLogoUrl(value) {
  if (typeof value !== 'string') {
    return '';
  }
  const url = value.trim();
  if (!url || url.length > MAX_URL_LENGTH || url.indexOf('//') === 0) {
    return '';
  }
  if (!/^https?:\/\//i.test(url) || /^https?:\/\/[^/?#]*@/i.test(url)) {
    return '';
  }
  return url;
}

/** Logo candidates in order: the upload wins, then the link. */
export function logoSources(upload, url) {
  const link = validLogoUrl(url);
  const file = typeof upload === 'string' ? upload.trim() : '';
  return [file, link].filter((src, index, list) => src && list.indexOf(src) === index);
}

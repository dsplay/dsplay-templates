// Logos come from an upload (CMS) or from a public link (contrato-logos.md, M-014 v2 section 6.1).

export const MAX_URL = 2048;
export const LOAD_TIMEOUT = 8000;

/** The public link when it is a plain http(s) URL (no credentials, no "//host", <= 2048 chars); '' for anything else. */
export function cleanUrl(value) {
  const url = String(value == null ? '' : value).trim();
  if (!url || url.length > MAX_URL || !/^https?:\/\/[^\s]+$/i.test(url)) {
    return '';
  }
  const host = url.replace(/^https?:\/\//i, '').split(/[/?#]/)[0];
  return host.indexOf('@') >= 0 ? '' : url;
}

/** Sources to try, in order: the upload wins, the link is the fallback. */
export function candidatesOf(upload, url) {
  const first = String(upload == null ? '' : upload).trim();
  const list = [first, cleanUrl(url)].filter(Boolean);
  return list.filter((src, i) => list.indexOf(src) === i);
}

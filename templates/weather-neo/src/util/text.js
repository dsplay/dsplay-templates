// Feed text arrives with HTML entities ("&#36;", "&amp;"). We always render it as plain text.

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', ndash: '–', mdash: '—',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', laquo: '«', raquo: '»', copy: '©', reg: '®',
  aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', agrave: 'à', acirc: 'â', ecirc: 'ê',
  ocirc: 'ô', atilde: 'ã', otilde: 'õ', ccedil: 'ç', ntilde: 'ñ', uuml: 'ü', ouml: 'ö', auml: 'ä',
  Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', Ccedil: 'Ç', Atilde: 'Ã', Otilde: 'Õ',
};

function fromCodePoint(code) {
  if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff) {
    return '';
  }
  if (code <= 0xffff) {
    return String.fromCharCode(code);
  }
  const offset = code - 0x10000;
  return String.fromCharCode(0xd800 + (offset >> 10), 0xdc00 + (offset & 0x3ff));
}

/** Entities and tags to plain text. Never returns markup. */
export default function plainText(value) {
  if (value == null) {
    return '';
  }
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (whole, name) => (NAMED[name] !== undefined ? NAMED[name] : whole))
    .replace(/\s+/g, ' ')
    .trim();
}

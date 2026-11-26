// Cleaning of a feed description for the card (spec M-001 v2, section 7.1). Input is already plain text.

const MAX_LENGTH = 280;
const MIN_SENTENCE = 60;
const MIN_REMAINDER = 30;

// "Foto: ...", "Imagem ...", "Crédito: ...", "Reprodução/...", "Divulgação ..." up to the first '.', ')' or '/'
const CAPTION = /^(?:foto|imagem|cr[eé]dito|reprodu[cç][aã]o|divulga[cç][aã]o)\b[^./)]*[./)]\s*/i;

/** Lowercase, no accents or punctuation, single spaces: to compare a description with the headline. */
export function normalize(text) {
  let value = String(text || '').toLowerCase();
  if (typeof value.normalize === 'function') {
    value = value.normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  return value.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Cuts at the end of a sentence (at least 60 chars) or, failing that, at a word with an ellipsis; about 280 chars. */
export function truncate(text) {
  if (text.length <= MAX_LENGTH) {
    return text;
  }
  const head = text.slice(0, MAX_LENGTH);
  let sentenceEnd = -1;
  const ends = /[.!?](?=\s|$)/g;
  let match = ends.exec(head);
  while (match) {
    sentenceEnd = match.index;
    match = ends.exec(head);
  }
  if (sentenceEnd + 1 >= MIN_SENTENCE) {
    return head.slice(0, sentenceEnd + 1);
  }
  const space = head.lastIndexOf(' ');
  return `${(space > 0 ? head.slice(0, space) : head).replace(/[\s,;:.-]+$/, '')}…`;
}

/**
 * The description to show, or '' to treat the item as having none: caption/credit prefix removed, dropped when it repeats
 * the headline (or starts with it and almost nothing is left), truncated.
 */
export default function cleanDescription(description, headline) {
  const text = String(description || '').replace(CAPTION, '').trim();
  if (!text) {
    return '';
  }
  const a = normalize(text);
  const h = normalize(headline);
  if (h && a === h) {
    return '';
  }
  if (h && a.indexOf(h) === 0 && a.length - h.length < MIN_REMAINDER) {
    return '';
  }
  return truncate(text);
}

// Extra cleaning of the description for the feed (spec M-001b 3.1, rules 2 and 3): what real feeds (G1) glue to it.
import { normalize } from './description';

const MIN_REMAINDER = 40;
const MAX_CREDIT_AT = 120;

const WORD = "[A-Za-zÀ-ÿ0-9.'-]+";
// "Name/Vehicle": up to 4 words, a slash, then a known vehicle word(s) or one word ("Aline Nascimento/g1", "Divulgação/TV Rio Sul")
const VEHICLE = `(?:g1|Divulga[cç][aã]o|Reprodu[cç][aã]o|Reuters|AFP|Globo(?:play)?|TV ${WORD}(?: ${WORD})?|${WORD})`;
const CREDIT = new RegExp(`(?:Google Maps|Galerias Relacionadas|(?:${WORD} ){0,3}${WORD}\\/ ?${VEHICLE})\\s+`);
const LEADING_CREDIT = /^(?:Divulga[cç][aã]o|Reprodu[cç][aã]o|Galerias Relacionadas)(?:\/ ?\S+(?: \S+)?)?\s+/i;

const words = (text) => normalize(text).split(' ').filter(Boolean);

/** Removes the headline repeated at the start of the description (any punctuation between). */
function withoutHeadline(text, headline) {
  const h = words(headline);
  const t = words(text);
  if (h.length > 2 && t.length >= h.length && h.every((w, i) => t[i] === w)) {
    // cut the same number of words from the original text
    const parts = text.split(/\s+/);
    return parts.slice(h.length).join(' ').replace(/^[\s.,;:!?–—-]+/, '');
  }
  return text;
}

/**
 * What is left of a title cut at the start (spec M-001b 3.1, rule 5): 1 to 4 initial words that also appear in the headline are
 * removed; if what remains starts in lowercase, everything up to the first capitalized word (start of a sentence) goes too.
 */
function withoutLeftover(text, headline) {
  const title = words(headline);
  const parts = text.split(/\s+/);
  let n = 0;
  while (n < 4 && n < parts.length && title.indexOf(normalize(parts[n])) !== -1 && normalize(parts[n])) {
    n += 1;
  }
  if (n === 0 || n === parts.length) {
    return text;
  }
  // only a short fragment glued to the next sentence (a capital right after it) is a leftover; a normal sentence keeps its words
  const rest = parts.slice(n);
  if (/^[A-ZÀ-Ý0-9"“]/.test(rest[0])) {
    return rest.join(' ');
  }
  const start = rest.findIndex((w) => /^[A-ZÀ-Ý"“]/.test(w));
  // a long run before the first capital is a normal sentence that happens to start with a word of the headline: keep it
  return start === -1 || start > 8 ? text : rest.slice(start).join(' ');
}

/**
 * The description to show, or '' (treated as "no description"): credit/legend at the start removed (only at the start),
 * the headline repeated at the start removed, dropped when it is mostly the headline or too short afterwards.
 * @param {string} description plain text, already cleaned by `description.js`
 * @param {string} headline
 */
export default function tidyDescription(description, headline) {
  let text = String(description || '').trim();
  if (!text) {
    return '';
  }
  text = withoutHeadline(text, headline);
  // "<legend> <credit> <text>": the credit marks where the real text starts
  const match = CREDIT.exec(text);
  // the legend before a credit is a fragment; a full sentence before it means the credit is not at the start
  if (match && match.index <= MAX_CREDIT_AT && !/[.!?]\s/.test(text.slice(0, match.index))) {
    text = text.slice(match.index + match[0].length);
  }
  text = text.replace(LEADING_CREDIT, '').trim();

  text = withoutLeftover(text, headline);

  const mine = words(text);
  const title = words(headline);
  if (text.length < MIN_REMAINDER || mine.length === 0) {
    return '';
  }
  const inTitle = mine.filter((w) => title.indexOf(w) !== -1).length;
  if (inTitle / mine.length >= 0.6) {
    return '';
  }
  return text;
}

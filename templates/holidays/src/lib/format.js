// The words that count the days, picked in one place so every style says the same thing.

/** "today", "tomorrow", "in 1 day" is never said (that is "tomorrow"), "in N days". Takes the translate function. */
export function whenText(t, away) {
  if (away <= 0) return t('today');
  if (away === 1) return t('tomorrow');
  return t('in {{count}} days', { count: away });
}

/** The scope of a holiday as a label. */
export const scopeText = (t, scope) => t(scope === 'city' ? 'City' : scope === 'state' ? 'State' : 'National');

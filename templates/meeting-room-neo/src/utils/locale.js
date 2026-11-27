// "pt_br" / "pt-BR" -> { language: 'pt', region: 'br', key: 'pt_br' }. Missing locale means English (US).
export function parseLocale(locale) {
  const [language = 'en', region = ''] = String(locale || 'en_us').toLowerCase().split(/[_-]/);
  return { language, region, key: region ? `${language}_${region}` : language };
}

// 12 h only for en_us; everything else is 24 h (spec M-020, section 3).
export function defaultTimeFormat(locale) {
  return parseLocale(locale).key === 'en_us' ? '12h' : '24h';
}

export function resolveTimeFormat(value, locale) {
  const normalized = String(value || '').toLowerCase();
  return normalized === '12h' || normalized === '24h' ? normalized : defaultTimeFormat(locale);
}

// "Jul 11, 2023" order only for en_us; every other locale is "11 jul 2023".
export function isMonthFirst(locale) {
  return parseLocale(locale).key === 'en_us';
}

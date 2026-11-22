// The flag of a currency, for the currencies of countries (and the euro, the flag of the European Union). Pure functions, tested in flags.test.js.
//
// The flags are the square 1x1 SVGs of the `flag-icons` package (MIT, see src/assets/flags/LICENSE-flag-icons.txt), copied here like the fonts: only the ones
// used below, 154 flags for 157 currencies. A badge crops them to a circle. A currency with no flag of its own stays with its code: the CFA francs (XOF, XAF),
// the East Caribbean dollar (XCD), the CFP franc (XPF), the Caribbean guilder (XCG), the metals (XAU, XAG, XPD, XPT), the IMF's SDR (XDR), the cryptos,
// and the currencies that no longer exist.

/** ISO 4217 code -> file of `src/assets/flags` (without `.svg`). */
export const FLAG_OF = {
  AED: 'ae', AFN: 'af', ALL: 'al', AMD: 'am', AOA: 'ao', ARS: 'ar', AUD: 'au', AWG: 'aw',
  AZN: 'az', BAM: 'ba', BBD: 'bb', BDT: 'bd', BGN: 'bg', BHD: 'bh', BIF: 'bi', BMD: 'bm',
  BND: 'bn', BOB: 'bo', BRL: 'br', BSD: 'bs', BTN: 'bt', BWP: 'bw', BYN: 'by', BZD: 'bz',
  CAD: 'ca', CDF: 'cd', CHF: 'ch', CLP: 'cl', CNH: 'cn', CNY: 'cn', COP: 'co', CRC: 'cr',
  CUP: 'cu', CVE: 'cv', CZK: 'cz', DJF: 'dj', DKK: 'dk', DOP: 'do', DZD: 'dz', EGP: 'eg',
  ERN: 'er', ETB: 'et', EUR: 'eu', FJD: 'fj', FKP: 'fk', GBP: 'gb', GEL: 'ge', GGP: 'gg',
  GHS: 'gh', GIP: 'gi', GMD: 'gm', GNF: 'gn', GTQ: 'gt', GYD: 'gy', HKD: 'hk', HNL: 'hn',
  HTG: 'ht', HUF: 'hu', IDR: 'id', ILS: 'il', IMP: 'im', INR: 'in', IQD: 'iq', IRR: 'ir',
  ISK: 'is', JEP: 'je', JMD: 'jm', JOD: 'jo', JPY: 'jp', KES: 'ke', KGS: 'kg', KHR: 'kh',
  KMF: 'km', KPW: 'kp', KRW: 'kr', KWD: 'kw', KYD: 'ky', KZT: 'kz', LAK: 'la', LBP: 'lb',
  LKR: 'lk', LRD: 'lr', LSL: 'ls', LYD: 'ly', MAD: 'ma', MDL: 'md', MGA: 'mg', MKD: 'mk',
  MMK: 'mm', MNT: 'mn', MOP: 'mo', MRU: 'mr', MUR: 'mu', MVR: 'mv', MWK: 'mw', MXN: 'mx',
  MYR: 'my', MZN: 'mz', NAD: 'na', NGN: 'ng', NIO: 'ni', NOK: 'no', NPR: 'np', NZD: 'nz',
  OMR: 'om', PAB: 'pa', PEN: 'pe', PGK: 'pg', PHP: 'ph', PKR: 'pk', PLN: 'pl', PYG: 'py',
  QAR: 'qa', RON: 'ro', RSD: 'rs', RUB: 'ru', RWF: 'rw', SAR: 'sa', SBD: 'sb', SCR: 'sc',
  SDG: 'sd', SEK: 'se', SGD: 'sg', SHP: 'sh', SLE: 'sl', SOS: 'so', SRD: 'sr', SSP: 'ss',
  STN: 'st', SVC: 'sv', SYP: 'sy', SZL: 'sz', THB: 'th', TJS: 'tj', TMT: 'tm', TND: 'tn',
  TOP: 'to', TRY: 'tr', TTD: 'tt', TVD: 'tv', TWD: 'tw', TZS: 'tz', UAH: 'ua', UGX: 'ug',
  USD: 'us', UYU: 'uy', UZS: 'uz', VED: 've', VES: 've', VND: 'vn', VUV: 'vu', WST: 'ws',
  YER: 'ye', ZAR: 'za', ZMW: 'zm', ZWG: 'zw', ZWL: 'zw',
};

// every flag as a URL the build keeps as its own file (`build.assetsInlineLimit` is 0, see vite.config.js), so only the flags a screen shows are fetched
const FILES = import.meta.glob('../assets/flags/*.svg', { eager: true, query: '?url', import: 'default' });

/** The URL of the flag of `code` ("BRL"), or null when it has none (a crypto, a metal, a currency shared by several countries). */
export function flagUrl(code) {
  const name = FLAG_OF[String(code || '').toUpperCase()];
  return (name && FILES[`../assets/flags/${name}.svg`]) || null;
}

/** The flags the answer's currencies (and its base) need, to preload them with the fonts. Only fiat items have one. */
export function flagUrlsOf(quotes) {
  if (!quotes) return [];
  const urls = [flagUrl(quotes.base)];
  quotes.items.forEach((item) => { if (item.kind === 'fiat') urls.push(flagUrl(item.code)); });
  return [...new Set(urls.filter(Boolean))];
}

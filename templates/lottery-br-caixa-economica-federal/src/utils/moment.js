// The single-file build bundles every locale on the same moment instance.
// (`import 'moment/locale/pt-br'` registers the locale on a different
// instance than `import moment from 'moment'` once bundled, so dates
// silently stay in English.)
import moment from 'moment/min/moment-with-locales';

moment.locale('pt-br');

export default moment;

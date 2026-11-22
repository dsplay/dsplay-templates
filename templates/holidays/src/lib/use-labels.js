import { useTranslation } from 'react-i18next';
import { formatDate, lngOf } from './model';
import { whenText, scopeText } from './format';

/** The words a style needs, in the language of the screen: the date, how far away a day is, and the scope of a holiday. */
export default function useLabels() {
  const { t, i18n } = useTranslation();
  const lng = lngOf(i18n.language);
  return {
    t,
    lng,
    date: (iso, options) => formatDate(iso, lng, options),
    when: (away) => whenText(t, away),
    scope: (scope) => scopeText(t, scope),
  };
}

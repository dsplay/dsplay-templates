import { useTranslation } from 'react-i18next';
import { useConfig } from '@dsplay/react-template-utils';
import { useView } from '../../hooks/view-context';
import useClock from '../../hooks/use-clock';
import { formatClock, footerDate } from '../../util/clock';
import CompanyTile from '../company-tile';
import './style.sass';

/** Footer (spec M-001b 2.4): a hairline, the logo on its tile at the left, the date and the time of the device at the right. */
function Footer({ timeOnly, small }) {
  const { theme, settings } = useView();
  const { i18n } = useTranslation();
  const config = useConfig();
  const now = useClock(settings.showClock);
  const locale = (config && config.locale) || i18n.language;
  const clock = settings.showClock ? formatClock(now, locale, settings.clockFormat) : null;
  return (
    <>
      <div className="rule footer-rule" style={{ backgroundColor: theme.border }} />
      <div className="footer">
        <CompanyTile width={small ? 16 : 18} height={small ? 7 : 8} />
        {clock && (
          <div className="when">
            {!timeOnly && <span className="date" style={{ color: theme.muted }}>{footerDate(now, locale)}</span>}
            <span className="time">{clock.time}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default Footer;

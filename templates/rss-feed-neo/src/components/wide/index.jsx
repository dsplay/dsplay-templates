import { useTranslation } from 'react-i18next';
import { useConfig } from '@dsplay/react-template-utils';
import { useView } from '../../hooks/view-context';
import useClock from '../../hooks/use-clock';
import { formatClock } from '../../util/clock';
import useFirstImage from '../../hooks/use-first-image';
import Photo from '../photo';
import QrCard from '../qr-card';
import CompanyTile from '../company-tile';
import Lead from '../lead';
import './style.sass';

const GAP = 4;

/** Wide (192 x 48 rem, spec M-001b 2.3): ONLY the lead. Photo 56 wide at the left, text, QR at the right, the hour at the top right. No footer. */
function Wide({ stories, fallbackPhoto }) {
  const { stage, settings, theme } = useView();
  const { i18n } = useTranslation();
  const config = useConfig();
  const now = useClock(settings.showClock);
  const clock = settings.showClock ? formatClock(now, (config && config.locale) || i18n.language, settings.clockFormat) : null;
  const [lead] = stories;
  const photo = useFirstImage([lead.image, fallbackPhoto]);
  const photoOn = photo.status !== 'none';
  const hasQr = Boolean(lead.link && settings.showQrCode);
  const h = stage.h - GAP * 2;
  const left = photoOn ? 56 + GAP : 0;
  const right = hasQr ? 22 + GAP : 0;
  return (
    <div className="wide">
      <div className="main" style={{ left: `${GAP}rem`, top: `${GAP}rem`, right: `${GAP}rem`, height: `${h}rem` }}>
        {photoOn && <Photo photo={photo} style={{ width: '56rem', height: `${h}rem` }} />}
        <Lead
          story={lead}
          width={stage.w - GAP * 2 - left - right}
          height={h}
          titleMax={6}
          titleMin={5.2}
          titleLines={2}
          descMax={4.6}
          descMin={4.2}
          descLines={2}
          chipH={3.6}
          className={photoOn ? 'lead-text' : ''}
        />
      </div>
      {hasQr && <QrCard link={lead.link} style={{ position: 'absolute', right: `${GAP}rem`, top: '6rem' }} />}
      {/* the company logo under the QR (x 162-184, y 35-42); without a link it rises to the top (spec M-001b 2.3) */}
      <CompanyTile width={16} height={7} style={{ position: 'absolute', right: `${GAP + 3}rem`, top: hasQr ? '35rem' : `${GAP}rem` }} />
      {clock && <div className="hour" style={{ color: theme.text, right: `${GAP + right}rem` }}>{clock.time}</div>}
    </div>
  );
}

export default Wide;

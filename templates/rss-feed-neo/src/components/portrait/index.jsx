import { useView } from '../../hooks/view-context';
import useFirstImage from '../../hooks/use-first-image';
import Photo from '../photo';
import QrCard from '../qr-card';
import Lead from '../lead';
import FitText from '../fit-text';
import Second from '../second';
import Third from '../third';
import Footer from '../footer';
import './style.sass';

const GAP = 4;
const SECOND_H = 36;
const THIRD_H = 22;
const QR_W = 22;

/**
 * Portrait (spec M-001b 2.2): stacked, with the room that is left spread between the blocks (`space-between`). Lead: photo 100 x 45
 * (nothing over it), chip + title, then the description with the QR at its right. N2 with a 30 x 30 photo at the left, N3 text only.
 */
function Portrait({ stories, fallbackPhoto }) {
  const { stage, settings, theme } = useView();
  const [lead, second, third] = stories;
  const leadPhoto = useFirstImage([lead.image, fallbackPhoto]);
  const secondPhoto = useFirstImage(second ? [second.image] : []);
  const width = stage.w - GAP * 2;
  const colH = stage.h - 20;
  const hasQr = Boolean(lead.link && settings.showQrCode);
  const description = settings.showDescription ? lead.description : '';
  const photoOn = leadPhoto.status !== 'none';

  return (
    <div className="portrait">
      <div className="stack" style={{ left: `${GAP}rem`, right: `${GAP}rem`, top: `${GAP}rem`, height: `${colH}rem` }}>
        <div className="lead-block">
          {photoOn && <Photo photo={leadPhoto} style={{ width: `${width}rem`, height: '44rem', marginBottom: '3rem' }} />}
          <Lead
            noDesc
            story={lead}
            width={width}
            height={photoOn ? 28.4 : 40}
            titleMax={photoOn ? 7.2 : 9}
            titleMin={photoOn ? 6.4 : 7.2}
            titleLines={photoOn ? 3 : 4}
            chipH={3.6}
          />
          <div className="lead-bottom">
            <FitText
              text={description}
              width={hasQr ? width - QR_W - GAP : width}
              height={hasQr ? 24.8 : 30}
              maxLines={hasQr ? 4 : 5}
              max={5.6}
              min={4.6}
              color={theme.muted}
              style={{ width: `${hasQr ? width - QR_W - GAP : width}rem`, flex: 'none' }}
            />
            {hasQr && <QrCard link={lead.link} style={{ marginLeft: 'auto' }} />}
          </div>
        </div>
        {second && (
          <Second
            side
            story={second}
            width={width}
            height={SECOND_H}
            photo={secondPhoto}
            photoBox={{ width: 30, height: 30 }}
            titleMax={5.2}
            titleMin={4.8}
            titleLines={2}
            descLines={2}
          />
        )}
        {third && (
          <div className="third-block">
            <div className="hrule" style={{ backgroundColor: theme.border }} />
            <Third story={third} width={width} height={THIRD_H} titleLines={2} descLines={1} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Portrait;

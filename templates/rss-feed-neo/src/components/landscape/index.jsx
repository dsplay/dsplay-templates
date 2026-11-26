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
const THIRD_H = 22;
const QR_W = 22;

/**
 * Landscape and every window wider/taller than 16:9 (spec M-001b 2.1). Left, the lead: photo + chip/title on top; description and QR
 * (never over the photo) below. Right, a column with N2 (photo 64 x 30) and N3 (text only). Footer under everything.
 * The stage IS the window: the width the window has over 192 rem goes to the lead photo, the extra height to the lead and N2 photos.
 */
function Landscape({ stories, fallbackPhoto }) {
  const { stage, settings, theme } = useView();
  const [lead, second, third] = stories;
  const leadPhoto = useFirstImage([lead.image, fallbackPhoto]);
  const secondPhoto = useFirstImage(second ? [second.image] : []);
  const colH = stage.h - 20;
  const only = stories.length === 1;
  const both = stories.length === 2;
  const n1W = only ? stage.w - GAP * 2 : stage.w - GAP * 2 - 68;
  const row2H = only ? 28 : 32;
  const row1H = colH - row2H - GAP;
  const hasPhoto = leadPhoto.status !== 'none';
  const hasQr = Boolean(lead.link && settings.showQrCode);
  const description = settings.showDescription ? lead.description : '';
  const descWidth = n1W - (hasQr ? QR_W + GAP : 0);

  // right column: heights of N2 and N3
  const secondDesc = settings.showDescription && Boolean(second && second.description);
  const secondKicker = settings.showCategory && Boolean(second && second.kicker);
  const photoOn = secondPhoto.status !== 'none';
  const textNeed = (secondKicker ? 4 : 0) + (both ? 19.3 : 12) + (secondDesc ? 2 + (both ? 22.7 : 11.3) : 0);
  let secondH;
  let thirdH = THIRD_H;
  if (both) {
    secondH = colH;
  } else if (photoOn) {
    secondH = colH - GAP - THIRD_H;
  } else {
    secondH = textNeed;
    thirdH = colH - secondH - GAP;
  }
  const photoH = Math.max(14, secondH - textNeed - 3);

  // the lead's text next to the photo (56 wide), or the whole row without photo: marker + larger title
  const headWidth = only ? 84 : 56;
  const head = (
    <Lead
      noDesc
      story={lead}
      width={headWidth}
      height={row1H}
      titleMax={7.2}
      titleMin={6.4}
      titleLines={only ? 4 : 6}
      className="lead-head"
    />
  );

  return (
    <div className="landscape">
      <div className="main" style={{ left: `${GAP}rem`, right: `${GAP}rem`, top: `${GAP}rem`, height: `${colH}rem` }}>
        {hasPhoto ? (
          <div className="n1" style={{ width: `${n1W}rem`, height: `${colH}rem` }}>
            <div className="n1-top" style={{ height: `${row1H}rem` }}>
              <Photo
                photo={leadPhoto}
                style={only
                  ? { width: '96rem', height: `${row1H}rem` }
                  : { width: `${n1W - headWidth - GAP}rem`, height: `${row1H}rem` }}
              />
              {head}
            </div>
            <div className="n1-bottom" style={{ height: `${row2H}rem`, marginTop: `${GAP}rem` }}>
              <FitText
                text={description}
                width={descWidth}
                height={row2H}
                maxLines={5}
                max={5.6}
                min={4.6}
                color={theme.muted}
                style={{ width: `${descWidth}rem`, flex: 'none' }}
              />
              {hasQr && <QrCard link={lead.link} style={{ marginLeft: 'auto' }} />}
            </div>
          </div>
        ) : (
          // no photo (spec M-001b 3): a text block of the whole width, marker at the left, title and description STACKED (3 rem
          // between them, not anchored at the bottom), the QR at the right of the description
          <div className="n1 no-photo" style={{ width: `${n1W}rem`, height: `${colH}rem` }}>
            <div className="marker" style={{ backgroundColor: theme.primary }} />
            <div className="no-photo-text" style={{ width: `${n1W - 3.2}rem` }}>
              <Lead
                noDesc
                natural
                story={lead}
                width={n1W - 3.2}
                height={row1H}
                titleMax={9}
                titleMin={7.2}
                titleLines={4}
                chipH={3.6}
              />
              <div className="n1-bottom" style={{ marginTop: '3rem' }}>
                <FitText
                  text={description}
                  width={n1W - 3.2 - (hasQr ? QR_W + GAP : 0)}
                  height={32}
                  maxLines={5}
                  max={5.6}
                  min={4.6}
                  color={theme.muted}
                  style={{ width: `${n1W - 3.2 - (hasQr ? QR_W + GAP : 0)}rem`, flex: 'none' }}
                />
                {hasQr && <QrCard link={lead.link} style={{ marginLeft: 'auto' }} />}
              </div>
            </div>
          </div>
        )}
        {!only && (
          <>
            <div className="vrule" style={{ backgroundColor: theme.border, height: `${colH}rem` }} />
            <div className="col" style={{ width: '64rem', height: `${colH}rem` }}>
              <Second
                story={second}
                width={64}
                height={secondH}
                photo={secondPhoto}
                photoBox={photoOn ? { width: 64, height: both ? Math.max(14, colH - textNeed - 3) : photoH } : null}
                titleMax={both ? 5.6 : 5.2}
                titleMin={4.8}
                titleLines={both ? 3 : 2}
                descLines={both ? 4 : 2}
              />
              {third && (
                <>
                  <div className="hrule" style={{ backgroundColor: theme.border }} />
                  <Third story={third} width={64} height={thirdH} titleLines={2} descLines={photoOn ? 1 : 2} />
                </>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Landscape;

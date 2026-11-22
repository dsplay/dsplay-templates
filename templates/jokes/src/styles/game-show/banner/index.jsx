import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Stage from '../../../components/stage';
import usePlate from '../../../components/stage/use-plate';
import FittedText from '../../../components/fitted-text';
import { bannerSplit } from '../../../lib/layout';
import './style.sass';

const BITS = ['#ff7ab8', '#2dd4bf', '#ffd84d', '#ffffff', '#ff9f43'];

/** The strip of the Game Show style: a lit "?" tile, the question on a white card with its badge; once the answer is out the question shrinks to a small card and the answer pops in on a yellow one, with confetti. */
function ShowBanner({ joke, revealed }) {
  const { t } = useTranslation();
  const plate = usePlate();
  const vertical = plate.kind === 'v-banner';
  const { q, a } = bannerSplit(plate, revealed, { lead: vertical ? 96 : 150, share: vertical ? 0.3 : 0.36 });
  const side = (box, extra) => ({ w: box.w - (vertical ? 32 : 56), h: box.h - extra });

  const rays = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 12;
    const cx = plate.w / 2;
    const cy = plate.h / 2;
    const far = Math.max(plate.w, plate.h);
    return [`${cx},${cy}`, `${Math.round(cx + Math.cos(angle) * far)},${Math.round(cy + Math.sin(angle) * far)}`, `${Math.round(cx + Math.cos(angle + 0.14) * far)},${Math.round(cy + Math.sin(angle + 0.14) * far)}`].join(' ');
  }), [plate.w, plate.h]);
  const bits = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    x: Math.round(((i * 0.618034 + 0.09) % 1) * plate.w),
    y: Math.round(((i * 0.754878 + 0.2) % 1) * plate.h),
    fill: BITS[i % 5],
    rot: (i * 47) % 180,
  })), [plate.w, plate.h]);

  const qBox = side(q, vertical ? 52 : 70);
  const aBox = side(a, vertical ? 66 : 70);

  return (
    <Stage className={`show${revealed ? ' is-revealed' : ''}`}>
      <svg className="show__decor" viewBox={`0 0 ${plate.w} ${plate.h}`} aria-hidden="true">
        {rays.map((points) => <polygon key={points} points={points} fill="#ffffff" opacity="0.05" />)}
        {revealed && bits.map((b) => <rect key={`${b.x}-${b.y}`} x={b.x} y={b.y} width="12" height="7" rx="2" fill={b.fill} transform={`rotate(${b.rot} ${b.x} ${b.y})`} />)}
      </svg>
      <div className={`showb showb--${vertical ? 'v' : 'h'}`}>
        <div className="showb__tile"><span>{revealed ? '!' : '?'}</span></div>
        <div className={`showb__card showb__card--question${revealed ? ' is-small' : ''}`} style={vertical ? { height: `${q.h / 10}rem` } : { width: `${q.w / 10}rem` }}>
          {!revealed && <span className="show__badge show__badge--question showb__badge">{t('Question')}</span>}
          <FittedText text={joke.setup} width={qBox.w} height={qBox.h} max={revealed ? 24 : (vertical ? 40 : 58)} min={revealed ? 12 : 16} lineHeight={1.2} charWidth={0.66} wholeWords className={revealed ? 'show__small-text' : 'show__text'} />
        </div>
        {revealed && (
          <div className="showb__card showb__card--answer" style={vertical ? { height: `${a.h / 10}rem` } : { width: `${a.w / 10}rem` }}>
            <span className="show__badge show__badge--answer showb__badge">{t('Answer')}</span>
            <FittedText text={joke.punchline} width={aBox.w} height={aBox.h} max={vertical ? 52 : 72} min={14} lineHeight={1.08} charWidth={0.74} wholeWords className="show__text show__text--answer" />
          </div>
        )}
      </div>
    </Stage>
  );
}

export default ShowBanner;

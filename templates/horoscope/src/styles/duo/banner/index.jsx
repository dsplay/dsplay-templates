import { useTranslation } from 'react-i18next';
import Stage from '../../../components/stage';
import usePlate from '../../../components/stage/use-plate';
import Glyph from '../../../components/glyph';
import FittedText from '../../../components/fitted-text';
import { fitLine, rem } from '../../../lib/layout';
import { DISCLAIMER } from '../../../lib/labels';
import { longDate } from '../../../lib/model';
import signView from '../../../lib/sign-view';
import './style.sass';

const ELEMENT_COLOR = {
  fire: '#ff8a4c', earth: '#86c76b', air: '#6ec3ff', water: '#7a9cff',
};

function Card({ sign, plate }) {
  const { t } = useTranslation();
  const vertical = plate.kind === 'v-banner';
  const view = signView(sign, t);
  const accent = ELEMENT_COLOR[sign.element];
  const box = vertical
    ? { w: plate.w - 32 - 28, h: (plate.h - 32 - 70 - 14) / 2 - 100 }
    : { w: (plate.w - 48 - 24) / 2 - 36 - 164, h: 160 };
  return (
    <section className="duob__card">
      <div className="duob__who">
        <Glyph id={sign.id} className="duob__glyph" idle stroke={accent} />
        <div className="duob__id">
          <h2 className="duo__name duob__name" style={{ fontSize: rem(fitLine({ text: view.name, width: vertical ? 120 : 130, max: vertical ? 40 : 46, min: 24, charWidth: 0.5 })) }}>{view.name}</h2>
          <span className="duo__range duob__range">{view.range}</span>
        </div>
      </div>
      <div className="duob__body">
        <FittedText text={view.text} width={box.w} height={box.h} max={vertical ? 28 : 30} min={12} charWidth={vertical ? 0.64 : 0.58} lineHeight={1.36} wholeWords className="duo__text" />
      </div>
    </section>
  );
}

/** The strip of the Duo style: the two signs side by side (one above the other on a vertical strip), each with its glyph, name, dates and text; the notice and the screen dots at the foot. */
function DuoBanner({
  signs, today, screen, screens,
}) {
  const { t, i18n } = useTranslation();
  const plate = usePlate();
  return (
    <Stage className="duo">
      <div className={`duob duob--${plate.kind === 'v-banner' ? 'v' : 'h'}`}>
        <div className="duob__cards">
          {signs.map((sign) => <Card key={sign.id} sign={sign} plate={plate} />)}
        </div>
        <div className="duob__foot">
          <span className="duob__notice">{longDate(today, i18n.language)}<span className="duob__sep"> · </span><span>{t(DISCLAIMER)}</span></span>
          <span className="duo__pages" role="img" aria-label={t('Screen {{current}} of {{total}}', { current: screen + 1, total: screens })}>
            {Array.from({ length: screens }, (_, i) => <span key={i} className={`duo__page${i === screen ? ' is-current' : ''}`} />)}
          </span>
        </div>
      </div>
    </Stage>
  );
}

export default DuoBanner;

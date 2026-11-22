import { useTranslation } from 'react-i18next';
import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import Glyph from '../../components/glyph';
import Constellation from '../../components/constellation';
import Meter from '../../components/meter';
import FittedText from '../../components/fitted-text';
import { fitLine, isBanner, rem } from '../../lib/layout';
import { DISCLAIMER } from '../../lib/labels';
import { longDate } from '../../lib/model';
import signView from '../../lib/sign-view';
import Banner from './banner';
import './fonts.sass';
import './style.sass';

export const PER_SCREEN = 2;
export const FONTS = [{ family: 'Cormorant Garamond', weight: 700 }, { family: 'Inter', weight: 500 }, { family: 'Inter', weight: 600 }];

const ELEMENT_COLOR = {
  fire: '#ff8a4c', earth: '#86c76b', air: '#6ec3ff', water: '#7a9cff',
};

// text box of a card and the width of its name, in design px
const BOX = {
  landscape: { text: { w: 506, h: 250 }, name: 330, nameMax: 62, max: 23, min: 13 },
  portrait: { text: { w: 584, h: 250 }, name: 400, nameMax: 62, max: 30, min: 13 },
  square: { text: { w: 330, h: 320 }, name: 300, nameMax: 52, max: 28, min: 13 },
};

function Card({ sign, kind }) {
  const { t } = useTranslation();
  const view = signView(sign, t);
  const accent = ELEMENT_COLOR[sign.element];
  const box = BOX[kind];
  return (
    <section className="duo__card">
      <Constellation
        id={sign.id}
        width={200}
        height={140}
        pad={20}
        accent={accent}
        label={view.name}
        className="duo__stars" idle
        lineWidth={1.6}
        lineOpacity={0.7}
        starScale={1.8}
        haloScale={4.4}
      />
      <div className="duo__head">
        <Glyph id={sign.id} className="duo__glyph" idle stroke={accent} />
        <span className="duo__range">{view.range}</span>
      </div>
      <h2 className="duo__name" style={{ fontSize: rem(fitLine({ text: view.name, width: box.name, max: box.nameMax, min: 30, charWidth: 0.5 })) }}>{view.name}</h2>
      {view.keyword && <div className="duo__chip" style={{ color: accent, borderColor: accent }}>{view.keyword}</div>}
      <div className="duo__body">
        <FittedText text={view.text} width={box.text.w} height={box.text.h} max={box.max} min={box.min} charWidth={0.5} className="duo__text" />
      </div>
      <div className="duo__meters">
        <Meter label={t('Love')} value={sign.love} />
        <Meter label={t('Work')} value={sign.work} />
        <Meter label={t('Health')} value={sign.health} />
      </div>
    </section>
  );
}

/** Two signs a screen, side by side (one above the other on a portrait screen), with a marker of which of the six screens this is. */
function Duo({
  signs, today, screen, screens,
}) {
  const { t, i18n } = useTranslation();
  const { kind } = usePlate();
  if (isBanner(kind)) return <Banner signs={signs} today={today} screen={screen} screens={screens} />;
  return (
    <Stage className="duo">
      <div className="duo__top">
        <div className="duo__title"><span>{t('Daily horoscope')}</span><span className="duo__date">{longDate(today, i18n.language)}</span></div>
        <div className="duo__pages" role="img" aria-label={t('Screen {{current}} of {{total}}', { current: screen + 1, total: screens })}>
          {Array.from({ length: screens }, (_, i) => <span key={i} className={`duo__page${i === screen ? ' is-current' : ''}`} />)}
        </div>
      </div>
      <div className="duo__cards">
        {signs.map((sign) => <Card key={sign.id} sign={sign} kind={kind} />)}
      </div>
      <p className="duo__disclaimer">{t(DISCLAIMER)}</p>
    </Stage>
  );
}

export default Duo;

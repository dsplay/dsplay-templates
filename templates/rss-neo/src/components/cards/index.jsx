import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { cardsGeometry, rectStyle, CARD_GAP, NEXT_COLUMN_W } from '../../util/geometry';
import Cover from '../cover';
import HeroContent from '../hero-content';
import Card from '../card';
import Headline from '../headline';
import FitDescription from '../fit-description';
import QrBox from '../qr-box';
import MarkedText from '../marked-text';
import Thumb from '../thumb';
import './style.sass';

/** A "next" card: category (or "Up next") and headline at 4.2 rem on the left, thumbnail on the right. */
function NextCard({ item, thumb, delay }) {
  const { theme, settings } = useView();
  const { t } = useTranslation();
  const label = (settings.showCategory && item.kicker) || settings.nextLabel || t('Up next');
  return (
    <Card delay={delay}>
      <div className="text">
        <div className="label" style={{ color: theme.accentText }}>{label}</div>
        <Headline fixed text={item.headline} max={4.2} maxLines={2} color={theme.text} />
      </div>
      <Thumb src={item.image} size={thumb} />
    </Card>
  );
}

/**
 * cards: same hero as `hero`; on the base the current card (description + vertical QR) and the next two items
 * (landscape: a column of two beside it; portrait: stacked below it).
 */
function Cards({ items, photos }) {
  const { t } = useTranslation();
  const { stage, settings } = useView();
  const geo = cardsGeometry(stage.format, stage);
  const [current, ...next] = items;
  const kicker = settings.showCategory ? current.kicker : '';
  const link = settings.showQrCode ? current.link : '';
  const callToAction = t('Point your phone camera at the QR code and read the full story.');
  const description = settings.showDescription ? (current.description || (link ? callToAction : '')) : '';
  const gap = `${CARD_GAP}rem`;

  const currentCard = (
    <div className="slot current" style={{ height: `${geo.currentH}rem` }}>
      <Card marker delay={160}>
        <MarkedText>
          <div className="text">
            <FitDescription text={description} width={geo.textWidth} height={geo.currentH - 8} maxLines={geo.descLines} />
          </div>
        </MarkedText>
        {link && <div className="side"><QrBox link={link} size={20} /></div>}
      </Card>
    </div>
  );
  const nextCards = next.slice(0, 2).map((item, index) => (
    <div
      className="slot next"
      key={`${index}-${item.headline}`}
      style={{ height: `${geo.nextH}rem`, marginTop: index || geo.portrait ? gap : 0 }}
    >
      <NextCard item={item} thumb={geo.thumb} delay={240 + index * 80} />
    </div>
  ));

  return (
    <>
      <Cover rect={geo.cover} sources={photos} key={photos.join('|')}>
        {(ink, onPhoto) => (
          <HeroContent
            news={current}
            kicker={kicker}
            geo={geo}
            coverH={geo.cover.h}
            bottomY={geo.cardsY - 4}
            ink={ink}
            onPhoto={onPhoto}
            animated={settings.animationEnabled}
          />
        )}
      </Cover>
      <div className={`cards-list${geo.portrait ? ' portrait' : ''}`} style={rectStyle(geo.list)}>
        {currentCard}
        {geo.portrait
          ? nextCards
          : <div className="column" style={{ width: `${NEXT_COLUMN_W}rem`, marginLeft: gap }}>{nextCards}</div>}
      </div>
    </>
  );
}

export default Cards;

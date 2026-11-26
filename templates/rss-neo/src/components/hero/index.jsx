import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { heroGeometry, wideGeometry } from '../../util/geometry';
import Cover from '../cover';
import HeroContent from '../hero-content';
import Clock from '../clock';
import LogoTile from '../logo-tile';
import FeedLogo from '../feed-logo';
import Card from '../card';
import QrBox from '../qr-box';
import Headline from '../headline';
import FitDescription from '../fit-description';
import MarkedText from '../marked-text';
import './style.sass';

/** hero: the cover with the headline, a description card and a QR card on the base. Wide: cover on the left, one card. */
function Hero({ news, photos }) {
  const { t } = useTranslation();
  const { theme, stage, settings, feedLogo } = useView();
  const showFeedCircle = feedLogo.pending || Boolean(feedLogo.src);
  const { format } = stage;
  const link = settings.showQrCode ? news.link : '';
  const kicker = settings.showCategory ? news.kicker : '';
  const anim = settings.animationEnabled;

  if (format === 'wide') {
    const hasPhoto = photos.length > 0;
    const geo = wideGeometry(stage.w, stage.h, hasPhoto);
    const description = settings.showDescription ? news.description : '';
    const withQr = Boolean(link);
    const width = geo.card.w - 9 - (withQr ? 26 : 0);
    const used = (kicker || showFeedCircle ? 5.6 : 0) + (description ? 2 * 3.6 * 1.35 + 1 : 0);
    return (
      <>
        {geo.cover && (
          <Cover rect={geo.cover} sources={photos} key={photos.join('|')}>
            {(ink) => (
              <div className="hero-content">
                <div className="top-left"><LogoTile height={6} minWidth={12} inset={2} /></div>
                <div className="top-right"><Clock timeOnly color={ink} /></div>
              </div>
            )}
          </Cover>
        )}
        <Card rect={geo.card} marker delay={160}>
          <MarkedText>
            <div className={`text${anim ? ' fade-in' : ''}`}>
            {(kicker || showFeedCircle) && (
              <div className="kicker-line">
                <FeedLogo size={4.4} />
                {kicker && <div className="kicker-text" style={{ color: theme.accentText }}>{kicker}</div>}
              </div>
            )}
            <Headline
              text={news.headline || t('No news')}
              width={width}
              maxLines={3}
              max={hasPhoto ? 6 : 8}
              min={hasPhoto ? 4.4 : 5.2}
              height={geo.card.h - 4 - used}
              color={theme.text}
            />
            {description && <FitDescription text={description} width={width} height={10} maxLines={2} />}
            </div>
          </MarkedText>
          {withQr && <QrBox link={link} size={20} />}
        </Card>
      </>
    );
  }

  const callToAction = t('Point your phone camera at the QR code and read the full story.');
  // no description in the item: a call-to-action card instead (needs the QR code)
  const description = settings.showDescription ? (news.description || (link ? callToAction : '')) : '';
  const geo = heroGeometry(format, {
    w: stage.w, h: stage.h, hasDesc: Boolean(description), hasQr: Boolean(link),
  });
  const bottomY = geo.desc || geo.qr ? geo.cardsY - 4 : geo.cover.h - 5;

  return (
    <>
      <Cover rect={geo.cover} sources={photos} key={photos.join('|')}>
        {(ink, onPhoto) => (
          <HeroContent
            news={news}
            kicker={kicker}
            geo={geo}
            coverH={geo.cover.h}
            bottomY={bottomY}
            ink={ink}
            onPhoto={onPhoto}
            animated={anim}
          />
        )}
      </Cover>
      {geo.desc && (
        <Card rect={geo.desc} marker delay={160}>
          <MarkedText>
            <div className={`text${anim ? ' fade-in' : ''}`}>
              <FitDescription text={description} width={geo.desc.w - 9} height={geo.desc.h - 8} maxLines={geo.descLines} />
            </div>
          </MarkedText>
        </Card>
      )}
      {geo.qr && (
        <Card rect={geo.qr} delay={240} row={false}>
          <QrBox link={link} size={20} />
        </Card>
      )}
    </>
  );
}

export default Hero;

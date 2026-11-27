import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import layoutOf from '../../util/layout';
import buildChipLabel from '../../utils/chip-label';
import { buildCompactDate, buildEventDate } from '../../utils/format-event-date';
import { getEventStatus } from '../../utils/event-status';
import useImageOk from '../../utils/use-image-ok';
import EventText from '../event-text';
import LogoTile from '../logo-tile';
import PlaceCard from '../place-card';
import StatusChip from '../status-chip';
import BarH from '../bar-h';
import './style.sass';

const text = (value) => String(value || '').trim();

/** The meeting-room screen of every format: it lays out the event data on the rects of util/layout.js. */
function Screen() {
  const { t } = useTranslation();
  const {
    stage, theme, settings, media: rawMedia, locale, now,
  } = useView();
  const media = rawMedia || {};
  const name = text(media.eventName);
  const place = text(media.location);
  const eventOk = useImageOk(settings.eventLogo);
  const hostOk = useImageOk(settings.hostLogo);
  const hasEvent = Boolean(settings.eventLogo) && eventOk !== false;
  const hasHost = Boolean(settings.hostLogo) && hostOk !== false;

  const options = { t, locale, timeFormat: settings.timeFormat };
  const date = buildEventDate(media.startDate, media.endDate, options);
  const status = settings.showStatus ? getEventStatus(media.startDate, media.endDate, now) : null;
  const chip = buildChipLabel(status, options);
  const ended = Boolean(status && status.kind === 'ended');
  const { set } = stage;

  if (set === 'h') {
    const compact = buildCompactDate(media.startDate, media.endDate, { t, locale });
    const rest = [compact, place].filter(Boolean).map((part) => ` · ${part}`).join('');
    return (
      <BarH
        stage={stage}
        theme={theme}
        chip={chip}
        line={{ name, rest: name ? rest : rest.replace(/^ · /, '') }}
      />
    );
  }

  const L = layoutOf(set, {
    eventLogo: hasEvent, hostLogo: hasHost, place: Boolean(place), chip: Boolean(chip),
  });
  const animated = settings.animationEnabled;
  const isV = set === 'v';
  const chipEl = chip && (
    <StatusChip
      rect={isV ? null : L.chip}
      label={chip}
      theme={theme}
      fontRem={L.sizes.chip}
      animated={animated}
    />
  );
  const showMarker = !isV && set !== 'sq' ? true : set === 'sq';
  return (
    <div className={`screen set-${set}${animated ? ' rise' : ''}`}>
      {!isV && chipEl}
      {(name || date) && (
        <EventText
          L={L}
          name={name}
          date={date}
          place={L.placeText ? place : ''}
          theme={theme}
          ended={ended}
          marker={showMarker && Boolean(name)}
        >
          {isV && chipEl}
        </EventText>
      )}
      <LogoTile rect={L.event} src={settings.eventLogo} alt={t('Event logo')} background={settings.logoCard} level={isV ? 'elevated1' : 'elevated2'} theme={theme} />
      <LogoTile rect={L.host} src={settings.hostLogo} alt={t('Host logo')} background={settings.logoCard} level="elevated1" theme={theme} />
      <PlaceCard
        rect={L.place}
        text={place}
        base={L.sizes.place}
        min={L.sizes.placeMin}
        maxLines={L.sizes.placeLines}
        theme={theme}
      />
    </div>
  );
}

export default Screen;

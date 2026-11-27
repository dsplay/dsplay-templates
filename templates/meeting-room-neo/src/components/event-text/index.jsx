import { box } from '../../util/layout';
import { fitText } from '../../util/fit';
import './style.sass';

const MARKER_W = 0.8;
const MARKER_GAP = 2; // rem between the marker and the text
const LINE = 1.15;

/** The date text: parts joined by a dot (one day, start only) or by a drawn arrow (several days). */
function DateText({ date, stacked }) {
  if (stacked) {
    return date.stack ? date.stack.map((line, i) => <div key={`${line}-${i.toString()}`}>{line}</div>) : date.parts.map((p) => <div key={p}>{p}</div>);
  }
  if (date.kind === 'multi-day') {
    return (
      <>
        {date.parts[0]}
        <span className="arrow" />
        {date.parts[1]}
      </>
    );
  }
  return date.parts.join(' · ');
}

// the arrow takes about two characters of room in the estimate
const dateString = (date) => (date.kind === 'multi-day' ? `${date.parts[0]} ~~ ${date.parts[1]}` : date.parts.join(' · '));

/**
 * Marker + name + date (and, for the wide and the V bar, the place as plain text and the chip), laid out in one block.
 * The name is fitted to the largest size that holds the lines the format allows.
 */
function EventText({
  L, name, date, place, theme, ended, marker, children,
}) {
  const { sizes } = L;
  const stacked = Boolean(date && date.stack) && L.vbar;
  const [, , w, h] = L.block;
  const textW = sizes.textW - (marker ? MARKER_GAP + MARKER_W : 0);

  const dateFit = date && (stacked
    ? { size: sizes.date, lines: 4 }
    : fitText(dateString(date), {
      width: textW, height: sizes.date * LINE * 2, base: sizes.date, min: sizes.dateMin, maxLines: 2, bold: false,
    }));
  const dateH = date ? dateFit.size * LINE * dateFit.lines + 1.2 : 0;
  const placeFit = place && fitText(place, {
    width: textW, height: sizes.place * LINE * sizes.placeLines, base: sizes.place, min: sizes.placeMin, maxLines: sizes.placeLines, bold: false,
  });
  const placeH = place ? placeFit.size * LINE * placeFit.lines + 1.2 : 0;
  const extra = children ? sizes.chip * 4.4 : 0;
  const nameFit = name && fitText(name, {
    width: textW, height: h - dateH - placeH - extra - 1, base: sizes.name, min: sizes.nameMin, maxLines: sizes.nameLines,
  });

  return (
    <div className={`event-block ${L.align}`} style={{ ...box(L.block), width: `${w}rem` }}>
      <div className="event-row">
        {marker && <div className="marker" style={{ width: `${MARKER_W}rem`, marginRight: `${MARKER_GAP}rem`, backgroundColor: theme.accentText }} />}
        <div className="event-col" style={{ width: `${textW}rem`, color: theme.text }}>
          {name && (
            <div
              className="event-name"
              style={{ fontSize: `${nameFit.size}rem`, WebkitLineClamp: nameFit.lines, opacity: ended ? 0.7 : 1 }}
            >
              {name}
            </div>
          )}
          {date && (
            <div className="event-date" style={{ fontSize: `${dateFit.size}rem`, color: theme.muted, marginTop: name ? '1.2rem' : 0 }}>
              <DateText date={date} stacked={stacked} />
            </div>
          )}
          {children}
          {place && (
            <div className="event-place" style={{ fontSize: `${placeFit.size}rem`, WebkitLineClamp: placeFit.lines, marginTop: '1.2rem' }}>
              {place}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventText;

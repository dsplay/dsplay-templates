import './style.sass';

/** The default RSS mark, drawn with plain boxes (an SVG cannot be animated on Android 4.4): a dot and two waves that light up in turn. */
function RssIcon() {
  return (
    <div className="rss-icon">
      <div className="wave wave-2" />
      <div className="wave wave-1" />
      <div className="dot" />
    </div>
  );
}

export default RssIcon;

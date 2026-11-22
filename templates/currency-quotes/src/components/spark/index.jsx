import { sparkArea, sparkPoints } from '../../lib/sparkline';
import { rem } from '../../lib/layout';
import useTone from '../../lib/use-tone';
import Reveal from '../reveal';
import './style.sass';

/**
 * The small chart of a period: a line and the area under it, drawn in a box `width` x `height` design px. The SVG is static (the 4.4 WebView cannot animate
 * SVG): a style animates the HTML boxes around it (`Reveal`: the chart is drawn from the left at its final size). Nothing is drawn without a series (the box keeps its size so the row does not move).
 */
function Spark({
  series, width, height, trend, className = '',
}) {
  const tone = useTone();
  const line = sparkPoints(series, width, height, 3);
  return (
    <div className={`spark spark--${tone(trend)} ${className}`} style={{ width: rem(width), height: rem(height) }}>
      {line && (
        <Reveal>
          <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" aria-hidden="true" focusable="false">
            <polygon className="spark__area" points={sparkArea(series, width, height, 3)} />
            <polyline className="spark__line" points={line} fill="none" />
          </svg>
        </Reveal>
      )}
    </div>
  );
}

export default Spark;

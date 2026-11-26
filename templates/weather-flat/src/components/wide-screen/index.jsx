import { useView } from '../../hooks/view-context';
import {
  SIZES, DAYS, wideLayout, rectStyle,
} from '../../util/layout';
import NowCard from '../now-card';
import Pill from '../pill';
import LogoTile from '../logo-tile';
import '../full-screen/style.sass';

/** Wide (192 x 48 rem): `now` on the left, up to five vertical pills, the logo tile at the right. */
function WideScreen() {
  const { stage, settings, weather } = useView();
  const sizes = SIZES.wide;
  const pills = Math.min(DAYS, weather.forecast.length);
  const layout = wideLayout(stage, { pills, logo: settings.showLogo });
  const anim = settings.animationEnabled ? ' fade-in' : '';
  return (
    <div className={`full-screen${anim}`}>
      <NowCard rect={layout.now} sizes={sizes.now} withDescription={false} />
      {layout.pills.map((rect, i) => (
        <Pill
           
          key={i}
          rect={rect}
          day={weather.forecast[i]}
          today={i === 0}
          sizes={sizes.pill}
        />
      ))}
      {settings.showLogo && (
        <div className="logo-slot" style={rectStyle(layout.logo)}>
          <LogoTile height={layout.logo.h} minWidth={layout.logo.w} inset={2.8} />
        </div>
      )}
    </div>
  );
}

export default WideScreen;

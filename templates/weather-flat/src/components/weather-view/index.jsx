import { useView } from '../../hooks/view-context';
import FullScreen from '../full-screen';
import WideScreen from '../wide-screen';
import BarH from '../bar-h';
import BarV from '../bar-v';
import Unavailable from '../unavailable';

/** Picks the screen of the format; no usable weather: the unavailable screen. */
function WeatherView() {
  const { stage, weather } = useView();
  if (!weather.ok) {
    return <Unavailable />;
  }
  switch (stage.format) {
    case 'bar-h':
      return <BarH />;
    case 'bar-v':
      return <BarV />;
    case 'wide':
      return <WideScreen />;
    default:
      return <FullScreen />;
  }
}

export default WeatherView;

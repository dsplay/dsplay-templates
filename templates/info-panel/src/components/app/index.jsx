import { useContext, useEffect, useState } from 'react';
import {
  Loader, LoaderContext, useConfig, useMedia, useTemplateVal,
} from '@dsplay/react-template-utils';
import { formatOf, isFlat, spotFormatOf } from '../../lib/layout';
import { fillOf, scaleOf } from '../../lib/scale';
import { readPanel } from '../../lib/model';
import { readSpotlight } from '../../lib/spotlight';
import { PANEL_MAX_PHASE, SPOT_MAX_PHASE, useRotation } from '../../lib/rotation';
import { lngOf } from '../../lib/strings';
import {
  Clock, Weather, Quotes, Logo, Slide,
} from '../widgets';
import '../../fonts.sass';
import Spotlight from '../spotlight';
import '../../style.sass';
import '../../spotlight.sass';

// the panel family (every widget at once) and the spotlight family (one widget at a time, with its detail)
const PANEL_STYLES = ['classic', 'terminal', 'glass', 'newsroom', 'paper', 'neon'];
const SPOTLIGHT_STYLES = ['poster', 'cards', 'split', 'night', 'minimal'];
// one source, two templates: `vite build --mode panel` and `--mode spotlight` each keep only their family's styles (the dev server and the tests keep both)
const FAMILIES = { panel: PANEL_STYLES, spotlight: SPOTLIGHT_STYLES };
const STYLES = FAMILIES[import.meta.env.MODE] || [...PANEL_STYLES, ...SPOTLIGHT_STYLES];
const DEFAULT_STYLE = STYLES[0];

// the faces a style draws with, loaded before the template is shown (the bundled ones, see fonts.sass)
const FONTS = {
  classic: [{ family: 'Inter', weight: 700 }],
  glass: [{ family: 'Inter', weight: 700 }],
  terminal: [{ family: 'Inter', weight: 700 }, { family: 'JetBrains Mono', weight: 700 }],
  newsroom: [{ family: 'Inter', weight: 700 }, { family: 'Barlow Condensed', weight: 700 }],
  paper: [{ family: 'Inter', weight: 700 }, { family: 'Newsreader', weight: 700 }],
  neon: [{ family: 'Inter', weight: 700 }, { family: 'Space Grotesk', weight: 700 }],
  poster: [{ family: 'Inter', weight: 700 }],
  cards: [{ family: 'Inter', weight: 700 }],
  split: [{ family: 'Inter', weight: 700 }],
  night: [{ family: 'Inter', weight: 700 }, { family: 'Space Grotesk', weight: 700 }],
  minimal: [{ family: 'Inter', weight: 700 }, { family: 'Newsreader', weight: 700 }],
};

// the biggest and the smallest size of the rotating text, in em of its format's type size (the design's FIT table); the tall banner wraps instead
const FIT = {
  'fmt-slim': { max: 0.78, min: 0.45 }, 'fmt-band': { max: 0.66, min: 0.4 }, 'fmt-landscape': { max: 2.5, min: 0.9 }, 'fmt-square': { max: 2.3, min: 0.9 }, 'fmt-portrait': { max: 2.3, min: 0.9 }, 'fmt-tall': null,
};
// how much of the strip the rotating area may take, by how many other widgets there are (the horizontal bar's rule: the long text never takes the whole banner)
const SHARE = [100, 65, 55, 45, 40];

// how many lines a rotating text may take: a strip has one, a banner two, the tile formats three
const linesOf = (format) => (/fmt-slim/.test(format) ? 1 : /fmt-band/.test(format) ? 2 : 3);

const windowSize = () => [window.innerWidth, window.innerHeight];

/** The format class of the screen for a family's `of` function, again whenever the window is resized. */
function useFormat(of) {
  const [size, setSize] = useState(windowSize);
  useEffect(() => {
    const onResize = () => setSize(windowSize());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return { format: of(...size), size };
}

/** Draws its children at the format's reference size and scales them to the real screen (see lib/scale.js). */
function Scaled({ format, size, children }) {
  const k = scaleOf(format, size[0], size[1]);
  if (Math.abs(k - 1) < 0.02) return children;
  const transform = `scale(${k})`;
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <div style={{ width: size[0] / k, height: size[1] / k, WebkitTransform: transform, transform, WebkitTransformOrigin: '0 0', transformOrigin: '0 0' }}>{children}</div>
    </div>
  );
}

const boxOf = (backgroundColor, color) => (backgroundColor || color ? { backgroundColor: backgroundColor || undefined, color: color || undefined } : undefined);

/** Tells the app when the Loader shows the template (the fonts and images are in): the rotation starts then, not while the template is still hidden and its first phases would pass unseen. */
function Revealed({ onReveal }) {
  const loader = useContext(LoaderContext);
  const shown = !loader || loader.ready !== false;
  useEffect(() => { if (shown) onReveal(true); }, [shown, onReveal]);
  return null;
}

function App() {
  const media = useMedia();
  const [revealed, setRevealed] = useState(false);
  const { locale } = useConfig();
  const lng = lngOf(locale);
  const styleVar = useTemplateVal('style', DEFAULT_STYLE);
  const style = STYLES.includes(styleVar) ? styleVar : DEFAULT_STYLE;
  const spotlightFamily = SPOTLIGHT_STYLES.includes(style);
  const { format, size } = useFormat(spotlightFamily ? spotFormatOf : formatOf);
  const pin = useTemplateVal('pin') === 'both';
  // the most one phase stays before the turn is repeated to share a long media (lib/rotation.js)
  const maxPhase = spotlightFamily ? SPOT_MAX_PHASE : PANEL_MAX_PHASE;
  const bgColor = useTemplateVal('bg_color');
  const bgImage = useTemplateVal('bg_image');
  const textColor = useTemplateVal('text_color');
  const quoteBox = boxOf(useTemplateVal('currency_box_color'), useTemplateVal('currency_text_color'));
  const newsBox = boxOf(useTemplateVal('rss_logo_box_color'));
  const logoBox = boxOf(useTemplateVal('sponsor_logo_box_color'));

  const iteration = media && media.iteration;
  const panel = spotlightFamily ? null : readPanel(media, { lng, iteration });
  const rotation = useRotation({ phases: panel ? panel.slides.map((s) => s.slots) : [], duration: media && media.duration, max: maxPhase, hold: !revealed });
  const spotlight = spotlightFamily ? readSpotlight(media, { lng, iteration, pin }) : null;
  const flat = isFlat(format);
  const tall = format === 'fmt-tall';
  const fit = FIT[format.split(' ')[0]];

  const bgStyle = {};
  if (bgColor) {
    bgStyle.backgroundColor = bgColor;
    bgStyle.backgroundImage = 'none';
  }
  if (bgImage) {
    bgStyle.backgroundImage = `url('${bgImage}')`;
    bgStyle.backgroundSize = 'cover';
    bgStyle.backgroundPosition = 'center';
  }

  let content = null;
  if (panel) {
    const { order, widgets, slides } = panel;
    const others = order.filter((k) => k !== 'rot').length;
    const share = SHARE[Math.min(others, 4)];
    const boost = fillOf(format, size[0], size[1]);
    const fillStyle = boost > 1.02 ? { fontSize: `${boost}em` } : undefined;
    // the big tile of the tile formats is mostly air at the design's size: its content is drawn a third bigger, on top of what the room left over adds
    const rotBoost = boost * (/fmt-(landscape|square|portrait)/.test(format) ? 1.3 : 1);
    const rotFill = rotBoost > 1.02 ? { fontSize: `${rotBoost}em` } : undefined;
    const rotStyle = tall ? { maxHeight: `${share}%` } : { maxWidth: `${share}%` };
    const rot = (
      <div key="rot" className="rot" style={flat ? rotStyle : rotFill}>
        {slides.map((slide, i) => <Slide key={slide.type + i} slide={slide} fit={fit} lines={linesOf(format)} newsBoxStyle={newsBox} active={rotation.active === i} phase={rotation.phase} />)}
      </div>
    );
    const fixedWidget = (type, index) => (
      <div key={type} className={`w wk-${type}`} style={{ animationDelay: `${index * 0.12}s` }}>
        {type === 'clock' && <Clock lng={lng} {...widgets.clock} />}
        {type === 'weather' && <Weather weather={widgets.weather} tiles={!flat} />}
        {type === 'quotes' && <Quotes quotes={widgets.quotes} boxStyle={quoteBox} />}
      </div>
    );
    const logo = widgets.logo && (
      <div key="logo" className="anchor"><div className="w wk-logo" style={{ animationDelay: '0.5s' }}><Logo url={widgets.logo.url} boxStyle={logoBox} /></div></div>
    );
    if (flat) {
      content = order.map((key, i) => {
        if (key === 'rot') return slides.length ? rot : null;
        if (key === 'logo') return logo;
        return fixedWidget(key, i);
      });
    } else {
      const fixedTypes = order.filter((k) => k !== 'rot' && k !== 'logo');
      content = [<div key="fx" className="fx" style={fillStyle}>{fixedTypes.map(fixedWidget)}</div>, slides.length ? rot : null, logo];
    }
  }

  const rootClass = `ip ${format} st-${style} ${flat ? 'flat' : ''} ${panel && panel.widgets.logo ? 'withlogo' : 'nologo'}`;
  if (spotlightFamily) {
    return (
      <Loader reveal fonts={FONTS[style]}>
      <Revealed onReveal={setRevealed} />
        <Scaled format={format} size={size}>
        {spotlight ? (
          <Spotlight spotlight={spotlight} style={style} format={format} lng={lng} backgroundStyle={bgStyle} textColor={textColor} logoBoxStyle={logoBox} duration={media && media.duration} hold={!revealed} boost={fillOf(format, size[0], size[1])} height={size[1]} max={maxPhase} />
        ) : <div className="sp nohead" style={{ width: '100%', height: '100%' }}><div className="sbg" style={bgStyle} /></div>}
        </Scaled>
      </Loader>
    );
  }
  return (
    <Loader reveal fonts={FONTS[style]}>
        <Revealed onReveal={setRevealed} />
      <Scaled format={format} size={size}>
        <div className={rootClass} style={{ width: '100%', height: '100%', color: textColor || undefined }}>
          <div className="bg" style={bgStyle} />
          {content}
        </div>
      </Scaled>
    </Loader>
  );
}

export default App;

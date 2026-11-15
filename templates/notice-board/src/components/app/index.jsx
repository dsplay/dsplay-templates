import { useState } from 'react';
import {
  useMedia, useTemplateBoolVal, useTemplateFloatVal, useTemplateVal,
} from '@dsplay/react-template-utils';
import Backdrop from '../backdrop';
import Post from '../post';
import Ticker from '../ticker';
import { imageSource, kindOf, lookOf } from '../../lib/post-look';
import './style.sass';

// The notice board template. The player gateway answers with each post as `blocks` (runs of text with bold, italic and a named colour), never as HTML;
// the player picks one post per showing (the ticker included) and hands it over as `media.kind`, `media.title` and `media.blocks`. The page is exactly as big
// as the region it is rendered in, so there is no font size variable: the text is as large as fits.
function App() {
  const media = useMedia() || {};
  const textColor = useTemplateVal('text_color', '#ffffff');
  const backgroundColor = useTemplateVal('background_color', '#0b3b4a');
  const showTitle = useTemplateBoolVal('show_title', true);
  const speed = useTemplateFloatVal('ticker_speed', 120);
  const [{ width, height }] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));

  const kind = kindOf(media);
  const { style, colors } = lookOf(media, textColor, backgroundColor, width, height);
  const source = imageSource(media.image);
  const backdrop = kind !== 'ticker' && media.imageMode === 'backdrop' ? source : '';

  return (
    <div className="app" style={style}>
      {backdrop !== '' && <Backdrop source={backdrop} width={width} height={height} />}
      {kind === 'ticker'
        ? <Ticker media={media} colors={colors} speed={speed} width={width} height={height} />
        : (
          <Post
            kind={kind}
            media={media}
            colors={colors}
            picture={backdrop === '' && kind !== 'ticker' ? source : ''}
            showTitle={showTitle}
            width={width}
            height={height}
          />
        )}
    </div>
  );
}

export default App;

import { useEffect, useLayoutEffect, useContext } from 'react';
import { I18nextProvider } from 'react-i18next';
import {
  Loader, useConfig, useMedia, useTemplateVal, useTemplateBoolVal, LoaderContext,
} from '@dsplay/react-template-utils';
import Posts from '../posts';
import i18n from '../../i18n';

// fonts to preload
// @font-face's must be defined in fonts.css or another in-use style file
const fonts = [
  'Roboto',
  'Oswald',
];

function Content() {
  const { ready } = useContext(LoaderContext);

  // The fade starts when the Loader reveals the template: started at mount it would run while the template is still hidden.
  useEffect(() => {
    if (ready) document.querySelector('.App').classList.add('fadeIn');
  }, [ready]);

  const {
    orientation,
    width,
    height,
  } = useConfig();
  const media = useMedia();
  const horizontalBackground = useTemplateVal('bg_horizontal');
  const verticalBackground = useTemplateVal('bg_vertical');
  const primaryColor = useTemplateVal('primary_color', 'white');
  const showInstagramIcon = useTemplateBoolVal('show_instagram_icon', true);
  const isVertical = orientation === 'portrait';

  useLayoutEffect(() => {
    let bgImage = null;
    if (horizontalBackground) {
      bgImage = `url('${horizontalBackground}')`;
      if (verticalBackground && isVertical) {
        bgImage = `url('${verticalBackground}')`;
      }
    } else if (verticalBackground) {
      bgImage = `url('${verticalBackground}')`;
    }

    if (bgImage) {
      document.body.style.backgroundImage = bgImage;
    }
  }, [horizontalBackground, verticalBackground, isVertical]);

  useLayoutEffect(() => {
    document.querySelector('.App').style.opacity = 1;

    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const smallDim = Math.min(w, h);

    document.body.style.color = primaryColor;
    document.body.style.fontSize = `${Math.max(1, Math.floor(smallDim / 50))}px`;

    if (!showInstagramIcon) {
      document.querySelector('#logo').style.display = 'none';
    }
  }, [primaryColor, showInstagramIcon]);

  const {
    result: {
      data: {
        user,
        posts,
      },
    },
    duration,
    postCount = Math.max(1, Math.floor(duration / 10000)),
  } = media;

  const selectedPosts = posts.slice(0, postCount);
  const pageDuration = Math.floor((duration - 500) / Math.max(1, selectedPosts.length));

  return (
    <div className="App">
      <div className="debug">
        {orientation}
        {`(${width}x${height})`}
      </div>
      <Posts user={user} posts={selectedPosts} pageDuration={pageDuration} />
    </div>
  );
}

function App() {
  const { locale } = useConfig();
  const [lng] = (locale || 'en').split('_');
  const horizontalBackground = useTemplateVal('bg_horizontal');
  const verticalBackground = useTemplateVal('bg_vertical');
  const { result: { data: { user: { pic } = {} } = {} } = {} } = useMedia();

  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);

  // images to preload
  const images = [horizontalBackground, verticalBackground, pic];

  return (
    <I18nextProvider i18n={i18n}>
      <Loader
        reveal
        fonts={fonts}
        images={images}
      >
        <Content />
      </Loader>
    </I18nextProvider>
  );
}

export default App;

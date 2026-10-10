import { useLayoutEffect } from 'react';
import {
  useConfig, useMedia, useTemplateVal, useTemplateBoolVal,
} from '@dsplay/react-template-utils';
import Posts from '../posts';

function App() {
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
    document.querySelector('.App').classList.add('fadeIn');
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

export default App;

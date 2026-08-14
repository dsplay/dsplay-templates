import { useEffect } from 'react';
import { useTemplateVal, useTemplateBoolVal, useConfig, useMedia } from '@dsplay/react-template-utils';
import './style.sass';
import UserProfile from '../user-profile';
import Posts from '../posts';

function App() {
  const { orientation, width, height } = useConfig();
  const isVertical = orientation === 'portrait';

  const horizontalBackground = useTemplateVal('bg_horizontal');
  const verticalBackground = useTemplateVal('bg_vertical');

  const primaryColor = useTemplateVal('primary_color', 'white');
  const userFullNameColor = useTemplateVal('user_full_name_color', primaryColor);
  const secondaryColor = useTemplateVal('secondary_color', '#B9D0FF');
  const userScreenNameColor = useTemplateVal('user_screen_name_color', secondaryColor);
  const showTwitterIcon = useTemplateBoolVal('show_twitter_icon', true);
  const twitterIconColor = useTemplateVal('twitter_icon_color', secondaryColor);

  useEffect(() => {
    if (horizontalBackground) {
      document.body.style.backgroundImage = `url("${horizontalBackground}")`;
      if (verticalBackground && isVertical) {
        document.body.style.backgroundImage = `url("${verticalBackground}")`;
      }
    } else if (verticalBackground) {
      document.body.style.backgroundImage = `url("${verticalBackground}")`;
    }
  }, [horizontalBackground, verticalBackground, isVertical]);

  useEffect(() => {
    document.querySelector('.App').classList.add('fadeIn');
    document.querySelector('.App').style.opacity = 1;

    document.body.style.color = primaryColor;
    document.querySelector('.user-name').style.color = userFullNameColor;
    document.querySelector('.user-screen-name').style.color = userScreenNameColor;

    if (!showTwitterIcon) {
      document.querySelector('#logo').style.display = 'none';
    } else {
      document.querySelector('#logo').style.color = twitterIconColor;
    }
  }, [primaryColor, userFullNameColor, userScreenNameColor, showTwitterIcon, twitterIconColor]);

  const {
    result: {
      data: {
        user,
        posts,
      },
    },
    duration,
    postCount = Math.max(1, Math.floor(duration / 10000)),
  } = useMedia();

  const selectedPosts = posts.slice(0, postCount);
  const pageDuration = Math.floor((duration - 500) / Math.max(1, selectedPosts.length));

  return (
    <div className="App">
      <div id="logo"><i className="flaticon-twitter"></i></div>
      <div className="debug">{orientation}({width}x{height})</div>
      <UserProfile {...user} />
      <Posts posts={selectedPosts} pageDuration={pageDuration} />
    </div>
  );
}

export default App;

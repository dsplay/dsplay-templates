import React from 'react';
import { Render, FitText, screen } from '@dsplay/react-template-utils';
import Info from '../info/info';
import UserProfile from '../user-profile/user-profile';
import MediaSlider from '../media-slider/media-slider';
import useStyle from '../../hooks/use-style';
import useHighlight from '../../hooks/use-highlight';
import './post.sass';

function PostContent({
  text,
}) {
  const {
    textColor,
    textBgColor,
  } = useStyle();

  const style = {
    backgroundColor: text ? textBgColor : 'transparent',
  };

  /* eslint-disable react/no-danger */
  return (
    <div className="text-wrapper" style={style}>
      <FitText>
        <div style={{ color: textColor }} className="post-text" dangerouslySetInnerHTML={{ __html: useHighlight(text) }} />
      </FitText>
    </div>
  );
}

function Post({
  text = '',
  media = [],
  user,
  duration,
  ...info
}) {
  const withMedia = media && media.length > 0;
  const maxMediaToShow = Math.min(media.length, Math.max(1, Math.floor(duration / 1000)));
  let finalText = text;

  const limit = withMedia ? 400 : 700;

  if (finalText.length > limit) {
    finalText = `${text.substr(0, limit)}...`;
  }

  return (
    <div className={`post ${withMedia ? 'with-media' : ''}`}>
      {/* {profileFirst && <UserProfile {...user} />} */}
      <Render notOn={[screen.LANDSCAPE]}>
        <UserProfile {...user} />
      </Render>

      {
        withMedia
        && (
          <MediaSlider
            media={media.slice(0, maxMediaToShow)}
            duration={Math.floor(duration / maxMediaToShow)}
          />
        )
      }

      <div className="content">
        <Render on={[screen.LANDSCAPE]}>
          <UserProfile {...user} />
        </Render>
        <PostContent text={finalText} info={info} />
        <Render notOn={[screen.H_BANNER, screen.SQUARE]}>
          <Info {...info} />
        </Render>
      </div>
      <Render on={[screen.H_BANNER, screen.SQUARE]}>
        <Info {...info} />
      </Render>

    </div>
  );
}

export default Post;

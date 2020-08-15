import React from 'react';
import Info from '../info/info';
import UserProfile from '../user-profile/user-profile';
import MediaSlider from '../media-slider/media-slider';
import { FitText, useScreenInfo} from '@dsplay/react-template-utils';
import { PORTRAIT, BANNER_V, SQUARED, BANNER_H } from '../../util/screen';
import {
  hashtagColor,
  linkColor,
  mentionColor,
  phoneColor,
  textColor,
  textBgColor
} from '../../util/styles';
import './post.sass';

function highlight(text = '') {
  const hashtagRegex = /(#[^\s]+)/g;
  text = text.replace(hashtagRegex, function (url) {
    return `<span class="hashtag" style="color: ${hashtagColor}">${url}</span>`;
  });

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  text = text.replace(urlRegex, function (url) {
    return `<a href="${url}" style="color: ${linkColor};">${url}</a>`;
  });

  const mentionRegex = /(@[^\s]+)/g;
  text = text.replace(mentionRegex, function (url) {
    return `<span class="mention" style="color: ${mentionColor}">${url}</span>`;
  });

  const phoneRegex = /((\+\d{1,3})?\s?(\(\d{2}\))?\s?(\d\s?-?\.?){8,14}(\s|\b))/g;
  text = text.replace(phoneRegex, function (url) {
    return `<span class="mention" style="color: ${phoneColor}">${url}</span>`;
  });

  text = text.replace(/\n/gm, function () {
    return '<br/>';
  });

  return text;
}

function PostContent({
  id,
  text,
  info,
}) {

  const style = {
    backgroundColor: text ? textBgColor : 'transparent', 
  }

  return (
    <div className="text-wrapper" style={style}>
      <FitText>
        <div style={{ color: textColor }} className="post-text" dangerouslySetInnerHTML={{ __html: highlight(text) }} />
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
  const { screenFormat } = useScreenInfo();
  const profileFirst = screenFormat === PORTRAIT || screenFormat === BANNER_V || screenFormat === BANNER_H || screenFormat === SQUARED;
  const infoOutsideContent = screenFormat === SQUARED || screenFormat === BANNER_H;

  const limit = withMedia ? 400 : 700;

  if (finalText.length > limit) {
    finalText = text.substr(0, limit) + '...';
  }

  return (
    <div className={`post ${withMedia ? 'with-media' : ''}`}>
      {profileFirst && <UserProfile {...user} />}

      {withMedia && <MediaSlider media={media.slice(0, maxMediaToShow)} duration={Math.floor(duration / maxMediaToShow)} />}

      <div className="content">
        {!profileFirst && <UserProfile {...user} />}
        <PostContent text={finalText} info={info} />
        {!infoOutsideContent && <Info {...info} />}
      </div>
      {infoOutsideContent && <Info {...info} />}

    </div>
  )
}

export default Post;
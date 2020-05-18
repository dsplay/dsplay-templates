import React from 'react';
import { tval, tbval } from '@dsplay/template-utils';
import Info from '../info/info';
import UserProfile from '../user-profile/user-profile';
import MediaSlider from '../media-slider/media-slider';
import './post.sass';
import FitText from '../fit-text/fit-text';
import { useScreenInfo, PORTRAIT, BANNER_V } from '../../util/screen';

const primaryColor = tval('primary_color', 'white');
const secondaryColor = tval('secondary_color', '#FFFF99');
const hashtagColor = tval('hashtag_color', secondaryColor);
const linkColor = tval('link_color', '#B9D0FF');
const mentionColor = tval('mention_color', secondaryColor);
const phoneColor = tval('phone_color', secondaryColor);
const textColor = tval('text_color', primaryColor);
const showInfo = tbval('show_info', true);

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

  return (
    <>
      <div className="text-wrapper">
        <FitText>
          <div style={{ color: textColor }} className="post-text" dangerouslySetInnerHTML={{ __html: highlight(text) }} />
        </FitText>
      </div>
      {showInfo && <Info {...info} />}
    </>
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
  const portrait = screenFormat === PORTRAIT || screenFormat === BANNER_V;

  const limit = withMedia ? 400 : 700;

  if (finalText.length > limit) {
    finalText = text.substr(0, limit) + '...';
  }

  return (
    <div className={`post ${withMedia ? 'with-media' : ''}`}>
      {portrait && <UserProfile {...user} />}

      {withMedia && <MediaSlider media={media.slice(0, maxMediaToShow)} duration={Math.floor(duration / maxMediaToShow)} />}

      <div className="content">
        {!portrait && <UserProfile {...user} />}
        <PostContent text={finalText} info={info} />
      </div>

    </div>
  )
}

export default Post;
import {
  Fragment, useCallback, useEffect, useRef, useState,
} from 'react';
import { useTemplateVal, useTemplateBoolVal } from '@dsplay/react-template-utils';
import Info from '../info';
import UserProfile from '../user-profile';
import MediaSlider from '../media-slider';

const overlayStyle = {
  'top-right': {
    top: 0,
    right: 0,
  },
  'bottom-right': {
    bottom: 0,
    right: 0,
  },
  'bottom-left': {
    bottom: 0,
    left: 0,
  },
  'top-left': {
    top: 0,
    left: 0,
  },
  center: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
  },
};

function highlight(text = '', {
  hashtagColor, linkColor, mentionColor, phoneColor,
}) {
  let result = text;

  const hashtagRegex = /(#[^\s]+)/g;
  result = result.replace(hashtagRegex, (url) => `<span class="hashtag" style="color: ${hashtagColor}">${url}</span>`);

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  result = result.replace(urlRegex, (url) => `<a href="${url}" style="color: ${linkColor};">${url}</a>`);

  const mentionRegex = /(@[^\s]+)/g;
  result = result.replace(mentionRegex, (url) => `<span class="mention" style="color: ${mentionColor}">${url}</span>`);

  const phoneRegex = /((\+\d{1,3})?\s?(\(\d{2}\))?\s?(\d\s?-?\.?){8,14}(\s|\b))/g;
  result = result.replace(phoneRegex, (url) => `<span class="mention" style="color: ${phoneColor}">${url}</span>`);

  result = result.replace(/\n/gm, () => '<br/>');

  return result;
}

function PostContent({
  id,
  text,
  info,
  ratio,
  showInfo,
  textColor,
  highlightColors,
}) {
  return (
    <Fragment>
      <div className="text-wrapper" key={id}>
        <div className="text-ratio" style={{ fontSize: `${ratio}em` }}>
          { }
          <div style={{ color: textColor }} className="post-text" dangerouslySetInnerHTML={{ __html: highlight(text, highlightColors) }} />
        </div>
      </div>
      { showInfo && <Info {...info} /> }
    </Fragment>
  );
}

// A video plays its own file when the answer brings one (`videoUrl`). Until it really plays it looks as before (poster and
// play icon), so a video that never starts (blocked, stalled) or fails (the signed url expired) still reads as a video.
function PostVideo({ src, poster, onFail }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const video = ref.current;
    // React sets `muted` only as a property; some WebView autoplay policies read the attribute.
    video.muted = true;
    video.setAttribute('muted', '');
    const playing = video.play();
    if (playing && playing.catch) playing.catch(onFail);
  }, [src, onFail]);

  return (
    <Fragment>
      <video ref={ref} className="media-video" src={src} poster={poster} muted autoPlay loop playsInline onPlaying={() => setStarted(true)} onError={onFail} />
      { !started && <div className="playWrapper" /> }
    </Fragment>
  );
}

function PostMedia({
  type,
  urls: {
    md: url,
  },
  videoUrl,
  borderColor,
  overlay,
  overlayPosition,
}) {
  const [failedUrl, setFailedUrl] = useState(null);
  const fail = useCallback(() => setFailedUrl(videoUrl), [videoUrl]);
  const playable = type === 'video' && !!videoUrl && failedUrl !== videoUrl;

  return (
    <div className="media" style={{ borderColor }}>
      { playable
        ? <PostVideo src={videoUrl} poster={url} onFail={fail} />
        : <div className="media-pic" style={{ backgroundImage: `url("${url}")` }} /> }
      { type === 'video' && !playable && <div className="playWrapper" /> }
      { overlay && <img alt="overlay" className="photo-overlay" src={overlay} style={{ ...overlayStyle[overlayPosition] }} /> }
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
  const primaryColor = useTemplateVal('primary_color', 'white');
  const secondaryColor = useTemplateVal('secondary_color', '#FFFF99');
  const hashtagColor = useTemplateVal('hashtag_color', secondaryColor);
  const linkColor = useTemplateVal('link_color', '#B9D0FF');
  const mentionColor = useTemplateVal('mention_color', secondaryColor);
  const phoneColor = useTemplateVal('phone_color', secondaryColor);
  const textColor = useTemplateVal('text_color', primaryColor);
  const showInfo = useTemplateBoolVal('show_info', true);
  const borderColor = useTemplateVal('border_color', secondaryColor);
  const overlay = useTemplateVal('overlay');
  const overlayPosition = useTemplateVal('overlay_position', 'top-left');

  const withMedia = media && media.length > 0;

  const sizeMap = {
    20: 2.5,
    50: 2.2,
    75: 1.9,
    100: 1.6,
    140: 1.3,
    200: 1,
  };

  let ratio = 1;

  const textLength = text.length + (text.match(/\n/g) || []).length * 35;

  const sizeKeys = Object.keys(sizeMap);
  for (let i = 0; i < sizeKeys.length; i += 1) {
    if (textLength <= +sizeKeys[i]) {
      ratio = sizeMap[sizeKeys[i]];
      break;
    }
  }

  const maxMediaToShow = Math.min(media.length, Math.max(1, Math.floor(duration / 1000)));

  return (
    <div className={`post ${withMedia ? 'with-media' : ''}`}>
      <UserProfile className="portrait" {...user} />

      { withMedia && media[0].type === 'image' && media.length > 1 && <MediaSlider media={media.slice(0, maxMediaToShow)} duration={Math.floor(duration / maxMediaToShow)} /> }
      { (withMedia && (media[0].type === 'video' || media.length === 1)) && <PostMedia {...media[0]} borderColor={borderColor} overlay={overlay} overlayPosition={overlayPosition} /> }

      <div className="content">
        <UserProfile className="landscape" {...user} />
        <PostContent
          text={text}
          info={info}
          ratio={ratio}
          showInfo={showInfo}
          textColor={textColor}
          highlightColors={{
            hashtagColor, linkColor, mentionColor, phoneColor,
          }}
        />
      </div>
    </div>
  );
}

export default Post;

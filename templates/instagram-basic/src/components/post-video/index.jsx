import {
  Fragment, useCallback, useEffect, useRef, useState,
} from 'react';

// A video post's own file, drawn over its poster (the parent's background image). Until it really plays it looks as
// before (poster and play icon), and when it is refused or fails (the signed url expired) it goes back to that look, so
// a video that never starts still reads as a video. Mount it with `key={src}` so a new video starts afresh.
function PostVideo({ src, poster }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const fail = useCallback(() => setFailed(true), []);

  useEffect(() => {
    const video = ref.current;
    // React sets `muted` only as a property; some WebView autoplay policies read the attribute.
    video.muted = true;
    video.setAttribute('muted', '');
    const playing = video.play();
    if (playing && playing.catch) playing.catch(fail);
  }, [fail]);

  return (
    <Fragment>
      { !failed && <video ref={ref} className="media-video" src={src} poster={poster} muted autoPlay loop playsInline onPlaying={() => setStarted(true)} onError={fail} /> }
      { (!started || failed) && <div className="playWrapper" /> }
    </Fragment>
  );
}

/** What a media item draws over its picture: its video when it has one, the play icon for a video that has none. */
export function VideoLayer({ type, videoUrl, poster }) {
  if (type !== 'video') return null;
  return videoUrl ? <PostVideo key={videoUrl} src={videoUrl} poster={poster} /> : <div className="playWrapper" />;
}

export default PostVideo;

import { tbval } from '@dsplay/template-utils';
import UserProfile from '../user-profile';
import MediaSlider from '../media-slider';

const showUserInfo = tbval('show_user_info', true);

function PostMedia({
  type,
  urls: {
    md: url,
  },
}) {
  return (
    <>
      <div className="media" style={{ backgroundImage: `url("${url}")` }} />
      {(type === 'video') && <div className="playWrapper" />}
    </>
  );
}

function Post({
  media,
  user,
  duration,
}) {
  const withMedia = media && media.length > 0;
  const maxMediaToShow = Math.min(media.length, Math.max(1, Math.floor(duration / 1000)));

  return (
    <div className={`post ${withMedia ? 'with-media' : ''}`}>
      {showUserInfo
        && (
          <div className="content portrait">
            <UserProfile {...user} />
          </div>
        )}

      {withMedia && media[0].type === 'image' && media.length > 1 && <MediaSlider media={media.slice(0, maxMediaToShow)} duration={Math.floor(duration / maxMediaToShow)} />}
      {(withMedia && (media[0].type === 'video' || media.length === 1)) && <PostMedia {...media[0]} />}

      <div className="content landscape">
        {showUserInfo && <UserProfile className="landscape" {...user} />}
      </div>
    </div>
  );
}

export default Post;

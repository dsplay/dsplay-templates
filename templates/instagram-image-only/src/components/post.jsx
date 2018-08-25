import React from 'react';
import UserProfile from './user-profile';
import MediaSlider from './media-slider';
import { tbval } from '../util/template';

const showUserInfo = tbval('show_user_info', true);

const PostMedia = ({
    type,
    urls: {
        md: url,
    },
}) => (
    <React.Fragment>
    <div className="media" style={{ backgroundImage: `url("${url}")`}}>
    </div>
        { (type === 'video') && <div className="playWrapper"/> }
    </React.Fragment>
);

function Post({
    media,
    user,
    duration,
    ...info
}) {

    const withMedia = media && media.length > 0;
    const maxMediaToShow = Math.min(media.length, Math.max(1, Math.floor(duration / 1000)));

    return (
        <div className={`post ${withMedia ? 'with-media' : ''}`}>
            { showUserInfo && 
                <div className="content portrait">
                    <UserProfile {...user} />
                </div>
            }

            { withMedia && media[0].type === 'image' && media.length > 1 && <MediaSlider media={media.slice(0, maxMediaToShow)} duration={Math.floor(duration / maxMediaToShow)} /> }
            { (withMedia && (media[0].type === 'video' || media.length === 1 )) && <PostMedia {...media[0]} /> }
            
            <div className="content landscape">
                { showUserInfo && <UserProfile className="landscape" {...user} /> }
            </div>

        </div>
    )
}

export default Post;
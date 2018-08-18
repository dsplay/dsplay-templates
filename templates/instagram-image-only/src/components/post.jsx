import React from 'react';
import UserProfile from './user-profile';
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
    ...info
}) {

    const withMedia = media && media.length > 0;

    return (
        <div className={`post ${withMedia ? 'with-media' : ''}`}>
            { showUserInfo && 
                <div className="content portrait">
                    <UserProfile {...user} />
                </div>
            }

            { withMedia && <PostMedia {...media[0]} /> }
            
            <div className="content landscape">
                { showUserInfo && <UserProfile className="landscape" {...user} /> }
            </div>

        </div>
    )
}

export default Post;
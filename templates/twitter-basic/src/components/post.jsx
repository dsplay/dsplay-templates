import React from 'react';
import Info from './info';

function highlight(text = '') {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    text = text.replace(urlRegex, function(url) {
        return '<a href="' + url + '">' + url + '</a>';
    });

    const hashtagRegex = /(#[^\s]+)/g;
    text = text.replace(hashtagRegex, function(url) {
        return '<span class="hashtag"' + url + '">' + url + '</span>';
    });

    const mentionRegex = /(@[^\s]+)/g;
    text = text.replace(mentionRegex, function(url) {
        return '<span class="mention"' + url + '">' + url + '</span>';
    });

    return text;
}

function PostContent({
    text,
    info,
    ratio,
}) {
    return (
        <React.Fragment>
            <div className="text-wrapper" key={info.link}>
                <div className="text-ratio" style={{ fontSize: `${ratio}em` }}>
                    <div className="post-text" dangerouslySetInnerHTML={{ __html: highlight(text) }} />
                </div>
            </div> 
            <Info {...info} />
        </React.Fragment>
    );
}


function Post({
    text = '',
    media,
    ...info
}) {

    const withMedia = media && media.length > 0;

    // text = '';
    // for (let i = 0; i < 280; i++) {
    //     text += 'W';
    // }

    const sizeMap = {
        '20': 3,
        '50': 2.5,
        '75': 2.3,
        '100': 2,
        '140': 1.5,
        '200': 1,
    };

    let ratio = 1;

    const sizeKeys = Object.keys(sizeMap);
    for (let i = 0; i < sizeKeys.length; i++) {
        if (text.length <= +sizeKeys[i]) {
            ratio = sizeMap[sizeKeys[i]];
            break;
        }
    }

    return (
        <div className={`post ${withMedia ? 'with-media' : ''}`}>

            { withMedia && <div className="media portrait" style={{ backgroundImage: `url("${media[0].urls.md}")`}} /> }
            
            <div className="content">
                <PostContent text={text} info={info} ratio={ratio} />
            </div>

            { withMedia && <div className="media landscape" style={{ backgroundImage: `url("${media[0].urls.md}")`}} /> }
            
        </div>
    )
}

export default Post;
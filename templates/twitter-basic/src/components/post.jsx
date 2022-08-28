import React from 'react';
import Info from './info';
import { tval } from '@dsplay/template-utils';

const hashtagColor = tval('hashtag_color', '#FFFF99');
const linkColor = tval('link_color', '#B9D0FF');
const mentionColor = tval('mention_color', '#FFFF99');
const primaryColor = tval('primary_color', 'white');
const textColor = tval('text_color', primaryColor);

function highlight(text = '') {

    const hashtagRegex = /(#[^\s]+)/g;
    text = text.replace(hashtagRegex, function(url) {
        return `<span class="hashtag" style="color: ${hashtagColor}">${url}</span>`;
    });

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    text = text.replace(urlRegex, function(url) {
        return `<a href="${url}" style="color: ${linkColor};">${url}</a>`;
    });

    const mentionRegex = /(@[^\s]+)/g;
    text = text.replace(mentionRegex, function(url) {
        return `<span class="mention" style="color: ${mentionColor}">${url}</span>`;
    });

    return text;
}

function PostContent({
    id,
    text,
    info,
    ratio,
}) {
    return (
        <React.Fragment>
            <div className="text-wrapper" key={id}>
                <div className="text-ratio" style={{ fontSize: `${ratio}em` }}>
                    <div style={{ color: textColor }} className="post-text" dangerouslySetInnerHTML={{ __html: highlight(text) }} />
                </div>
            </div> 
            <Info {...info} />
        </React.Fragment>
    );
}

const PostMedia = ({
    type,
    urls: {
        md: url,
    },
    className,
}) => (
    <div className={`media ${className}`} style={{ backgroundImage: `url("${url}")`}}>
        { type === 'video' && <div className="playWrapper"/> }
    </div>
);



function Post({
    text = '',
    media,
    id,
    ...info
}) {

    const withMedia = media && media.length > 0;

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

            { withMedia && <PostMedia {...media[0]} className="portrait" /> }
            
            <div className="content">
                <PostContent id={id} text={text} info={info} ratio={ratio} />
            </div>

            { withMedia && <PostMedia {...media[0]} className="landscape" /> }
            
        </div>
    )
}

export default Post;
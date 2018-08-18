import React, { Component } from 'react';
import './App.css';
import UserProfile from './components/user-profile';
import Posts from './components/posts';
import { tval, tbval } from './util/template';

const { orientation } = window.dsplay_config || window.config;

// one time template config
const horizontalBackground = tval('bg_horizontal');
const verticalBackground = tval('bg_vertical');

if (horizontalBackground) {
    document.body.style.backgroundImage = `url("${horizontalBackground}")`;
    if (verticalBackground && orientation === 'portrait') {
        document.body.style.backgroundImage = `url("${verticalBackground}")`;    
    }
} else if (verticalBackground) {
    document.body.style.backgroundImage = `url("${verticalBackground}")`;
}


class App extends Component {
    componentDidMount() {
        document.querySelector('.App').classList.add('fadeIn');
        document.querySelector('.App').style.opacity = 1;

        const primaryColor = tval('primary_color', 'white');
        document.body.style.color = primaryColor;
        document.querySelector('.user-name').style.color = tval('user_full_name_color', primaryColor);

        const secondaryColor = tval('secondary_color', '#B9D0FF');
        document.querySelector('.user-screen-name').style.color = tval('user_screen_name_color', secondaryColor);

        if (!tbval('show_twitter_icon', true)) {
            document.querySelector('#logo').style.display = 'none';
        } else {
            document.querySelector('#logo').style.color = tval('twitter_icon_color', secondaryColor);
        }
        
    }

    render() {

        const {
            result: {
                data: {
                    user,
                    posts,
                }
            },
            duration,
            postCount = Math.max(1, Math.floor(duration / 10000)),
        } = window.dsplay_media || window.media;

        const {
            width,
            height,
        } = window.dsplay_config || window.config;

        const selectedPosts = posts.slice(0, postCount);
        const pageDuration = Math.floor((duration - 500) / Math.max(1, selectedPosts.length));

        
        return (
            <div className="App">
                 <div id="logo"><i className="flaticon-twitter"></i></div>
                <div className="debug">{orientation}({width}x{height})</div>
                <UserProfile {...user} />
                <Posts posts={selectedPosts} pageDuration={pageDuration}/>
            </div>
        );
    }
}

export default App;

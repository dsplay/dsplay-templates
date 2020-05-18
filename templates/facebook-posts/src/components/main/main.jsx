import React from 'react';
import {
  // values
  media, // current media
  config, // player configuration
  template, // custom template values
  // utility functions
  tval, // custom template string value
  tbval, // custom template boolean value
  tival, // custom template int value
  tfval, // custom template float value
  isVertical, // boolean flag to indicate screen orientation

} from '@dsplay/template-utils';
import logo from '../../images/fb-logo.png';
import FitText from '../fit-text/fit-text';
import Posts from '../posts/posts';
import './main.sass';

const { orientation, locale } = config;

// one time template config
const horizontalBackground = tval('bg_horizontal');
const verticalBackground = tval('bg_vertical');
const showLogo = tbval('show_logo', true);
const showInfo = tbval('show_info', true);

if (horizontalBackground) {
  document.body.style.backgroundImage = `url("${horizontalBackground}")`;
  if (verticalBackground && orientation === 'portrait') {
    document.body.style.backgroundImage = `url("${verticalBackground}")`;
  }
} else if (verticalBackground) {
  document.body.style.backgroundImage = `url("${verticalBackground}")`;
}

const {
  result: {
    data: {
      user,
      posts,
    }
  },
  duration,
  postCount = Math.max(1, Math.floor(duration / 10000)),
} = media;

const {
  width,
  height,
} = config;

// console.log(postCount);

const selectedPosts = posts.slice(0, postCount);
// const selectedPosts = posts.slice(6, 7);

// console.log(selectedPosts);
const pageDuration = Math.floor((duration - 500) / Math.max(1, selectedPosts.length));
// console.log(pageDuration);

function Main() {
  return (
    <div className={`main ${showInfo ? '' : 'no-info'}`}>
      {
        showLogo && showInfo &&
        <img className="logo" alt="logo" src={logo} />
      }
      <Posts user={user} posts={selectedPosts} pageDuration={pageDuration} />
    </div>
  );
}

export default Main;
import React from 'react';
import {
  media, // current media
  tbval, // custom template boolean value
} from '@dsplay/template-utils';
import logo from '../../images/logo.png';
import Posts from '../posts/posts';
import './main.sass';

const showLogo = tbval('show_logo', true);

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

const selectedPosts = posts.slice(0, postCount);
// const selectedPosts = posts.slice(8, 9);

// console.log(selectedPosts);
const pageDuration = Math.floor((duration - 500) / Math.max(1, selectedPosts.length));
// console.log(pageDuration);

function Main() {
  return (
    <div className="main">
      {
        showLogo &&
        <img className="logo" alt="logo" src={logo} />
      }
      <Posts user={user} posts={selectedPosts} pageDuration={pageDuration} />
    </div>
  );
}

export default Main;
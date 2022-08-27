import React, { Component } from 'react';
import { config, media, isVertical, tval, tbval } from '@dsplay/template-utils';
import './App.css';
import Posts from './components/posts';

const {
  orientation,
  width,
  height,
} = config;

// one time template config
const horizontalBackground = tval('bg_horizontal');
const verticalBackground = tval('bg_vertical');
let bgImage = null;
if (horizontalBackground) {
  bgImage = `url('${horizontalBackground}')`;
  if (verticalBackground && isVertical) {
    bgImage = `url('${verticalBackground}')`;
  }
} else if (verticalBackground) {
  bgImage = `url('${verticalBackground}')`;
}

if (bgImage) {
  document.body.style.backgroundImage = bgImage;
  console.log(`insta_bg: ${document.body.style.backgroundImage} - url('${horizontalBackground}')`);
}

const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const smallDim = Math.min(w, h);

class App extends Component {
  componentDidMount() {
    document.querySelector('.App').classList.add('fadeIn');
    document.querySelector('.App').style.opacity = 1;

    const primaryColor = tval('primary_color', 'white');
    document.body.style.color = primaryColor;
    document.body.style.fontSize = `${Math.max(1, Math.floor(smallDim / 50))}px`;

    if (!tbval('show_instagram_icon', true)) {
      document.querySelector('#logo').style.display = 'none';
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
    } = media;

    // console.log(postCount);

    const selectedPosts = posts.slice(0, postCount);
    // const selectedPosts = posts.slice(4, 5);

    // console.log(selectedPosts);
    const pageDuration = Math.floor((duration - 500) / Math.max(1, selectedPosts.length));
    // console.log(pageDuration);

    return (
      <div className="App">
        <div className="debug">{orientation}({width}x{height})</div>
        <Posts user={user} posts={selectedPosts} pageDuration={pageDuration} />
      </div>
    );
  }
}

export default App;

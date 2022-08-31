import React, { useMemo } from 'react';
import moment from 'moment';
import { useMedia, useConfig, useTemplateBoolVal } from '@dsplay/react-template-utils';
import logo from '../../images/logo.png';
import Posts from '../posts/posts';
import './main.sass';

function Main() {
  const showLogo = useTemplateBoolVal('show_logo', true);
  const { locale = 'en' } = useConfig();
  const lng = useMemo(() => locale.split('_')[0], [locale]);
  if (lng) {
    moment.locale(lng);
  }

  const {
    result: {
      data: {
        user,
        posts,
      },
    },
    duration,
    postCount = Math.max(1, Math.floor(duration / 10000)),
  } = useMedia();

  moment.locale('en');

  const selectedPosts = posts.slice(0, postCount);
  // const selectedPosts = posts.slice(8, 9);

  // console.log(selectedPosts);
  const pageDuration = Math.floor((duration - 500) / Math.max(1, selectedPosts.length));
  // console.log(pageDuration);

  return (
    <div className="main">
      {
        showLogo
        && <img className="logo" alt="logo" src={logo} />
      }
      <Posts user={user} posts={selectedPosts} pageDuration={pageDuration} />
    </div>
  );
}

export default Main;

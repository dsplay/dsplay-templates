import React, { useState } from 'react';
import { useInterval } from '@dsplay/react-template-utils';
import Post from '../post/post';

function Posts({
  user,
  posts,
  pageDuration,
}) {
  const [index, setIndex] = useState(0);

  useInterval(() => {
    setIndex((index + 1) % posts.length);
  }, pageDuration);

  if (index === -1) return null;

  return (
    <Post className="fade-in" key={index} duration={pageDuration} {...posts[index]} user={user} />
  );
}

export default Posts;

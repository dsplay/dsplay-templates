import React, { useState, useEffect } from 'react';
import Post from '../post/post';
import { useInterval } from '../../hooks/use-interval';

function Posts({
  user,
  posts,
  pageDuration,
}) {
  const [index, setIndex] = useState(0);

  console.log('posts:', posts.length);

  useInterval(() => {
    setIndex((index + 1) % posts.length);
  }, pageDuration);

  if (index === -1) return null;

  return (
    <Post className="fade-in" key={index} duration={pageDuration} {...posts[index]} user={user} />
  );
}

export default Posts;
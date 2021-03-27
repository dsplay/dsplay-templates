import React from 'react';
import {
  useMedia,
  useTemplateVal,
} from '@dsplay/react-template-utils';
import './main.sass';

const bgSizeMap = {
  cover: 'cover',
  contain: 'contain',
  stretch: '100% 100%',
};

function Main() {
  const media = useMedia();
  const backgroundSize = bgSizeMap[useTemplateVal('fit')] || 'cover';

  const style = {
    backgroundImage: `url("${media.imagePath}")`,
    backgroundSize,
  };

  return (
    <div className="main" style={style} />
  );
}

export default Main;

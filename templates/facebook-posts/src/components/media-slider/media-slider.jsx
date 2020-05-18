import React, { useState, useCallback } from 'react';
import { tval } from '@dsplay/template-utils';
import { useInterval } from '../../hooks/use-interval';
import './media-slider.sass';

const secondaryColor = tval('secondary_color', '#55F');
const borderColor = tval('border_color', secondaryColor);
const overlay = tval('overlay');
const overlayPosition = tval('overlay_position', 'top-left');
const imageFit = tval('image_fit', 'cover');

const overlayStyle = {
  'top-right': {
    top: 0,
    right: 0,
  },
  'bottom-right': {
    bottom: 0,
    right: 0,
  },
  'bottom-left': {
    bottom: 0,
    left: 0,
  },
  'top-left': {
    top: 0,
    left: 0,
  },
  'center': {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
  },
}

function MediaItem({
  type,
  urls: {
    lg: url,
  } = {},
}) {

  const sizeMap = {
    contain: 'contain',
    cover: 'cover',
    stretch: '100% 100%',
  };

  const backgroundSize = sizeMap[imageFit] || 'cover';

  return (
    <div className="media-item-container" >
      {imageFit === 'contain' && <div className="media-item-bg" style={{ backgroundImage: `url('${url}')`, backgroundSize: 'cover' }} />}
      <div className="media-item" style={{ backgroundImage: `url('${url}')`, backgroundSize }} >
        {type === 'video' && <div className="playWrapper" />}
        {overlay && <img alt="overlay" className="photo-overlay" style={{ ...overlayStyle[overlayPosition] }} src={overlay} />}
      </div>
    </div>
  );
}

function MediaSlider({
  media = [],
  duration,
}) {
  const size = media.length;

  const [state, setState] = useState({
    idx1: 0,
    idx2: 1,
  });

  const [sliding, setSliding] = useState(false);

  const { idx1, idx2 } = state;

  const slide = useCallback(() => {
    setSliding(true);

    setTimeout(() => {
      setState(currState => ({
        idx1: (currState.idx1 + 1) % size,
        idx2: (currState.idx2 + 1) % size,
      }));
      setSliding(false);
    }, 1000);
  }, [size]);

  useInterval(() => {
    if (size > 1) {
      slide();
    }
  }, duration);

  return (
    <div className="media" style={{ borderColor: borderColor }}>
      <div className={`media-slider ${sliding ? 'slide' : ''}`}>
        <MediaItem key={media[idx1].id} {...media[idx1]} />
        {size > 1 && <MediaItem key={media[idx2].id} {...media[idx2]} />}
      </div>
    </div>
  );

}

export default MediaSlider;
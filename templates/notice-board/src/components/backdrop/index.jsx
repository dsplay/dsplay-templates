import { useState } from 'react';
import './style.sass';

// A backdrop (a photo, or the first page of a PDF) is what the whole post is drawn over: a blurred copy fills the region, the picture sits on it whole
// (cropped to fill only when its shape is close to the region's), and a soft scrim keeps the text readable. It is not the small picture beside the text.
function Backdrop({ source, width, height }) {
  const [fit, setFit] = useState('contain');
  // A backdrop that cannot load leaves the post on its own background.
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  const onLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    const ratio = (naturalWidth / naturalHeight) / (width / height);
    setFit(ratio > 0.75 && ratio < 1.33 ? 'cover' : 'contain');
  };

  return (
    <div className="backdrop">
      <img className="fill" alt="" src={source} />
      <img className="whole" alt="" src={source} style={{ objectFit: fit }} onLoad={onLoad} onError={() => setFailed(true)} />
      <div className="scrim" />
    </div>
  );
}

export default Backdrop;

import { useState } from 'react';
import { useView } from '../../hooks/view-context';
import Logo from '../logo';
import Photo from '../photo';
import './style.sass';

/** A thumbnail: the photo with a radius, flat. A missing or broken image leaves a plain base-colored square with the small logo. */
function Thumb({ src, size }) {
  const { theme, settings } = useView();
  const [failed, setFailed] = useState('');
  const radius = `${settings.rounded ? 1.2 : 0.4}rem`;
  const showImage = src && failed !== src;
  return (
    <div
      className="thumb"
      style={{
        width: `${size}rem`, height: `${size}rem`, borderRadius: radius, backgroundColor: theme.base,
      }}
    >
      {showImage
        ? <Photo small src={src} frameRatio={1} radius={radius} onError={() => setFailed(src)} />
        : <Logo height={size / 2} maxWidth={size - 4} noDefault />}
    </div>
  );
}

export default Thumb;

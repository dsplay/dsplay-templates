import { useState } from 'react';
import { useView } from '../../hooks/view-context';
import defaultLogo from '../../assets/image/dsplay-logo-header.svg';
import './style.sass';

/**
 * The company logo: the operator's (upload, else public link, see `useLogo`), else the standard DSPLAY logo bundled with the
 * template (never fetched, so it also shows offline). While the operator's logo resolves (up to 8 s) its room is reserved and
 * empty, so the wrong logo never flashes. `noDefault`: for places that must not show the DSPLAY logo (thumbnail fallback).
 */
function Logo({
  height, maxWidth, className, noDefault,
}) {
  const { logo } = useView();
  const [broken, setBroken] = useState('');
  if (logo.pending) {
    return <span className={`logo reserved ${className || ''}`} style={{ width: `${height}rem`, height: `${height}rem` }} />;
  }
  const src = logo.src && broken !== logo.src ? logo.src : (noDefault ? '' : defaultLogo);
  if (!src) {
    return null;
  }
  return (
    <img
      className={`logo ${className || ''}`}
      src={src}
      alt=""
      style={{ height: `${height}rem`, maxWidth: `${maxWidth || height * 4}rem` }}
      onError={() => setBroken(logo.src)}
    />
  );
}

export default Logo;

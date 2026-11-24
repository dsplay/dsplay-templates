import { useContext } from 'react';
import { FitText as LibraryFitText, LoaderContext } from '@dsplay/react-template-utils';

/**
 * The shared `FitText`, which stays hidden until its size is calculated (the local copy showed the first, giant size
 * for as long as the calculation took), measured again once the Loader has revealed the template: the first
 * measurement happens while the fonts are still loading, so it would use the fallback face.
 */
function FitText({ children }) {
  const { ready } = useContext(LoaderContext);

  return <LibraryFitText key={ready ? 'fonts-in' : 'fonts-loading'}>{children}</LibraryFitText>;
}

export default FitText;

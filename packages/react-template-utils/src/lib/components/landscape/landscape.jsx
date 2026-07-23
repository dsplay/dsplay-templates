import React from 'react';
import Render from '../render/render';
import { LANDSCAPE } from '../../utils/screen';

/**
 * Renders its children only when the screen format is landscape.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode | null}
 */
function Landscape({
  children,
}) {
  return (
    <Render on={[LANDSCAPE]}>
      {children}
    </Render>
  );
}

export default Landscape;

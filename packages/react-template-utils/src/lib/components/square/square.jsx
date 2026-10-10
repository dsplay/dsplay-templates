import React from 'react';
import Render from '../render/render';
import { SQUARE } from '../../utils/screen';

/**
 * Renders its children only when the screen format is square.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode | null}
 */
function Square({
  children,
}) {
  return (
    <Render on={[SQUARE]}>
      {children}
    </Render>
  );
}

export default Square;

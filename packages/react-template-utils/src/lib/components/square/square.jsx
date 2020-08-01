import React from 'react';
import Render from '../render/render';
import { SQUARE } from '../../utils/screen';

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

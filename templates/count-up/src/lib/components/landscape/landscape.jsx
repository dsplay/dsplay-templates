import React from 'react';
import Render from '../render/render';
import { LANDSCAPE } from '../../utils/screen';

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

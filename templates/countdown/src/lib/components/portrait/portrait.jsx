import React from 'react';
import Render from '../render/render';
import { PORTRAIT } from '../../utils/screen';

function Portrait({
  children,
}) {
  return (
    <Render on={[PORTRAIT]}>
      {children}
    </Render>
  );
}

export default Portrait;

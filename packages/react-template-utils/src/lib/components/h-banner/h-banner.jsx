import React from 'react';
import Render from '../render/render';
import { H_BANNER } from '../../utils/screen';

function HBanner({
  children,
}) {
  return (
    <Render on={[H_BANNER]}>
      {children}
    </Render>
  );
}

export default HBanner;

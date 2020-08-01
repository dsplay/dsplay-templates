import React from 'react';
import Render from '../render/render';
import { V_BANNER } from '../../utils/screen';

function VBanner({
  children,
}) {
  return (
    <Render on={[V_BANNER]}>
      {children}
    </Render>
  );
}

export default VBanner;

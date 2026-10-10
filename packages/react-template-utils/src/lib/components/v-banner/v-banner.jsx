import React from 'react';
import Render from '../render/render';
import { V_BANNER } from '../../utils/screen';

/**
 * Renders its children only when the screen format is a vertical banner.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode | null}
 */
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

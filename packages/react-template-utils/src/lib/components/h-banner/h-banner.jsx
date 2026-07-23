import React from 'react';
import Render from '../render/render';
import { H_BANNER } from '../../utils/screen';

/**
 * Renders its children only when the screen format is a horizontal banner.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode | null}
 */
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

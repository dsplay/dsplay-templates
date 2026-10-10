import React from 'react';
import Render from '../render/render';
import { PORTRAIT } from '../../utils/screen';

/**
 * Renders its children only when the screen format is portrait.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode | null}
 */
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

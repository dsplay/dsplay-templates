import { useState } from 'react';

/** The headline stays still; a change is a crossfade between two layers (opacity only, 800 ms). */
function Headline({ text, animate }) {
  const [state, setState] = useState({ layers: [text, ''], active: 0 });

  // adjust state while rendering (React's documented pattern for "state derived from a prop")
  if (state.layers[state.active] !== text) {
    setState({
      layers: state.active === 0 ? [state.layers[0], text] : [text, state.layers[1]],
      active: 1 - state.active,
    });
  }

  const cls = animate ? 'layer fade' : 'layer';
  return (
    <div className="headline">
      {[0, 1].map((n) => (
        <div key={n} className={cls} style={{ opacity: state.active === n ? 1 : 0 }}>{state.layers[n]}</div>
      ))}
    </div>
  );
}

export default Headline;

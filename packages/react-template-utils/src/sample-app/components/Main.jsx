import React, { useMemo, useState } from 'react';
import { Landscape, Portrait, HBanner, VBanner, FitText, useInterval, Render } from '../../lib';
import { LANDSCAPE, PORTRAIT, V_BANNER } from '../../lib/utils/screen';

function Main() {

  const boxStyle = {
    border: '1px solid black',
    width: '50%',
    minWidth: '50px',
    height: '50px',
  }

  const image = '../test-assets/dsplay-logo.png';

  const longText = useMemo(() => new Array(100).fill('Text').join(', '), []);

  const [count, setCount] = useState(0);

  useInterval(() => setCount(count + 1), 1000);

  return (
    <div>
      <p>Main App</p>
      <p>count: {count}</p>
      <img src={image} alt="" />
      <Landscape>
        <div>
          LANDSCAPE
        </div>
      </Landscape>

      <Portrait>
        <div>
          PORTRAIT
        </div>
      </Portrait>

      <HBanner>
        <div>
          H-BANNER
        </div>
      </HBanner>

      <VBanner>
        <div>
          V-BANNER
        </div>
      </VBanner>

      <Render on={[LANDSCAPE, PORTRAIT]}>
        <div>
          LANDSCAPE &amp; PORTRAIT
        </div>
      </Render>

      <div style={boxStyle}>
        <FitText>
          Text
        </FitText>
      </div>
      <Render notOn={[V_BANNER]}>
        <div style={boxStyle}>
          <FitText>
            {longText}
          </FitText>
        </div>
      </Render>

    </div>
  );
}

export default Main;
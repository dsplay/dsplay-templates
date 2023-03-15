import React, { useEffect, useState } from 'react';

function FontLoader({
  families = [],
  onLoad,
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      (async () => {
        try {
          const { fonts } = document;
          await fonts.ready;
        } catch (e) {
          /* eslint-disable no-console */
          console.log(e);
        }

        setLoading(false);
        // console.log('fonts loaded');
        onLoad();
      })();
    }
  }, [loading, onLoad]);

  const style = {
    visibility: 'hidden',
    width: 0,
    height: 0,
  };

  return (
    <div style={style}>
      {families.map((family) => <div key={family} style={{ fontFamily: family }}>-</div>)}
    </div>
  );
}

export default FontLoader;

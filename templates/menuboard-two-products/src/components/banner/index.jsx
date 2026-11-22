import { useContext, useState } from 'react';
import { FitText, LoaderContext, useInterval } from '@dsplay/react-template-utils';

/**
 * The horizontal banner has no room for the whole menu, so it shows one item at a time (the promotions,
 * then each row) and moves to the next every `itemMs`, the media's duration shared by its items.
 * The rotation starts when the template appears, not while it is still hidden.
 */
function Banner({ items, itemMs }) {
  const { ready } = useContext(LoaderContext);
  const [index, setIndex] = useState(0);

  // Always a number: the library's `useInterval` hands React a `null` cleanup for a `null` delay, which React 19 rejects.
  // A single item, or a template still hidden, simply does not advance.
  useInterval(() => {
    if (ready && items.length > 1) setIndex((current) => (current + 1) % items.length);
  }, itemMs);

  const item = items[index % items.length];
  if (!item) return <div className="banner" />;

  return (
    <div className="banner">
      <div className={`banner-item banner-${item.kind}`} key={index}>
        {item.kind === 'promo' && (
          <div className="banner-circle-box">
            <div className="banner-circle" style={item.img ? { backgroundImage: `url("${item.img}")` } : undefined} />
          </div>
        )}
        <div className="banner-name"><FitText style={{ justifyContent: 'flex-start', textAlign: 'left', whiteSpace: 'nowrap' }}>{item.name}</FitText></div>
        <div className="banner-price"><FitText style={{ justifyContent: 'flex-end', textAlign: 'right', whiteSpace: 'nowrap' }}>{item.price}</FitText></div>
      </div>
    </div>
  );
}

export default Banner;

import { FitText } from '@dsplay/react-template-utils';

/** One promotional product: its picture in a round frame, and its name and price under it. */
function Promo({ img, name, price }) {
  return (
    <div className="promo">
      <div className="promo-circle-box">
        <div className="promo-circle" style={img ? { backgroundImage: `url("${img}")` } : undefined} />
      </div>
      <div className="promo-text">
        <div className="promo-name"><FitText style={{ whiteSpace: 'nowrap' }}>{name}</FitText></div>
        <div className="promo-price"><FitText style={{ whiteSpace: 'nowrap' }}>{price}</FitText></div>
      </div>
    </div>
  );
}

export default Promo;

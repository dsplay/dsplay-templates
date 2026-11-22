import { FitText } from '@dsplay/react-template-utils';

/** One line of the menu: the product on the left, its price on the right. */
function MenuRow({ name, price, head = false }) {
  return (
    <div className={`row${head ? ' row-head' : ''}`}>
      <div className="row-name"><FitText style={{ justifyContent: 'flex-start', textAlign: 'left', whiteSpace: 'nowrap' }}>{name}</FitText></div>
      <div className="row-price"><FitText style={{ justifyContent: 'flex-end', textAlign: 'right', whiteSpace: 'nowrap' }}>{price}</FitText></div>
    </div>
  );
}

export default MenuRow;

import {
  FitText,
  useTemplateVal,
} from '@dsplay/react-template-utils';
import { useTranslation } from 'react-i18next';
import './style.sass';

import backgroundBlackBoard from '../../assets/image/blackboard.gif';

function MenuBoardItens() {
  const { t } = useTranslation();

  const menuTitle = useTemplateVal('menu_title', t('Untitled'));
  const prodName01 = useTemplateVal('prod_name01', t('Product 01'));
  const prodPrice01 = useTemplateVal('prod_price01', t('Price 01'));
  const prodName02 = useTemplateVal('prod_name02', t('Product 02'));
  const prodPrice02 = useTemplateVal('prod_price02', t('Price 02'));
  const prodName03 = useTemplateVal('prod_name03', t('Product 03'));
  const prodPrice03 = useTemplateVal('prod_price03', t('Price 03'));
  const prodName04 = useTemplateVal('prod_name04', t('Product 04'));
  const prodPrice04 = useTemplateVal('prod_price04', t('Price 04'));
  const prodName05 = useTemplateVal('prod_name05', t('Product 05'));
  const prodPrice05 = useTemplateVal('prod_price05', t('Price 05'));
  const prodName06 = useTemplateVal('prod_name06', t('Product 06'));
  const prodPrice06 = useTemplateVal('prod_price06', t('Price 06'));
  const prodName07 = useTemplateVal('prod_name07', t('Product 07'));
  const prodPrice07 = useTemplateVal('prod_price07', t('Price 07'));
  const prodName08 = useTemplateVal('prod_name08', t('Product 08'));
  const prodPrice08 = useTemplateVal('prod_price08', t('Price 08'));
  const prodName09 = useTemplateVal('prod_name09', t('Product 09'));
  const prodPrice09 = useTemplateVal('prod_price09', t('Price 09'));
  const prodName10 = useTemplateVal('prod_name10', t('Product 10'));
  const prodPrice10 = useTemplateVal('prod_price10', t('Price 10'));

  const items = [
    [prodName01, prodPrice01],
    [prodName02, prodPrice02],
    [prodName03, prodPrice03],
    [prodName04, prodPrice04],
    [prodName05, prodPrice05],
    [prodName06, prodPrice06],
    [prodName07, prodPrice07],
    [prodName08, prodPrice08],
    [prodName09, prodPrice09],
    [prodName10, prodPrice10],
  ];

  return (
    <div className="h-full rounded-2xl p-6 menu-blackboard" style={{ backgroundImage: `url(${backgroundBlackBoard})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <div className="grow h-full grid gap-0">
        <div className="grow h-24 flex justify-between ml-4 mr-4 mb-6">
          <div className="min-h-fit mx-h-32 chalk-writed">
            <FitText>{menuTitle}</FitText>
          </div>
        </div>
        {items.map(([name, price], i) => (
          // eslint-disable-next-line react/no-array-index-key -- fixed-length, order-stable slots
          <div key={i} className="grow min-h-fit mx-h-20 flex justify-between  ml-4 mr-4 -mt-3">
            <div className="order-01 chalk-writed">
              <FitText>{name}</FitText>
            </div>
            <div className="order-02 chalk-writed">
              <FitText>{price}</FitText>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuBoardItens;

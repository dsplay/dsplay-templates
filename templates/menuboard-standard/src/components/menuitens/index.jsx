import {
  FitText,
  useTemplateVal,
} from '@dsplay/react-template-utils';
import SvgBanner from '../../assets/image/chalk-banner.svg';
import './style.sass';

function MenuBoardItens() {
  return (
    <div className="h-full rounded-2xl">
      <div className="grow h-full grid gap-0">
        <div className="grow h-28 flex justify-between ml-4 mr-4 mb-10" style={{ backgroundImage: `url(${SvgBanner})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}>
          <div className="min-h-fit max-h-28 min-w-full pt-5 chalk-board-title">
            <FitText>{useTemplateVal('menu_title', 'Untitled')}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name01', 'Product 01')}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price01', 'Price 01')}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name02', 'Product 02')}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price02', 'Price 02')}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name03', 'Product 03')}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price03', 'Price 03')}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name04', 'Product 04')}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price04', 'Price 04')}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name05', 'Product 05')}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price05', 'Price 05')}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name06', 'Product 06')}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price06', 'Price 06')}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name07', 'Product 07')}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price07', 'Price 07')}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name08', 'Product 08')}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price08', 'Price 08')}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name09', 'Product 09')}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price09', 'Price 09')}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name10', 'Product 10')}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price10', 'Price 10')}</FitText>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuBoardItens;

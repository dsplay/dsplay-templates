import {
  FitText,
  useTemplateVal,
} from '@dsplay/react-template-utils';
import { useTranslation } from 'react-i18next';
import SvgBanner from '../../assets/image/chalk-banner.svg';
import './style.sass';

function MenuBoardItens() {
  const { t } = useTranslation();

  return (
    <div className="h-full rounded-2xl">
      <div className="grow h-full grid gap-0">
        <div className="grow h-28 flex justify-between ml-4 mr-4 mb-10" style={{ backgroundImage: `url(${SvgBanner})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}>
          <div className="min-h-fit max-h-28 min-w-full pt-5 chalk-board-title">
            <FitText>{useTemplateVal('menu_title', t('Untitled'))}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name01', t('Product {{n}}', { n: 1 }))}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price01', t('Price {{n}}', { n: 1 }))}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name02', t('Product {{n}}', { n: 2 }))}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price02', t('Price {{n}}', { n: 2 }))}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name03', t('Product {{n}}', { n: 3 }))}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price03', t('Price {{n}}', { n: 3 }))}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name04', t('Product {{n}}', { n: 4 }))}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price04', t('Price {{n}}', { n: 4 }))}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name05', t('Product {{n}}', { n: 5 }))}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price05', t('Price {{n}}', { n: 5 }))}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name06', t('Product {{n}}', { n: 6 }))}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price06', t('Price {{n}}', { n: 6 }))}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name07', t('Product {{n}}', { n: 7 }))}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price07', t('Price {{n}}', { n: 7 }))}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name08', t('Product {{n}}', { n: 8 }))}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price08', t('Price {{n}}', { n: 8 }))}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name09', t('Product {{n}}', { n: 9 }))}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price09', t('Price {{n}}', { n: 9 }))}</FitText>
          </div>
        </div>
        <div className="grow min-h-fit max-h-20 flex justify-between  ml-4 mr-4 -mt-3">
          <div className="order-01 chalk-writed">
            <FitText>
              {useTemplateVal('prod_name10', t('Product {{n}}', { n: 10 }))}
            </FitText>
          </div>
          <div className="order-02 chalk-writed">
            <FitText>{useTemplateVal('prod_price10', t('Price {{n}}', { n: 10 }))}</FitText>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuBoardItens;

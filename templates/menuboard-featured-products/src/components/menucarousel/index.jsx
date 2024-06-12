import { Carousel } from 'flowbite-react';
import './style.sass';

import {
  useTemplateVal,
} from '@dsplay/react-template-utils';

function MenuBoardCarousel() {
  return (
    <div className="h-full">
      <Carousel>
        <img src={useTemplateVal('promo_img_01')} alt="..." />
        <img src={useTemplateVal('promo_img_02')} alt="..." />
        <img src={useTemplateVal('promo_img_03')} alt="..." />
      </Carousel>
    </div>
  );
}

export default MenuBoardCarousel;

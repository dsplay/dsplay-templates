import { useTemplateVal } from '@dsplay/react-template-utils';
import { PRODUCT_COUNT, PROMO_COUNT } from '../utils/menu-items';

const pad = (number) => String(number).padStart(2, '0');

// Passed to `.map` (a hook cannot be called in a loop body, a hook-named callback can).
function usePromo(_, index) {
  const key = pad(index + 1);
  return {
    img: useTemplateVal(`promo_img_${key}`),
    name: useTemplateVal(`promo_product_${key}`),
    price: useTemplateVal(`promo_price_${key}`),
  };
}

function useRow(_, index) {
  const key = pad(index + 1);
  return {
    name: useTemplateVal(`prod_name${key}`),
    price: useTemplateVal(`prod_price${key}`),
  };
}

/** Everything the menu shows: the title, the promotional products and the rows (unfiltered, in order). */
export default function useMenu() {
  const title = useTemplateVal('title');
  const promos = new Array(PROMO_COUNT).fill(1).map(usePromo);
  const rows = new Array(PRODUCT_COUNT).fill(1).map(useRow);
  return { title, promos, rows };
}

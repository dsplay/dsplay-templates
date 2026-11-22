import { useTranslation } from 'react-i18next';
import Badge from '../badge';
import Change from '../change';
import Marquee from '../marquee';
import Price from '../price';
import { trendOf } from '../../lib/format';
import './style.sass';

// the plate of a slim banner is 72 design px thick: the lead (the base) and a chip are 250 and 490 design px long
export const SLIM_LEAD = 250;
export const SLIM_CHIP = 490;

function Chip({ item, quotes, locale }) {
  return (
    <div className={`slim__chip slim__chip--${trendOf(item.changePct)}`}>
      <Badge code={item.code} kind={item.kind} size={42} />
      <span className="slim__code">{item.code}</span>
      <Price value={item.price} decimals={quotes.decimals} locale={locale} width={200} max={36} min={20} className="slim__price" />
      <Change changePct={item.changePct} locale={locale} className="slim__change" />
    </div>
  );
}

/**
 * The one line of a thin horizontal banner (1920 x 56 and the like): the base on the left, then a quote after another, each a flag or code, a price and the
 * change of the day, standing still while they fit and running in a loop when they do not. `variant` is the look of the style (`board`, `cards`; the spotlight has its own one-at-a-time bar).
 * No chart, no name: there is room for one line of text only.
 */
function Slim({
  quotes, items, plate, variant,
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const title = quotes.mode === 'inverse' ? t('1 {{code}} is worth', { code: quotes.base }) : t('Price in {{code}}', { code: quotes.base });
  return (
    <div className={`slim slim--${variant}`}>
      <div className="slim__lead">
        <Badge code={quotes.base} kind="fiat" size={42} onlyFlag className="slim__basebadge" />
        <span className="slim__base">{quotes.base}</span>
        <span className="slim__title">{title}</span>
      </div>
      <div className="slim__line">
        <Marquee items={items} chip={SLIM_CHIP} line={plate.w - SLIM_LEAD} render={(item) => <Chip item={item} quotes={quotes} locale={locale} />} speed={80} />
      </div>
    </div>
  );
}

export default Slim;

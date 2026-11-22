import { formatPrice } from '../../lib/format';
import { fitLine, rem } from '../../lib/layout';

/** A price on one line that always fits the `width` (design px) it has: the size is the biggest from `max` down to `min` at which the text fits. */
function Price({
  value, decimals, locale, width, max, min, className = '',
}) {
  const text = formatPrice(value, decimals, locale);
  const size = fitLine({
    text, width, max, min,
  });
  return (
    <span className={`price ${className}`} style={{ fontSize: rem(size), whiteSpace: 'nowrap' }}>
      {text}
    </span>
  );
}

export default Price;

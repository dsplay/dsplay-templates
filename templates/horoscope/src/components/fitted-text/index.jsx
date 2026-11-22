import { fitFont, rem } from '../../lib/layout';

/**
 * A text that always fits its box: the font size is the biggest (from `max` down to `min`, in design px) at which the text fits `width` x `height`; if even
 * `min` is too much, the box clips instead of letting the text run over its neighbours.
 */
function FittedText({
  as: Tag = 'p', text, width, height, max, min, lineHeight = 1.4, charWidth, wholeWords = false, className = '',
}) {
  const size = fitFont({
    text, width, height, max, min, lineHeight, charWidth, wholeWords,
  });
  return (
    <Tag
      className={className}
      style={{
        fontSize: rem(size), lineHeight, maxHeight: rem(height), overflow: 'hidden',
      }}
    >
      {text}
    </Tag>
  );
}

export default FittedText;

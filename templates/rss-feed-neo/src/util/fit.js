import headlineSize, { linesNeeded } from './headline-size';

/**
 * The size (rem) of a block of text and the lines it really uses: the largest size in [min, max] that fits `maxLines` and `height`
 * (spec M-001b section 4: the floor is never crossed; the layout clamps with an ellipsis). `lineHeight` 1.15 titles, 1.35 descriptions.
 * @returns {{ size: number, lines: number, used: number, height: number }}
 */
export default function fit(text, {
  width, maxLines, max, min, height, lineHeight = 1.15,
}) {
  const value = String(text || '');
  if (!value) {
    return {
      size: max, lines: 0, used: 0, height: 0,
    };
  }
  const { size, lines } = headlineSize(value, {
    width, maxLines, max, min, height, lineHeight,
  });
  const used = Math.min(lines, linesNeeded(value, size, width));
  return {
    size, lines, used, height: Math.round(size * lineHeight * used * 10) / 10,
  };
}

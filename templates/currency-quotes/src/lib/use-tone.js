import { useTemplateBoolVal } from '@dsplay/react-template-utils';

const OPPOSITE = { up: 'down', down: 'up', flat: 'flat' };

/**
 * The color a direction gets. By default it is the direction of the price (a rise is green): `up` is green. With the template variable `base_perspective` the colors
 * are read from the base's point of view: the base gains when a currency falls, so a fall is green. The arrows never change: they always show the real direction.
 */
export const toneOf = (trend, basePerspective) => (basePerspective ? OPPOSITE[trend] : trend);

/** `tone(trend)` for the template variable `base_perspective` (off by default). */
export default function useTone() {
  const basePerspective = useTemplateBoolVal('base_perspective', false);
  return (trend) => toneOf(trend, basePerspective);
}

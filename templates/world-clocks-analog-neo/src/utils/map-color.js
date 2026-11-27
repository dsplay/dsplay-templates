import { luminance, mix } from './color';

/**
 * Tone of the world map (flat on the base, no frame, decorative, no contrast requirement): pure black on a light base;
 * on a dark base black would vanish, so it is the base mixed 12% toward white (a quiet, lighter silhouette).
 * Computed here, no `color-mix`.
 * @param {string} base the base color in use
 */
export default function mapColor(base) {
  return luminance(base) > 0.18 ? '#000000' : mix(base, '#FFFFFF', 0.12);
}

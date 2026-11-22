// Every size in the template is em of a root font-size tuned for a reference screen of the format (1920x1080 for a landscape one…). A real screen, or a region of a split screen,
// is rarely that size: half of a 1080p screen is 960x540, where a type size made for 1920 overflows. So the whole layout is drawn at the reference size and scaled to fit.
const REFERENCE = {
  'fmt-landscape': [1920, 1080], 'sf-landscape': [1920, 1080],
  'fmt-square': [1080, 1080], 'sf-square': [1080, 1080],
  'fmt-portrait': [1080, 1920], 'sf-portrait': [1080, 1920],
  'fmt-tall': [320, 1080], 'sf-tall': [320, 1080],
  'fmt-band': [1920, 0], 'sf-band': [1920, 0],
};

/** The factor that fits the format's reference screen into `width` x `height` (1 for the strips, whose type size follows their own height). */
export function scaleOf(format, width, height) {
  const w = Number(width) > 0 ? Number(width) : 1920;
  const h = Number(height) > 0 ? Number(height) : 1080;
  const ref = REFERENCE[String(format).split(' ')[0]];
  if (!ref) return 1;
  const k = ref[1] ? Math.min(w / ref[0], h / ref[1]) : w / ref[0];
  return Math.min(4, Math.max(0.2, k));
}

/**
 * How much bigger the rotating content may be drawn when the screen is not the format's reference shape: the layout is scaled by the tighter side (so nothing overflows) and the other side is
 * left over, which would only be air around a small text. 1 at the reference shape, growing with the extra room (at most 1.9).
 */
export function fillOf(format, width, height) {
  const w = Number(width) > 0 ? Number(width) : 1920;
  const h = Number(height) > 0 ? Number(height) : 1080;
  const ref = REFERENCE[String(format).split(' ')[0]];
  if (!ref || !ref[1]) return 1;
  const k = scaleOf(format, w, h);
  const extra = Math.max(w / k / ref[0], h / k / ref[1]);
  return Math.min(1.9, Math.max(1, 1 + (extra - 1) * 1.6));
}

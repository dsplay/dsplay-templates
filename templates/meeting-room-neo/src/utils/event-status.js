import { normalizeRange, sameDay } from './format-event-date';

export const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Where "now" falls relative to the event.
 * - null: more than 24 h before, or the dates are invalid (no chip)
 * - { kind: 'soon', day: 'today'|'tomorrow', at: Date }
 * - { kind: 'live', until: Date | null }
 * - { kind: 'ended' }
 */
export function getEventStatus(startValue, endValue, nowMs) {
  const range = normalizeRange(startValue, endValue);
  if (!range) return null;
  const { start, end } = range;
  const now = new Date(nowMs);
  const last = end || start;

  if (nowMs < start.getTime()) {
    if (start.getTime() - nowMs > DAY_MS) return null;
    return { kind: 'soon', day: sameDay(start, now) ? 'today' : 'tomorrow', at: start };
  }
  if (nowMs <= last.getTime()) return { kind: 'live', until: end };
  return { kind: 'ended' };
}

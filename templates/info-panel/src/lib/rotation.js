// How long each item of a rotating area stays, and which one is showing. Pure functions (tested in rotation.test.js) and the hook that runs them.
//
// The media's duration is shared among the phases of the items: a news item or a counter has one, a joke has two (the question, then the answer). There is no minimum: every phase
// gets the same time, `duration / phases`, so the whole turn is shown in one showing and the last phase is never shorter than the first. A long media must not keep the screen on
// one phase, so there is a maximum, and it is worked out from the media: the turn is repeated a whole number of times, as few as keep a phase under the maximum, and the duration
// is shared among all the repeats, so no phase is shown more often, or longer, than another. (The form tells the customer how long the media should be for the pages to be readable.)

import { useEffect, useMemo, useState } from 'react';

const DEFAULT_DURATION = 20000;
// What the player spends before the first page is on screen (the web view loads the template, the fonts and the images arrive, the template is revealed) counts against the media's duration, and
// it would all come out of the last page. The rotation starts when the template is shown, and the phases share what is left of the duration: the time since the page began to load (measured)
// plus a safety margin for what happens before that (the player starting the media) and for the fade. `LEAD` is the guess used until it is measured. A media that short keeps its whole duration.
const LEAD = 2000;
const SAFETY = 500;
const MIN_FOR_LEAD = 6000;

/** Milliseconds since the page began to load: the part of the media's duration already gone when the template is shown. */
const sinceLoad = () => (typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : 0);

/** The most a phase stays, ms, before the turn is repeated to share a long media (the rotating area of the panel, and the spotlight's slides). */
export const PANEL_MAX_PHASE = 8000;
export const SPOT_MAX_PHASE = 12000;

/** The phases of every item in one list, as whole numbers of at least 1. */
export const phasesOf = (items) => items.map((item) => Math.max(1, Math.trunc(Number(item) || 1)));

/**
 * The time of one phase, in ms, and how many times the turn goes round in the media.
 * @param {number} duration the media's duration, ms (the default is 20 s when it is unknown); the first 2 s of a media of more than 6 s are not shared (the page is loading)
 * @param {number} total phases in one turn of the items
 * @param {number} max the most one phase stays, ms
 * @param {number} [lead] ms of the duration already gone (default 2 s); never more than half of it
 */
export function dwellFor(duration, total, max, lead = LEAD) {
  const full = Number(duration) > 0 ? Number(duration) : DEFAULT_DURATION;
  const length = full > MIN_FOR_LEAD ? Math.max(full - lead, full / 2) : full;
  const phases = Math.max(1, total);
  const turns = Math.max(1, Math.ceil(length / (phases * max)));
  return { dwell: Math.floor(length / (turns * phases)), turns };
}

/** Which item, and which of its phases, a step of the turn is on. */
export function locate(step, phases) {
  let left = step;
  for (let index = 0; index < phases.length; index += 1) {
    if (left < phases[index]) return { active: index, phase: left };
    left -= phases[index];
  }
  return { active: 0, phase: 0 };
}

/**
 * The item showing now and its phase. With nothing to rotate (one phase) it stays on the first item and sets no timer. Nothing moves while `hold` (the template is not shown yet: the fonts and
 * images are loading): the rotation starts when it stops, with the first item and the time left of the media (`lead` is the time already gone, measured when it starts, unless given). The turns
 * the media holds are played one after the other, and after the last phase of the last turn it stays there until the media ends: it does not go back to the first phase unless there was time
 * for another whole turn (what is kept back for the loading is slack for the last phase, not the start of a new round).
 * @param {{phases: number[], duration: number, max: number, hold?: boolean, lead?: number}} options
 */
export function useRotation({
  phases, duration, max, hold = false, lead: given,
}) {
  const key = phases.join(',');
  const list = useMemo(() => phasesOf(key ? key.split(',').map(Number) : []), [key]);
  const total = list.reduce((sum, n) => sum + n, 0);
  // measured once, the moment the hold ends
  const [lead, setLead] = useState(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!hold && lead === null) setLead(given === undefined ? sinceLoad() + SAFETY : given);
  }, [hold, lead, given]);
  const waiting = hold || lead === null;
  const { dwell, turns } = dwellFor(duration, total, max, lead === null ? LEAD : lead);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // a changed duration (or list) restarts the rotation on its first step
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStep(0);
    if (waiting || total <= 1) return undefined;
    const last = turns * total;
    let played = 0;
    const timer = setInterval(() => {
      played += 1;
      if (played >= last) {
        clearInterval(timer);
        return;
      }
      setStep(played % total);
    }, dwell);
    return () => clearInterval(timer);
  }, [dwell, total, turns, waiting]);

  return locate(step % Math.max(1, total), list);
}

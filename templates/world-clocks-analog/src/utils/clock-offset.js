/**
 * How far the device clock is from the player's, in ms, from the `timestamp` the player puts in `config` (the
 * terminal's time, kept in step with the server's). A player that does not send one (older ones) gives 0, which is
 * the device clock as it is.
 * @param {unknown} timestamp epoch ms
 * @param {number} [now] the device clock, epoch ms
 */
export default function clockOffset(timestamp, now = Date.now()) {
  const reported = Number(timestamp);
  return Number.isFinite(reported) && reported > 0 ? reported - now : 0;
}

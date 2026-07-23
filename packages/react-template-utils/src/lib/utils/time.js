/* eslint-disable import-x/prefer-default-export */

/**
 * Resolves after the given delay.
 * @param {number} timeMs - Delay in milliseconds
 * @returns {Promise<void>}
 */
export const wait = (timeMs) => new Promise((resolve) => {
  setTimeout(resolve, timeMs);
});

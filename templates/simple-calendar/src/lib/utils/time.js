/* eslint-disable import/prefer-default-export */

export const wait = (timeMs) => new Promise((resolve) => {
  setTimeout(resolve, timeMs);
});

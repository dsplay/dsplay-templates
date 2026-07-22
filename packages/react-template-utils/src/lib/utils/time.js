/* eslint-disable import-x/prefer-default-export */

export const wait = (timeMs) => new Promise((resolve) => {
  setTimeout(resolve, timeMs);
});

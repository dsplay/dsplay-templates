/* eslint-disable no-unused-vars */
/* eslint-disable no-var */

const LOGO_RATE = 0.25;
const QZ_RATE = 0.05;

function calculateQrCodeSize(percent) {
  const smallerSideSize = Math.min(window.innerWidth, window.innerHeight);
  const size = smallerSideSize * (Number(percent) / 100);
  const quietZone = size * QZ_RATE;
  const logoSize = size * LOGO_RATE;

  return {
    size: size - quietZone * 2,
    quietZone,
    logoSize,
  };
}

export default calculateQrCodeSize;

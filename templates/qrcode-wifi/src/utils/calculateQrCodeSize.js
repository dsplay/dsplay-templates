/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
function calculateQrCodeSize(percent) {
  const windowArea = Math.min(window.innerWidth, window.innerHeight) ** 2;
  const qrCodeArea = windowArea * (Number(percent) / 100);
  const qrCodeWidth = Math.sqrt(qrCodeArea);
  let size = 0;
  let quietZone = 0;
  let logoSize = 0;
  if (percent > 51) {
    size = qrCodeWidth;
    quietZone = Math.ceil(100 / percent) * 10;
  } else {
    size = qrCodeWidth;
    quietZone = Math.floor(100 / percent);
  }
  logoSize = size * 0.2;
  return { size, quietZone, logoSize };
}

export default calculateQrCodeSize;

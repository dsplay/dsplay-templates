import React, { useEffect, useRef } from 'react';
import QRCode from 'easyqrcodejs';

/**
 * Renders a QR code, powered by `easyqrcodejs`.
 * @param {object} props
 * @param {string} [props.className] - Extra class applied to the wrapper
 * @param {React.CSSProperties} [props.style] - Extra styles applied to the wrapper
 * @param {object} props.options - `easyqrcodejs` options (e.g. `text`, `width`, `height`, `colorDark`), see https://github.com/ushelp/EasyQRCodeJS
 * @returns {React.ReactElement}
 */
function QrCode({
  className = '',
  style = {},
  options,
}) {
  const inputEl = useRef(null);

  useEffect(() => {
    // Create new QRCode Object
    const qrcode = new QRCode(inputEl.current, options);
    return () => qrcode.clear();
  });

  return (
    <div
      ref={inputEl}
      className={`dsplay-qr-code ${className}`}
      style={style}
    />
  );
}

export default QrCode;

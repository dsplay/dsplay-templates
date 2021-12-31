import React, { useEffect, useRef } from 'react';
import QRCode from 'easyqrcodejs';

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

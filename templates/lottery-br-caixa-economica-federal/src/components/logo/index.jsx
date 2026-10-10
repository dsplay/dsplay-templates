import './style.sass';

function Logo({
  primaryColor,
  secondColor,
}) {
  return (
    <svg viewBox="0 0 26 26" aria-hidden="true">
      <path
        d="M8.68,0a3.81,3.81,0,0,1,3.76,3.85h0v8.6H3.68a3.85,3.85,0,0,1,0-7.7A3.57,3.57,0,0,1,5.11,5a3.77,3.77,0,0,1-.18-1.17A3.81,3.81,0,0,1,8.68,0Z"
        transform="translate(0.03)"
        fill={primaryColor}
      />
      <path
        d="M17.26,0a3.81,3.81,0,0,0-3.75,3.85h0v8.6h8.76a3.85,3.85,0,0,0-.05-7.7A3.54,3.54,0,0,0,20.84,5,3.77,3.77,0,0,0,21,3.85,3.81,3.81,0,0,0,17.26,0"
        transform="translate(0.03)"
        fill={secondColor}
      />
      <path
        d="M17.26,26a3.81,3.81,0,0,1-3.75-3.85h0v-8.6h8.76a3.85,3.85,0,0,1-.05,7.7A3.54,3.54,0,0,1,20.84,21,3.77,3.77,0,0,1,21,22.15,3.81,3.81,0,0,1,17.26,26"
        transform="translate(0.03)"
        fill={primaryColor}
      />
      <path
        d="M8.68,26a3.81,3.81,0,0,0,3.76-3.85h0v-8.6H3.68a3.85,3.85,0,0,0,0,7.7A3.57,3.57,0,0,0,5.11,21a3.77,3.77,0,0,0-.18,1.17A3.81,3.81,0,0,0,8.68,26"
        transform="translate(0.03)"
        fill={secondColor}
      />
    </svg>
  );
}

export default Logo;

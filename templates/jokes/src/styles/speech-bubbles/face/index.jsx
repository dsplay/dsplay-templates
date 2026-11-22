/** The round face of the bubbles: puzzled while the question is up, laughing once the answer is out. */
function Face({ happy, label }) {
  if (happy) {
    return (
      <span className="bubbles__face idle-box idle-bob"><svg viewBox="0 0 170 170" role="img" aria-label={label}>
        <circle cx="85" cy="85" r="76" fill="#2dd4bf" stroke="#17645b" strokeWidth="5" />
        <path d="M44 70 Q58 56 72 70" stroke="#17202a" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M98 70 Q112 56 126 70" stroke="#17202a" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M46 98 Q85 148 124 98 Z" fill="#17202a" />
        <path d="M62 118 Q85 134 108 118 Q85 110 62 118Z" fill="#ff7a8a" />
        <circle cx="38" cy="96" r="8" fill="#ff9fb8" opacity="0.7" />
        <circle cx="132" cy="96" r="8" fill="#ff9fb8" opacity="0.7" />
      </svg></span>
    );
  }
  return (
    <span className="bubbles__face idle-box idle-bob"><svg viewBox="0 0 170 170" role="img" aria-label={label}>
      <circle cx="85" cy="85" r="76" fill="#2dd4bf" stroke="#17645b" strokeWidth="5" />
      <circle cx="58" cy="72" r="12" fill="#fff" />
      <circle cx="112" cy="72" r="12" fill="#fff" />
      <circle cx="62" cy="74" r="6" fill="#17202a" />
      <circle cx="116" cy="74" r="6" fill="#17202a" />
      <path d="M42 50 Q58 38 74 48" stroke="#17645b" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M96 44 Q112 34 128 48" stroke="#17645b" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M66 118 Q86 108 106 118" stroke="#17202a" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg></span>
  );
}

export default Face;

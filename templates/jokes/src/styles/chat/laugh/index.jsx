/** The laughing face of the reaction under the answer. */
function Laugh() {
  return (
    <span className="chat__laugh idle-box idle-wiggle"><svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="#ffd84d" />
      <path d="M9 16 Q13 12 17 16 M23 16 Q27 12 31 16" stroke="#3a2a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M10 24 Q20 38 30 24Z" fill="#3a2a00" />
    </svg></span>
  );
}

export default Laugh;

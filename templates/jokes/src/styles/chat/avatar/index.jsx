/** The round face of the other side of the chat. */
function Avatar() {
  return (
    <span className="chat__avatar idle-box idle-bob"><svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#ffb347" />
      <circle cx="14" cy="17" r="3" fill="#3a2a00" />
      <circle cx="26" cy="17" r="3" fill="#3a2a00" />
      <path d="M12 25 Q20 32 28 25" stroke="#3a2a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg></span>
  );
}

export default Avatar;

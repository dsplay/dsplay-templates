// What a holiday is about, drawn as a still SVG (old Android WebViews cannot animate SVG, and nothing here moves). The kinds are the ones the service sends (`kind`);
// anything else, and a holiday the service could not classify, is the star.
const GLYPHS = {
  newyear: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/><circle cx="12" cy="12" r="1.6"/>',
  carnival: '<path d="M3 8c3-2 6-2 9 0 3-2 6-2 9 0 0 6-3 10-9 10S3 14 3 8z"/><path d="M7.2 10.5h2.6M14.2 10.5h2.6M9.5 14c1.5 1 3.5 1 5 0"/>',
  easter: '<path d="M12 3v18M6 9h12"/>',
  christmas: '<path d="M12 3l5 6h-3l4 5h-4l3 4H7l3-4H6l4-5H7z"/><path d="M12 18v3"/>',
  labour: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6.5"/><path d="M12 2v3.5M12 18.5V22M2 12h3.5M18.5 12H22M4.9 4.9l2.5 2.5M16.6 16.6l2.5 2.5M19.1 4.9l-2.5 2.5M7.4 16.6l-2.5 2.5"/>',
  independence: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  election: '<path d="M4 13h16v8H4zM7 13l2-9h6l2 9M9.5 17.5l1.5 1.5 3-3"/>',
  remembrance: '<rect x="9" y="11" width="6" height="10" rx="1"/><path d="M12 3c2.2 2 2.2 4.2 0 6.2-2.2-2-2.2-4.2 0-6.2z"/>',
  religious: '<path d="M12 2v4M10 4h4M5 21V11l7-5 7 5v10zM10 21v-5h4v5"/>',
  islamic: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
  lunar: '<rect x="7" y="6" width="10" height="12" rx="4"/><path d="M12 3v3M12 18v3M10 10h4"/>',
  indic: '<path d="M12 5c2 3 2 6 0 9-2-3-2-6 0-9zM5 11c3 0 5 1.5 7 5-3 0-5-1.5-7-5zM19 11c-3 0-5 1.5-7 5 3 0 5-1.5 7-5zM6 19h12"/>',
  jewish: '<path d="M12 3l7 12H5zM12 21L5 9h14z"/>',
  thanksgiving: '<path d="M5 19C5 10 10 5 19 5c0 9-5 14-14 14zM5 19l8-8"/>',
  city: '<path d="M3 21V10h6v11M9 21V4h6v17M15 21v-8h6v8M3 21h18"/>',
  people: '<circle cx="8" cy="8" r="2.5"/><circle cx="16" cy="8" r="2.5"/><path d="M3 20c0-3 2-5 5-5s5 2 5 5M11 20c0-3 2-5 5-5s5 2 5 5"/>',
  generic: '<path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16.8 6.5 19.7l1.2-6.1L3.2 9.4l6.1-.8z"/>',
};

function Icon({ kind, className = '' }) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      // fixed drawings above, never data
      dangerouslySetInnerHTML={{ __html: GLYPHS[kind] || GLYPHS.generic }}
    />
  );
}

export const KIND_IDS = Object.keys(GLYPHS);
export default Icon;

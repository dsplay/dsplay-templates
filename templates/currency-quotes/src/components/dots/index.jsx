import './style.sass';

/** One dot per page, the page on screen lit; nothing when there is a single page. */
function Dots({ pages, page }) {
  if (pages < 2) return null;
  return (
    <span className="dots" aria-hidden="true">
      {Array.from({ length: pages }, (_, i) => <i key={i} className={i === page ? 'dots__dot dots__dot--on' : 'dots__dot'} />)}
    </span>
  );
}

export default Dots;

import { useView } from '../../hooks/view-context';
import './style.sass';

/**
 * The text of the current item's card with the accent marker beside it: a loose rounded bar 0.6 rem wide, as tall as the text
 * block (at least 8 rem, at most the card), centered vertically with it, 2.4 rem before the text. The card gives the 3 rem
 * left padding, so the text starts 6.0 rem from the card's edge.
 */
function MarkedText({ children }) {
  const { theme } = useView();
  return (
    <div className="marked-text">
      <div className="marker" style={{ backgroundColor: theme.primary }} />
      <div className="content">{children}</div>
    </div>
  );
}

export default MarkedText;

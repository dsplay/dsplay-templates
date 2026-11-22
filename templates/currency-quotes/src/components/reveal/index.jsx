import './style.sass';

/**
 * A box that lets a style reveal what is inside from left to right, with the content at its final size the whole time (a chart that is stretched while it enters looks bad).
 * Nothing moves by itself: a style animates `.reveal__win` with `reveal-window` and `.reveal__in` with `reveal-content`, with the same time and curve. The window slides in from the
 * left, so the box it clips grows from nothing, and the content slides the other way by the same amount, so it never leaves its place. Only transforms, so the 4.4 WebView can do it.
 */
function Reveal({ className = '', children }) {
  return (
    <div className={`reveal ${className}`}>
      <div className="reveal__win">
        <div className="reveal__in">{children}</div>
      </div>
    </div>
  );
}

export default Reveal;

import Icon from '../icon';
import './style.sass';

/** The rounded square that holds a holiday's icon; its size and colours come from the style around it. */
function Medal({ kind, className = '', style }) {
  return (
    <div className={`medal ${className}`} style={style}>
      <Icon kind={kind} />
    </div>
  );
}

export default Medal;

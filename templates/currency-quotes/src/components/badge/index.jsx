import { useTemplateBoolVal } from '@dsplay/react-template-utils';
import { flagUrl } from '../../lib/flags';
import './style.sass';

/**
 * The round mark of a currency. A currency of a country shows its flag (the template variable `show_flags`, on by default); the others, and every one with the
 * flags off, show their code in a circle whose color says fiat or crypto (the code shrinks with its length). `size` is the diameter in design px.
 * `onlyFlag` draws nothing when there is no flag to show (the base currency of a header already has its code written next to it).
 */
function Badge({
  code, kind, size, onlyFlag = false, className = '',
}) {
  const showFlags = useTemplateBoolVal('show_flags', true);
  const url = showFlags && kind === 'fiat' ? flagUrl(code) : null;
  const rems = `${size / 10}rem`;
  if (url) {
    return <span className={`badge badge--flag ${className}`} style={{ width: rems, height: rems, backgroundImage: `url(${url})` }} role="img" aria-label={code} />;
  }
  if (onlyFlag) return null;
  const scale = code.length <= 3 ? 0.36 : code.length === 4 ? 0.3 : 0.25;
  return (
    <span
      className={`badge badge--${kind} ${className}`}
      style={{
        width: rems, height: rems, lineHeight: rems, fontSize: `${(size * scale) / 10}rem`,
      }}
    >
      {code}
    </span>
  );
}

export default Badge;

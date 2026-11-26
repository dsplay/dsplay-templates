import { useView } from '../../hooks/view-context';
import { lightsOf } from '../../util/backgrounds';
import './style.sass';

/**
 * The screen background: the baked layer of the weather (or the flat color, or the operator's photo with a black veil) and, only in
 * the glass mode, the decorative discs the blur has something to blur on. All static.
 */
function Background({
  look, photo, family, night, lights,
}) {
  const { settings } = useView();
  return (
    <>
      <div className="bg" style={look} />
      {photo && <div className="bg photo" style={{ backgroundImage: `url("${photo}")` }} />}
      {photo && <div className="bg veil" style={{ backgroundColor: `rgba(0,0,0,${settings.veil})` }} />}
      {lights && !photo && <div className="lights" style={lightsOf(family, night)} />}
    </>
  );
}

export default Background;

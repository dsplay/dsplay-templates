import { useTemplateVal } from '@dsplay/react-template-utils';
import { DEFAULT_LOGO_BG_COLOR } from '../../util/defaults';
import useLogo from '../../util/use-logo';
import RssIcon from '../rss-icon';
import './style.sass';

function Logo() {
  // template properties
  const backgroundColor = useTemplateVal('logo_bg_color', DEFAULT_LOGO_BG_COLOR);
  const { src, onError } = useLogo();

  // component properties
  const bgStyle = {
    backgroundColor,
  };

  const contentStyle = {
    backgroundImage: `url(${src})`,
  };

  // the default mark sits on the logo background like any logo (white unless `logo_bg_color` says otherwise), in the RSS orange
  if (!src) {
    return (
      <div className="logo default">
        <div className="bg wrapped" style={bgStyle} />
        <div className="content"><RssIcon /></div>
      </div>
    );
  }

  return (
    <div className="logo">
      <div className="bg wrapped" style={bgStyle} />
      <div className="content" style={contentStyle}>&nbsp;</div>
      {/* the background picture cannot report a failure, this one does, and hands over to the next logo */}
      <img className="probe" src={src} alt="" onError={onError} />
    </div>
  );
}

export default Logo;

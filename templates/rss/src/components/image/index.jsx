import './style.sass';
import {
  useTemplateVal,
  useScreenInfo,
  screen,
} from '@dsplay/react-template-utils';
import defaultImage from '../../images/bg.jpg';
import { DEFAULT_TEXT_BG_COLOR } from '../../util/defaults';
import useRssItem from '../../util/use-rss-item';

function Image() {
  // media properties
  const { hasImage, imageUrl } = useRssItem();

  // template properties
  const backgroundColor = useTemplateVal('text_bg_color', DEFAULT_TEXT_BG_COLOR);

  // component properties
  const bgStyle = {
    backgroundColor,
  };

  const contentStyle = {
    backgroundImage: `url(${hasImage ? imageUrl : defaultImage})`,
  };

  const { screenFormat } = useScreenInfo();

  if (!hasImage && (screenFormat === screen.H_BANNER || screenFormat === screen.V_BANNER)) {
    return null;
  }

  return (
    <div className="image">
      <div className="container">
        <div className="bg" style={bgStyle} />
        <div className="wrapper">
          <div className="content" style={contentStyle}>&nbsp;</div>
        </div>
      </div>
    </div>
  );
}

export default Image;

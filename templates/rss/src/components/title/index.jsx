import { useConfig, useTemplateVal } from '@dsplay/react-template-utils';
import Logo from '../logo';
import { DEFAULT_TITLE_COLOR, DEFAULT_TITLE_BG_COLOR } from '../../util/defaults';
import FitText from '../fit-text';
import needsUolIndoorFix from '../../util/uol-indoor';
import useRssItem from '../../util/use-rss-item';
import './style.sass';

function Title() {
  // media properties
  const { source, itemTitle, title: mediaTitle } = useRssItem();
  const { appVersion, platform } = useConfig();

  // template properties
  const color = useTemplateVal('title_color', DEFAULT_TITLE_COLOR);
  const backgroundColor = useTemplateVal('title_bg_color', DEFAULT_TITLE_BG_COLOR);

  // component properties
  const style = {
    color,
  };

  const bgStyle = {
    backgroundColor,
  };

  const title = needsUolIndoorFix(source, appVersion, platform) ? itemTitle : mediaTitle;

  return (
    <div className="title" style={style}>
      <Logo />
      <div className="text">
        <div className="bg wrapped" style={bgStyle} />
        <div className="content">
          <FitText>{title}</FitText>
        </div>
      </div>
    </div>
  );
}

export default Title;

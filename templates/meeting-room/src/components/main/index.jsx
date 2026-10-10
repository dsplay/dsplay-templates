import {
  FitText,
  useMedia,
  useTemplateVal,
} from '@dsplay/react-template-utils';
import './style.sass';
import useDominantColor from '../../hooks/use-dominant-color';
import useLanguage from '../../hooks/use-language';

function Main() {
  const media = useMedia();
  const imgEventLogo = useTemplateVal('eventLogo');
  const imgHostLogo = useTemplateVal('hostLogo');
  const eventLogoColor = useDominantColor(imgEventLogo);
  const hostLogoColor = useDominantColor(imgHostLogo);
  const {
    location,
  } = media;
  const language = useLanguage();

  const dateEventDate = new Date(media.startDate).toLocaleString(language, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const startEventDate = new Date(media.startDate).toLocaleString(language, {
    weekday: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const endtEventDate = new Date(media.endDate).toLocaleString(language, {
    weekday: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="main flex-container" style={{ backgroundColor: useTemplateVal('mainColor') }}>
      <div className="flex-item-left">
        <div className="flex-item-left-top">
          <p>
            <h1 className="time">
              {startEventDate}
              { ' - '}
              {endtEventDate}

            </h1>
          </p>
          <p className="meeting-name"><FitText>{media.eventName}</FitText></p>
        </div>
        <div
          className="flex-item-left-bottom"
          style={{
            backgroundImage: `url("${imgEventLogo}")`, backgroundColor: eventLogoColor,
          }}
        />
      </div>
      <div className="flex-item-right">
        <div className="flex-item-right-top" style={{ backgroundColor: useTemplateVal('rightColorTop') }}>
          <div className="local-brand" style={{ backgroundImage: `url("${imgHostLogo}")`, backgroundColor: hostLogoColor }} />
        </div>
        <div className="flex-item-right-bottom" style={{ backgroundColor: useTemplateVal('rightColorBottom') }}>
          <div className="local-info">
            <p><h1 className="city">{location}</h1></p>
            <p><h1 className="date">{dateEventDate}</h1></p>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Main;

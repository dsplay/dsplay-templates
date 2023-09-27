/* eslint-disable linebreak-style */
import {
  FitText,
  useMedia,
  useTemplateVal,
} from '@dsplay/react-template-utils';
import './style.sass';
import Color from 'color-thief-react';
import i18n from '../../i18n';
import useLanguage from '../../hooks/use-language';

function Main() {
  const media = useMedia();
  const imgEventLogo = useTemplateVal('eventLogo');
  const imgHostLogo = useTemplateVal('hostLogo');
  const {
    location,
    eventDate,
    startDate,
    endDate,
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
          <p className="meeting-name"><FitText>Event with a big name to test the space Event with a big name to test the space Event with a big name to test the space Event with a big name to test the space  Event with a big name to test the space Event with a big name to test the space</FitText></p>
        </div>
        <Color src={imgEventLogo} format="hex">
          {({ data, loading, error }) => (
            <div
              className="flex-item-left-bottom"
              style={{
                backgroundImage: `url("${useTemplateVal('eventLogo')}")`, backgroundColor: data,
              }}
            />
          )}
        </Color>
      </div>
      <div className="flex-item-right">
        <div className="flex-item-right-top" style={{ backgroundColor: useTemplateVal('rightColorTop') }}>
          <Color src={imgHostLogo} format="hex">
            {({ data, loading, error }) => (
              <div className="local-brand" style={{ backgroundImage: `url("${useTemplateVal('hostLogo')}")`, backgroundColor: data }} />
            )}
          </Color>
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

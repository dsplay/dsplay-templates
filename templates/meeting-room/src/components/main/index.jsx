/* eslint-disable linebreak-style */
import {
  FitText,
  useMedia,
  useTemplateVal,
} from '@dsplay/react-template-utils';
import './style.sass';
import Color from 'color-thief-react';

function Main() {
  const media = useMedia();
  const imgEventLogo = useTemplateVal('eventLogo');
  const imgHostLogo = useTemplateVal('hostLogo');

  const {
    location,
    eventDate,
    startTime,
    endTime,
  } = media;
  return (
    <div className="main flex-container" style={{ backgroundColor: useTemplateVal('mainColor') }}>
      <div className="flex-item-left">
        <div className="flex-item-left-top">
          <p>
            <h1 className="time">
              {startTime}
              -
              {endTime}
            </h1>
          </p>
          <p><h1 className="meeting-name"><FitText>Event with a big name to test the space Event with a big name to test the space</FitText></h1></p>
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
            <p><h1 className="date">{eventDate}</h1></p>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Main;

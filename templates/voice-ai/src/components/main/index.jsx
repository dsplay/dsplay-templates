/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import Home from '../home';
import './style.sass';
import logger from '../logger';

function Main() {
  logger.log('>>> Main component rendered');
  return (
    <Home />
  );
}

export default Main;

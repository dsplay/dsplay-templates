import Home from '../home';
import './style.sass';
import logger from '../../utils/logger';

function Main() {
  logger.log('>>> Main component rendered');
  return (
    <Home />
  );
}

export default Main;

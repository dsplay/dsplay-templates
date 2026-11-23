import { Loader, useScreenInfo } from '@dsplay/react-template-utils';
import Main from '../main';
import './style.sass';

// other tasks (Promises) to run during template intro
const tasks = [];

function App() {
  const { screenFormat } = useScreenInfo();

  return (
    <Loader reveal tasks={tasks}>
      <div className={`app fade-in ${screenFormat}`}>
        <Main />
      </div>
    </Loader>
  );
}

export default App;

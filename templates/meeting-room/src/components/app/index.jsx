import { Loader, useScreenInfo, useTemplateVal } from '@dsplay/react-template-utils';
import Intro from '../intro';
import Main from '../main';
import './style.sass';

const MIN_LOADING_DURATION = 2000;

// fonts to preload
// @font-face's must be defined in fonts.sass or another in-use style file
const fonts = [
  'Oswald',
];

// other tasks (Promises) to run during template intro
const tasks = [
  Promise.resolve('my promise result'),
];

function App() {
  const { screenFormat } = useScreenInfo();

  return (
    <Loader
      placeholder={<Intro />}
      fonts={fonts}
      minDuration={MIN_LOADING_DURATION}
      tasks={tasks}
    >
      <div className={`app fade-in ${screenFormat}`} style={{ backgroundColor: useTemplateVal('mainColor') }}>
        <Main />
      </div>
    </Loader>
  );
}

export default App;

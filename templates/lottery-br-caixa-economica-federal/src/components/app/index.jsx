import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useMedia, useConfig, Loader } from '@dsplay/react-template-utils';
import i18n from '../../i18n';
import MegaSena from '../games/mega-sena';
import DuplaSena from '../games/dupla-sena';
import Quina from '../games/quina';
import LotoFacil from '../games/loto-facil';
import LotoMania from '../games/loto-mania';
import DiaDeSorte from '../games/dia-de-sorte';
import TimeMania from '../games/time-mania';
import Federal from '../games/federal';
import SuperSete from '../games/super-sete';
import Loteca from '../games/loteca';
import './style.sass';
import '../../entrance.css';

const gameMap = {
  federal: Federal,
  megasena: MegaSena,
  duplasena: DuplaSena,
  quina: Quina,
  lotofacil: LotoFacil,
  lotomania: LotoMania,
  timemania: TimeMania,
  diadesorte: DiaDeSorte,
  supersete: SuperSete,
  loteca: Loteca,
};

function App() {
  const media = useMedia();
  const { locale } = useConfig();
  const [lng] = (locale || 'en').split('_');

  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);

  const {
    iteration = 0,
  } = media;

  const {
    result: {
      data,
    },
  } = media;

  const validComponents = Object.keys(gameMap)
    .filter((key) => data[key])
    .map((key) => gameMap[key]);

  const Component = validComponents[iteration % validComponents.length];

  return (
    <I18nextProvider i18n={i18n}>
      <Loader
        reveal
      >
        <div className="App grow flex v">
          <Component />
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;

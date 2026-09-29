import { useMedia } from '@dsplay/react-template-utils';
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
    <div className="App grow flex v">
      <Component />
    </div>
  );
}

export default App;

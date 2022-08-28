import React from 'react';
import { media } from '@dsplay/template-utils';
import MegaSena from './components/games/mega-sena/mega-sena';
import DuplaSena from './components/games/dupla-sena/dupla-sena';
import Quina from './components/games/quina/quina';
import LotoFacil from './components/games/loto-facil/loto-facil';
import LotoMania from './components/games/loto-mania/loto-mania';
import DiaDeSorte from './components/games/dia-de-sorte/dia-de-sorte';
import TimeMania from './components/games/time-mania/time-mania';
import Federal from './components/games/federal/federal';
import './App.sass';

const {
  iteration = 0,
} = media;

const gameMap = {
  federal: Federal,
  megasena: MegaSena,
  duplasena: DuplaSena,
  quina: Quina,
  lotofacil: LotoFacil,
  lotomania: LotoMania,
  timemania: TimeMania,
  diadesorte: DiaDeSorte,
};

const {
  result: {
    data
  },
} = media;

const validComponents = Object.keys(gameMap)
  .filter((key) => data[key])
  .map((key) => gameMap[key]);

const Component = validComponents[iteration % validComponents.length];

function App() {
  return (
    <div className="App grow flex v">
      <Component />
    </div>
  );
}


export default App;

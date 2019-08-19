import React from 'react';
import {
    // values
    media, // current media
    config, // player configuration
    template, // custom template values
    // utility functions
    tval, // custom template string value
    tbval, // custom template boolean value
    tival, // custom template int value
    tfval, // custom template float value
    isVertical, // boolean flag to indicate screen orientation

} from '@dsplay/template-utils';
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

const components = [
    MegaSena,
    DuplaSena,
    Quina,
    LotoFacil,
    LotoMania,
    DiaDeSorte,
    TimeMania,
    Federal,
]

const Component = components[iteration % components.length];

function App() {
    return (
        <div className="App grow flex v">
            <Component />
        </div>
    );
}


export default App;

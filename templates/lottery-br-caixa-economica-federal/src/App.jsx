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
import './App.sass';

function App() {
    return (
        <div className="App grow flex v">
            <MegaSena />
        </div>
    );
}


export default App;

import React, { Component } from 'react';
import { tval } from '@dsplay/template-utils';
import './App.css';
import Clock from './components/clock';
import Quotes from './components/quotes';
import News from './components/news';
import Weather from './components/weather';
import Sponsor from './components/sponsor';

const backgroundColor = tval('bg_color', 'white');
const backgroundImage = tval('bg_image') ? `url('${tval('bg_image')}')` : undefined;
const color = tval('text_color', 'black');

const style = {
    backgroundColor,
    backgroundImage,
    color,
};

class App extends Component {
    render() {
        return (
            <div className="App block" style={style} >
                <Clock />
                <Weather />
                <Quotes />
                <News />
                <Sponsor />
            </div>
        );
    }
}

export default App;

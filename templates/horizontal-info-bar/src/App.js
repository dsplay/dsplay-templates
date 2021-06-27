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

/*
c - clock
w - weather
q - quotes 
n - news
s - sponsor
*/

const mapWidgets = {
    "c": <Clock/>,
    "w": <Weather />,
    "q": <Quotes />,
    "n": <News />,
    "s": <Sponsor />,
}

const defaultSequenceWidgets = ['c','w','q','n','s'];
const parsedUrl = new URL(window.location.href);
const widgetsSequenceQuery = tval('widgets_sequence_query');

const filterWidgetsSequence = (sequence) => {
    const widgetsSequence = [];

    sequence.forEach(element => {
        if(defaultSequenceWidgets.includes(element) && !widgetsSequence.includes(element)) {
            widgetsSequence.push(element);
        }
    });

    defaultSequenceWidgets.forEach(element => {
        if(!widgetsSequence.includes(element)) {
            widgetsSequence.push(element);
        }
    });

    return widgetsSequence;
}

function App () {

    const widgetsSequence = widgetsSequenceQuery ? filterWidgetsSequence([...widgetsSequenceQuery.toLowerCase()]) : defaultSequenceWidgets;
    const widgets =  widgetsSequence.map(element => {
        return mapWidgets[element];
    });
    
    return (
        <div className="App block" style={style} >
            { widgets }
        </div>
    );
}

export default App;

import React from 'react';
import { render } from "react-dom";
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

} from './lib';

const App = () => (
    <div>
        <h1>DSPLAY Template</h1>
        <div>
            <p>Media:
                <pre>{JSON.stringify(media, null, 4)}</pre>
            </p>
            <p>Config:
                <pre>{JSON.stringify(config, null, 4)}</pre>
            </p>
            <p>Template:
                <pre>{JSON.stringify(template, null, 4)}</pre>
            </p>
            <p>
                String:
                <span class="val">{tval('title', 'Default Value')}</span>
            </p>
            <p>
                Boolean:
                <span class="val">{tbval('expanded', true) ? 'Yes' : 'No'}</span>
            </p>
            <p>
                Int:
                <span class="val">{tival('page_size', 10)}</span>
            </p>
            <p>
                Double:
                <span class="val">{tfval('rate', .75)}</span>
            </p>
            <p>
                Vertical?:
                <span class="val">{isVertical ? 'Yes' : 'No'}</span>
            </p>
        </div>
    </div>
);

render(<App />, document.getElementById("root"));

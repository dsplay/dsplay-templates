import React from 'react';
import { render } from "react-dom";
import {
  // DSPLAY interface
  DSPLAY,
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

console.log(DSPLAY.getData());

const App = () => (
  <div>
    <h1>DSPLAY Template</h1>
    <div>
      <div>Media:
        <pre>{JSON.stringify(media, null, 4)}</pre>
      </div>
      <div>Config:
        <pre>{JSON.stringify(config, null, 4)}</pre>
      </div>
      <div>Template:
        <pre>{JSON.stringify(template, null, 4)}</pre>
      </div>
      <p>
        String:
        <span className="val">{tval('title', 'Default Value')}</span>
      </p>
      <p>
        Boolean:
        <span className="val">{tbval('expanded', true) ? 'Yes' : 'No'}</span>
      </p>
      <p>
        Int:
        <span className="val">{tival('page_size', 10)}</span>
      </p>
      <p>
        Double:
        <span className="val">{tfval('rate', .75)}</span>
      </p>
      <p>
        Vertical?:
        <span className="val">{isVertical ? 'Yes' : 'No'}</span>
      </p>
    </div>
  </div>
);

render(<App />, document.getElementById("root"));

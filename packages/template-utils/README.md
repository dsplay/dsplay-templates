# template-utils

Helper library for woring with custom templates in DSPLAY

### install

```
npm i -S @dsplay/template-utils
```

### usage

Follows a simple React example (easily adapted for inferior technologies :P)

```jsx
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

...

function MyComponent() {
    return (
        <div>
            <p>
                Media:
                <pre>{JSON.stringify(media, null, 4)}</pre>
            </p>
            <p>
                Config:
                <pre>{JSON.stringify(config, null, 4)}</pre>
            </p>
            <p>
                Template:
                <pre>{JSON.stringify(template, null, 4)}</pre>
            </p>
            <p>String: {tval('title', 'Default Value')}</p>
            <p>Boolean: {tbval('expanded', true) ? 'Yes' : 'No'}</p>
            <p>Int: {tival('page_size', 10)}</p>
            <p>Double: {tfval('rate', .75)}</p>
            <p>Vertical?: {isVertical ? 'Yes' : 'No'}</p>
        </div>
    )
}

```

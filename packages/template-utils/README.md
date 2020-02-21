# @dsplay/template-utils

A helper library for working with custom templates in [DSPLAY](https://dsplay.tv)

### Installation

#### ES Module
```
npm i -S @dsplay/template-utils
```

#### UMD
```html
<script src="https://unpkg.com/@dsplay/template-utils"></script>
```

### Usage

#### ES Module

Follows a simple React example (easily adaptable for inferior technologies :P)

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


#### UMD

```js
// dsplayTemplateUtils var is exported by UMD module.

var fontSize = dsplayTemplateUtils.tval('base_font_size', '1.5em');
console.log(fontSize);

var titleOpacity = dsplayTemplateUtils.tfval('title_opacity', 1);
console.log(titleOpacity);
```

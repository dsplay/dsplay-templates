# @dsplay/react-template-utils

A helper library for working with custom templates in [DSPLAY](https://dsplay.tv)

### Installation

#### ES Module
```
npm i -S @dsplay/react-template-utils
```

#### UMD
```html
<script src="https://unpkg.com/@dsplay/react-template-utils"></script>
```

### Usage

This repo contains a sample app which shows how to use the components.

### Exploring components

```sh
npm run storybook
```

Runs [Storybook](https://storybook.js.org/) to browse every component in isolation. Not every component has a story yet — add one under `src/lib/components/<name>/<name>.stories.jsx` as you touch it.

### `Loader` and task failures

`Loader` shows a placeholder while fonts/images preload and any extra `tasks` (promises) resolve, then renders its children wrapped in a `LoaderContext.Provider`. A rejected task does **not** hold up the others or leave the placeholder shown forever (`5.2.1`+ — earlier versions used `Promise.all` internally and would hang here): it settles as `undefined` in `tasksResults` at that same index, with the rejection reason exposed in parallel via `tasksErrors`, both read off `LoaderContext`:

```jsx
import { Loader, LoaderContext, useMedia } from '@dsplay/react-template-utils';
import { useContext } from 'react';

function App() {
  const media = useMedia();
  const tasks = [fetchSomeData(media)]; // a promise that may reject

  return (
    <Loader tasks={tasks}>
      <Main />
    </Loader>
  );
}

function Main() {
  const { tasksResults: [data], tasksErrors: [error] } = useContext(LoaderContext);

  if (error) return <p>Something went wrong loading the data.</p>;
  return <p>{data}</p>;
}
```

See `template-boilerplate-react` for a small runnable example (a task that deliberately fails, and the corresponding `tasksErrors` check), and `template-flight-information` for a complete production example — a translated error message shown only when there's truly no data left to fall back on, not on every single failed request.

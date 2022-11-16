# Simple calendar - Template
- Template for a simple calendar.

## Supported Screen Formats/Resolutions

- Landscape

  ![Landscape](docs/screenshots/landscape.png)
- Portrait

  ![Portrait](docs/screenshots/portrait.png)
- Square

  ![Square](docs/screenshots/square.png)
- Horizontal Banner

  ![Horizontal Banner](docs/screenshots/horizontalBanner.png)

## Getting started
```
  git clone https://github.com/dsplay/template-simple-calendar.git my-awesome-template
  cd my-awesome-template
  rm -rf .git
  npm install
  npm start
```

## Packing (release build)
  To create a release build of the template, ready to be uploaded to DSPLAY, just run:
  ```
    npm run zip
  ```
  It will generate a template.zip file ready to be deployed to [DSPLAY Web Manager](https://manager.dsplay.tv/template/create)

## More

The see more about DSPLAY HTML Templates, visit: https://developers.dsplay.tv/docs/html-templates

## For developers

### Loader settings
- ![Loader](docs/screenshots/loader.png)
- In this file you will find the loading animation, which can be chaned. PATH (src/components/loaderCallendar)

### Translate settings
- ![Translate](docs/screenshots/translate.png)

- In this file you can find the configured languages, which can be changed, the date-fns library is used for date formatting. PATH (src/translate-settings/languageSettings)
![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)


# DSPLAY - Countup
- Template to display a countup.

## Support Screen Formats/Resolutions

- Landscape

  ![Landscape](docs/screenshots/landscape.png)

- Portrait

  ![Portrait](docs/screenshots/portraid.png)

- Square

  ![Square](docs/screenshots/square.png)

### Configuration

  This template has some configuration variables as the following table shows:

| Variable              | Type    | Default    | Description                                        |
|-----------------------|---------|------------| ---------------------------------------------------|
| `bg_color_1`          | color   | #2b32b2    | Background Color 1.                                |
| `bg_color_2`          | color   | #1488cc    | [optional] Background Color 2. (for gradient bg)   |
| `bg_image`            | image   | none       | Background Image    

## Getting started
```
  git clone https://github.com/dsplay/template-count-up my-awesome-template
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

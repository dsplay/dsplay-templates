![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Digital Clock

This template is built on top of the [DSPLAY - jQuery Template Boilerplate](https://github.com/dsplay/template-boilerplate-jquery).

## Variables

This template has some configuration variables as the following table shows:

| Variable              | Type    | Required | Default   | Description                                                                                                                           |
|-----------------------|---------|----------|-----------|---------------------------------------------------------------------------------------------------------------------------------------|
| `background`          | image   | No       |           | The background image                                                                                                                  |
| `barColor`            | string  | No       | `#FFF`    | Bar background color                                                                                                                  |
| `barOpacity`          | string  | No       | `0.6`     |                                                                                                                                       |
| `dateColor`           | string  | No       | `#000`    | Date foreground color                                                                                                                 |
| `timeColor`           | string  | No       | `#000`    | Time foreground color                                                                                                                 |


## Packing

To pack your template, just zip all the files of the project (except the `.git` folder).

> **IMPORTANT**: When zipping your template, the `index.html` file must be located in the root of the `.zip` file, not inside any folder.

For linux users, just run:
```sh
./pack.sh
```

It will generate a `template.zip` file ready to be deployed to [DSPLAY Web Manager](https://manager.dsplay.tv/template/create)

## More

The see more about DSPLAY HTML Templates, visit: https://developers.dsplay.tv/docs/html-templates
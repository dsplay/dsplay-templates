![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Image Template

This is a simple responsive image template

> This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Parameters

- `fit`: defines how the image will fit to the container
  - `cover` (default): image covers all available space keeping original proportion;
  - `contain`: the image will be shown entirely keeping the original proportion. This can cause empty space;
  - `stretch`: the image will be stretched to fill all the space without keeping the original proportion.

## Packing (release build)

To create a release build of the template, ready to be uploaded to DSPLAY, just run:

```
npm run zip
```

It will generate a `template.zip` file ready to be deployed to [DSPLAY Web Manager](https://manager.dsplay.tv/template/create)

## More

The see more about DSPLAY HTML Templates, visit: https://developers.dsplay.tv/docs/html-templates
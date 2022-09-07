/** 
 * Contents of this file will be ignored at runtime
**/

var dsplay_config = {
  orientation: 'landscape', // 'landscape' or 'portrait'
  width: 1280, // Screen width of device
  height: 720, // Screen height of device
  os: 'android', // for future use
  osVersion: 17, // Android SDK version
  appVersion: 101, // DSPLAY App version code
  appVersionName: '2.50.8', // DSPLAY App version name
  locale: 'en_us', // Current locale
};

var dsplay_media = {
  // General Info
  id: 1, // Media ID
  name: 'DSPLAY - Digital Signage', //
  count: 25, // A internal counter that stores how many media items were played until this point
  iteration: 4, // A internal counter that stores haw many times this particular media was played
  duration: 15000, // The media duration in milliseconds

  // here you will have more fields depending on the media type
  images: [
    'https://source.unsplash.com/2ShvY8Lf6l0',
    'https://source.unsplash.com/Dm-qxdynoEc',
    'https://source.unsplash.com/qDkso9nvCg0',
    'https://source.unsplash.com/iecJiKe_RNg',
    'https://source.unsplash.com/epcsn8Ed8kY',
    'https://source.unsplash.com/NQSWvyVRIJk',
    'https://source.unsplash.com/zh7GEuORbUw',
    'https://source.unsplash.com/PpOHJezOalU',
    'https://source.unsplash.com/I1ASdgphUH4',
    'https://source.unsplash.com/XiDA78wAZVw',
    'https://source.unsplash.com/x8xJpClTvR0',
    'https://source.unsplash.com/qGQNmBE7mYw',
    'https://source.unsplash.com/NuO6iTBkHxE',
    'https://source.unsplash.com/pF1ug8ysTtY',
    'https://source.unsplash.com/A-fubu9QJxE',
    'https://source.unsplash.com/5P91SF0zNsI',
    'https://source.unsplash.com/Uw0PjM7WKPQ',
    'https://source.unsplash.com/hOGGq-e4aWI',
    'https://source.unsplash.com/-V2SNXfhbwE',
    'https://source.unsplash.com/JL4OgwQ0NHs',
  ]
};

// these variables must be registered during the template creation in the Web Manager
var dsplay_template = {
  // animation: 'ddd',
};
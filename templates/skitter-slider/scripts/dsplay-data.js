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
    'https://picsum.photos/seed/skitter1/1600/900',
    'https://picsum.photos/seed/skitter2/1600/900',
    'https://picsum.photos/seed/skitter3/1600/900',
    'https://picsum.photos/seed/skitter4/1600/900',
    'https://picsum.photos/seed/skitter5/1600/900',
    'https://picsum.photos/seed/skitter6/1600/900',
    'https://picsum.photos/seed/skitter7/1600/900',
    'https://picsum.photos/seed/skitter8/1600/900',
    'https://picsum.photos/seed/skitter9/1600/900',
    'https://picsum.photos/seed/skitter10/1600/900',
    'https://picsum.photos/seed/skitter11/1600/900',
    'https://picsum.photos/seed/skitter12/1600/900',
    'https://picsum.photos/seed/skitter13/1600/900',
    'https://picsum.photos/seed/skitter14/1600/900',
    'https://picsum.photos/seed/skitter15/1600/900',
    'https://picsum.photos/seed/skitter16/1600/900',
    'https://picsum.photos/seed/skitter17/1600/900',
    'https://picsum.photos/seed/skitter18/1600/900',
    'https://picsum.photos/seed/skitter19/1600/900',
    'https://picsum.photos/seed/skitter20/1600/900',
  ]
};

// these variables must be registered during the template creation in the Web Manager
var dsplay_template = {
  animation: 'fade',
};
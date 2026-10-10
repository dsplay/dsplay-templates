var dsplay_config = {
  // config parameters
  locale: 'pt_br',
  orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
  // Android SDK version
  osVersion: 19,
  // DSPLAY App version code
  appVersion: 99,
};

var dsplay_media = {
  duration: 30000,

  // for json service based media
  // Wikimedia Commons, freely licensed, permanent hotlink (real customer media
  // is uploaded by the DSPLAY player - this is only shown in dev/CMS preview)
  imagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Gullfoss%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_119.JPG/1280px-Gullfoss%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_119.JPG',

  // custom media parameters
  customMediaParam: "value",
};

var dsplay_template = {
  fit: 'cover',
};
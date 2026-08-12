var dsplay_config = {
    // config parameters
    locale: 'en',
    orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
    // Android SDK version
    osVersion: 19,
    // DSPLAY App version code
    appVersion: 99,
};

var dsplay_media = {
    logo: '',
    duration: 30000,
    // maxPageDurationSeconds: 10,
    targets: [{
        name: 'Reception',
        place: 'Floor 1',
        floor: 'Ground floor',
        direction: 'down_left', // up, up_right, right, down_right, down, down_left, left, up_left
        logo: '',
    }, {
        name: 'Restaurant',
        place: 'Floor 2',
        floor: '2nd floor',
        direction: 'left',
        logo: '../test-assets/tramontina.png',
    }, {
        name: 'Conference Room A',
        place: 'Floor 3',
        floor: '3rd floor',
        direction: 'right',
        logo: '../test-assets/logo_esquerda.png',
    }, {
        name: 'Gym',
        place: 'Floor 1',
        floor: 'Ground floor',
        direction: 'up',
        logo: '',
    }];
};

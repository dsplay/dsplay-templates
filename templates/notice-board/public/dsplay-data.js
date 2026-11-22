var dsplay_config = {
    locale: 'pt_br',
    orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
    // Android SDK version
    osVersion: 19,
    // DSPLAY App version code
    appVersion: 99,
};

// What the notice board gateway hands over: one picked post (kind card, long_post or ticker) as `blocks`.
var dsplay_media = {
    duration: 15000,
    kind: 'card',
    title: 'Reunião de condomínio',
    blocks: [
        { text: 'Assembleia geral quinta-feira, ' },
        { text: '19h', bold: true },
        { text: ', no salão de festas.\nPauta na portaria.' },
    ],
};

var dsplay_template = {
    background_color: '#0b3b4a',
    show_title: 'true',
    ticker_speed: '120',
};

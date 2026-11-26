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
    result: { "validity": "2018-08-13T18:22:55.238Z", "showOutdated": true, "data": {} },

    // custom media parameters
    customMediaParam: "value",
};

var dsplay_template = {
    theme: 'light',
    show_clock: 'true',
    show_date: 'true',
    time_format: '24h',
    widgets_order: 'clock,weather,quotes,news,company',
    latitude: '-23.55',
    longitude: '-46.63',
    weather_unit: 'celsius',
    source_currency_1: 'USD',
    source_currency_2: 'BTC',
    target_currency: 'BRL',
    rss_url: 'https://g1.globo.com/rss/g1/',
    rss_logo: './test-assets/news-1.svg',
    news_interval: '30',
    show_logo: 'true',
    logo: '',
    logo_url: '',
    rss_logo_url: '',
    relief_strength: 'normal',
    layout_position: 'center',
    rounded_corners: 'true',
    animation_enabled: 'true',
    debug: 'false',
};

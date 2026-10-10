/**
 * Contents of this file will be ignored at runtime
**/

var dsplay_config = {
    orientation: 'landscape', // 'landscape' or 'portrait'
    width: 1920, // Screen width of device
    height: 1080, // Screen height of device
    os: 'android', // for future use
    osVersion: 19, // Android SDK version
    appVersion: 101, // DSPLAY App version code
    appVersionName: '2.50.8', // DSPLAY App version name
    locale: 'pt_br', // Current locale
};

var dsplay_media = {
    // General Info
    id: 1, // Media ID
    name: 'BCB Exchange Rates', //
    count: 25, // A internal counter that stores how many media items were played until this point
    iteration: 4, // A internal counter that stores haw many times this particular media was played
    duration: 15000, // The media duration in milliseconds

    // This template's media type is backed by a JSON service - result.exchanges is keyed by
    // currency code, each with a buy/sell rate object. Matches the real payload from the
    // Central Bank of Brazil (BCB) exchange rate feed.
    result: {
        version: '1.0.0',
        validity: '2017-07-21 23:59:59',
        exchanges: {
            USD: {
                buy: {
                    name: 'Taxa de câmbio - Livre - Dólar americano (compra)',
                    code: '10813',
                    value: 3.1396,
                    date: '2017-7-20',
                },
                sell: {
                    name: 'Taxa de câmbio - Livre - Dólar americano (venda) - diário',
                    code: '1',
                    value: 3.1402,
                    date: '2017-7-20',
                },
            },
            EUR: {
                buy: {
                    name: 'Taxa de câmbio - Livre - Euro (compra)',
                    code: '21620',
                    value: 3.652,
                    date: '2017-7-20',
                },
                sell: {
                    name: 'Taxa de câmbio - Livre - Euro (venda)',
                    code: '21619',
                    value: 3.6536,
                    date: '2017-7-20',
                },
            },
        },
    },
};

// this template has no dsplay_template variables - see README
var dsplay_template = {
};

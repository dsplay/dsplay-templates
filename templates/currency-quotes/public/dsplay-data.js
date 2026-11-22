var dsplay_config = {
    locale: 'pt_br',
    orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
    // Android SDK version
    osVersion: 19,
    // DSPLAY App version code
    appVersion: 99,
};

var dsplay_media = {
    // What the DSPLAY player gateway answers for a Currency quotes media ("currency-quotes/1"); the player puts it here as `result`, with how long the
    // media stays on screen (`duration`, ms). Every field is filled so that the CMS preview and the screenshots show the whole template.
    // `price` is what one unit of the item is worth in the base (mode "price") or what one unit of the base is worth in the item (mode "inverse");
    // `changePct` is the change of the day and `series` the price over the period, oldest first (30 points, or 7 for the week).
    // To try another screen from the dev server add ?count=N (how many quotes, 1 to 12), ?period=none|7d|30d, ?mode=inverse, ?decimals=auto|0..8,
    // ?locale=en (or es, fr, de, it), ?duration=12000, ?long=1 (long names), ?empty=1 (an answer with nothing to show), ?flags=0 (the template variable show_flags off), ?colors=base (base_perspective on).
    duration: 30000,
    result: {
        "schema": "currency-quotes/1",
        "base": "BRL",
        "baseName": "Real",
        "date": "2026-11-20",
        "mode": "price",
        "period": "30d",
        "decimals": "auto",
        "items": [
            { "code": "USD", "name": "US Dollar", "kind": "fiat", "price": 5.93438836, "changePct": 0.89, "seed": 1, "drift": 0.04 },
            { "code": "EUR", "name": "Euro", "kind": "fiat", "price": 6.4271, "changePct": -0.31, "seed": 2, "drift": -0.02 },
            { "code": "BTC", "name": "Bitcoin", "kind": "crypto", "price": 366334.51, "changePct": 2.84, "seed": 3, "drift": 0.18 },
            { "code": "GBP", "name": "British Pound", "kind": "fiat", "price": 7.5412, "changePct": 0.12, "seed": 4, "drift": 0.01 },
            { "code": "ETH", "name": "Ethereum", "kind": "crypto", "price": 10318.27, "changePct": -1.47, "seed": 5, "drift": -0.1 },
            { "code": "JPY", "name": "Japanese Yen", "kind": "fiat", "price": 0.037295, "changePct": -0.62, "seed": 6, "drift": -0.05 },
            { "code": "ARS", "name": "Argentine Peso", "kind": "fiat", "price": 0.0041, "changePct": 0.0, "seed": 7, "drift": 0.0 },
            { "code": "SOL", "name": "Solana", "kind": "crypto", "price": 982.14, "changePct": 5.21, "seed": 8, "drift": 0.25 },
            { "code": "DOGE", "name": "Dogecoin", "kind": "crypto", "price": 0.3407, "changePct": -3.18, "seed": 9, "drift": -0.15 },
            { "code": "USDT", "name": "Tether", "kind": "crypto", "price": 5.9411, "changePct": 0.02, "seed": 10, "drift": 0.0 },
            { "code": "SHIB", "name": "Shiba Inu", "kind": "crypto", "price": 0.0000222, "changePct": 1.9, "seed": 11, "drift": 0.12 },
            { "code": "CHF", "name": "Swiss Franc", "kind": "fiat", "price": 6.6873, "changePct": 0.44, "seed": 12, "drift": 0.03 }
        ]
    }
};

var dsplay_template = {
    // show the flag of the countries' currencies instead of their code in the round mark (the euro has the flag of the European Union)
    show_flags: true,
    // read the colors from the base's point of view: a fall of the currency is green (the base gains) and a rise is red; the arrows keep the real direction
    base_perspective: false,
};

// Dev server only: the page's own address picks the screen (the player never sets these; it injects the real data before any script runs).
(function () {
    var query = window.location.search;
    var pick = function (name, pattern) { var m = new RegExp('[?&]' + name + '=(' + pattern + ')').exec(query); return m ? m[1] : null; };
    var count = pick('count', '\\d+');
    var period = pick('period', 'none|7d|30d');
    var mode = pick('mode', 'inverse|price');
    var decimals = pick('decimals', 'auto|\\d');
    var locale = pick('locale', '[A-Za-z_-]+');
    var duration = pick('duration', '\\d+');
    var long = pick('long', '\\d+');
    var flags = pick('flags', '0|1');
    var colors = pick('colors', 'base|price');
    var result = dsplay_media.result;
    if (period) result.period = period;
    if (mode) result.mode = mode;
    if (decimals) result.decimals = decimals === 'auto' ? 'auto' : Number(decimals);
    if (locale) dsplay_config.locale = locale;
    if (duration) dsplay_media.duration = Number(duration);
    if (count) result.items = result.items.slice(0, Number(count));
    if (pick('empty', '1')) result.items = [];
    if (flags) dsplay_template.show_flags = flags === '1';
    if (colors) dsplay_template.base_perspective = colors === 'base';
    var points = result.period === '7d' ? 7 : result.period === '30d' ? 30 : 0;
    // a small deterministic walk that ends at the price: the same screen every time
    result.items.forEach(function (item) {
        var state = item.seed * 9301;
        var next = function () { state = (state * 9301 + 49297) % 233280; return state / 233280 - 0.5; };
        var series = [];
        for (var i = 0; i < points; i++) {
            var back = points - 1 - i;
            series.push(item.price * (1 - item.drift * back / points * 0.6 + next() * 0.04));
        }
        if (points) series[points - 1] = item.price;
        item.series = series;
        if (long) item.name = new Array(Number(long) + 1).join(item.name + ' ');
        if (result.mode === 'inverse') {
            item.price = 1 / item.price;
            item.series = item.series.map(function (v) { return 1 / v; });
            item.changePct = -item.changePct;
        }
        delete item.seed;
        delete item.drift;
    });
})();

var dsplay_config = {
    locale: 'pt_br',
    orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
    // Android SDK version
    osVersion: 19,
    // DSPLAY App version code
    appVersion: 99,
};

// Hotspot areas of the world, as [latitude, longitude, spread in degrees, weight]: the example answer scatters its map cells around them
// with a fixed seed, so the screenshots and the CMS preview always show the same full answer.
var wildfire_areas = [
    [7.5, 28.5, 4.5, 3.0],     // South Sudan
    [-12.5, 22.0, 5.5, 2.4],   // Angola, DR Congo
    [6.5, 21.0, 3.5, 1.8],     // Central African Republic
    [-9.0, -55.0, 5.0, 2.2],   // Amazon arc
    [-15.0, -47.5, 3.5, 1.4],  // Cerrado
    [-16.5, 133.0, 5.0, 1.8],  // Northern Australia
    [24.0, 82.0, 3.5, 1.5],    // India
    [22.0, 101.0, 3.0, 1.2],   // Southeast Asia
    [31.0, 114.0, 3.0, 1.0],   // China
    [10.0, 8.0, 3.0, 1.1],     // Nigeria
    [-14.0, 36.0, 2.5, 0.9],   // Mozambique
    [37.0, -120.0, 2.5, 0.5],  // California
    [58.0, 100.0, 5.0, 0.4]    // Siberia
];

function wildfire_points() {
    var seed = 20261115;
    function random() {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
    }
    var points = [];
    wildfire_areas.forEach(function (area) {
        var cells = Math.round(28 * area[3]);
        for (var i = 0; i < cells; i += 1) {
            var count = 1 + Math.floor(Math.pow(random(), 3) * 70 * area[3]);
            var recent = Math.max(0, Math.min(count, Math.round(count * (0.35 + random() * 0.65))));
            points.push({
                lat: Math.round((area[0] + (random() - 0.5) * 2 * area[2]) * 1000) / 1000,
                lon: Math.round((area[1] + (random() - 0.5) * 2 * area[2] * 1.3) * 1000) / 1000,
                count: count,
                recent: recent,
                frpMw: Math.round((2 + random() * 120) * 10) / 10
            });
        }
    });
    return points;
}

var dsplay_media = {
    // what the DSPLAY player gateway answers for a WILDFIRE_MONITOR media ("wildfire/1"); the player puts it here as `result`
    // and refetches it when it expires. Every field is filled so that the CMS preview and the screenshots show the whole
    // template: the world scope, ten countries with a rising, a falling and a new trend, the map cells and the source.
    // Change `scope` to {"type":"radius","lat":-8.05,"lon":-34.9,"radiusKm":300} or {"type":"country",...} (and `regionLevel`
    // to "subdivision" with BR-xx codes) to see the other areas.
    duration: 30000,
    result: {
        "schema": "wildfire/1",
        "generatedAt": "2026-11-15T15:00:00.000Z",
        "scope": { "type": "world" },
        "summary": {
            "last24h": 66824,
            "previous24h": 50021,
            "observedAt": "2026-11-15T13:59:00.000Z",
            "sensors": ["VIIRS_NOAA21_NRT", "VIIRS_NOAA20_NRT"]
        },
        "regionLevel": "country",
        "regions": [
            { "code": "SS", "detections": 11631, "previous": 15386 },
            { "code": "BR", "detections": 5690, "previous": 5690 },
            { "code": "AU", "detections": 4707, "previous": 3100 },
            { "code": "CF", "detections": 3793, "previous": 5740 },
            { "code": "CN", "detections": 3612, "previous": 2446 },
            { "code": "IN", "detections": 3409, "previous": 4668 },
            { "code": "AO", "detections": 3120, "previous": 2711 },
            { "code": "CD", "detections": 2987, "previous": 3402 },
            { "code": "NG", "detections": 2240, "previous": 1100 },
            { "code": "MZ", "detections": 1893, "previous": 0 }
        ],
        "points": wildfire_points(),
        "sources": [
            {
                "text": "NASA FIRMS (LANCE) active fire data: VIIRS and MODIS",
                "url": "https://firms.modaps.eosdis.nasa.gov",
                "license": "NASA open data; detections are not confirmed fires"
            }
        ]
    }
};

var dsplay_template = {
    // this template has no variables
};

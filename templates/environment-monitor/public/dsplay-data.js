var dsplay_config = {
    locale: 'pt_br',
    orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
    // Android SDK version
    osVersion: 19,
    // DSPLAY App version code
    appVersion: 99,
};

var dsplay_media = {
    // the pages of rain cards share this time
    duration: 30000,

    // what the DSPLAY player gateway answers for an ENVIRONMENT_MONITOR media ("environment/1"); the player puts it
    // here as `result` and refetches it when it expires. Every field is filled, in every dataset, so that the CMS
    // preview and the screenshots show the whole template: rain of every intensity (2 pages), rivers in every status,
    // warnings of three severities, twelve weather stations and the five mesoregions.
    result: {
        "schema": "environment/1",
        "generatedAt": "2026-11-14T19:00:00.000Z",
        "units": {
            "rain": "mm",
            "temperature": "C",
            "wind": "km/h",
            "level": "cm",
            "pressure": "hPa"
        },
        "sources": {
            "rainfall": {
                "id": "br-cemaden",
                "name": "CEMADEN",
                "country": "BR",
                "attribution": {
                    "text": "CEMADEN – Centro Nacional de Monitoramento e Alertas de Desastres Naturais",
                    "url": "https://example.org/br-cemaden",
                    "license": "Dados abertos"
                }
            },
            "alerts": {
                "id": "br-inmet",
                "name": "INMET",
                "country": "BR",
                "attribution": {
                    "text": "INMET – Instituto Nacional de Meteorologia",
                    "url": "https://example.org/br-inmet",
                    "license": null
                }
            },
            "rivers": {
                "id": "br-pe-apac",
                "name": "APAC",
                "country": "BR",
                "attribution": {
                    "text": "APAC – Agência Pernambucana de Águas e Clima",
                    "url": "https://example.org/br-pe-apac",
                    "license": null
                }
            },
            "conditions": {
                "id": "br-pe-apac",
                "name": "APAC",
                "country": "BR",
                "attribution": {
                    "text": "APAC – Agência Pernambucana de Águas e Clima",
                    "url": "https://example.org/br-pe-apac",
                    "license": null
                }
            },
            "climate": {
                "id": "br-pe-apac",
                "name": "APAC",
                "country": "BR",
                "attribution": {
                    "text": "APAC – Agência Pernambucana de Águas e Clima",
                    "url": "https://example.org/br-pe-apac",
                    "license": null
                }
            }
        },
        "unavailable": [],
        "summary": {
            "rainfall": {
                "stationsReporting": 312,
                "stationsRaining": 16,
                "maxLast1hMm": 52.4
            },
            "alerts": {
                "count": 3,
                "maxSeverity": "severe"
            },
            "rivers": {
                "stations": 8,
                "byStatus": {
                    "normal": 5,
                    "attention": 1,
                    "alert": 1,
                    "flood": 1
                }
            },
            "conditions": {
                "stations": 12
            },
            "climate": {
                "regions": 5
            }
        },
        "rainfall": [
            {
                "id": "2609",
                "name": "Camaragibe",
                "operator": "CEMADEN",
                "city": "CAMARAGIBE",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 52.4,
                "last3hMm": 60.1,
                "last6hMm": 66.0,
                "last24hMm": 71.0,
                "last72hMm": 80.5,
                "intensity": "extreme"
            },
            {
                "id": "2601",
                "name": "Ibura",
                "operator": "CEMADEN",
                "city": "RECIFE",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 31.2,
                "last3hMm": 44.0,
                "last6hMm": 52.3,
                "last24hMm": 61.5,
                "last72hMm": 70.1,
                "intensity": "very_heavy"
            },
            {
                "id": "2612",
                "name": "Várzea",
                "operator": "CEMADEN",
                "city": "RECIFE",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 27.8,
                "last3hMm": 38.2,
                "last6hMm": 45.0,
                "last24hMm": 58.4,
                "last72hMm": 66.9,
                "intensity": "very_heavy"
            },
            {
                "id": "2602",
                "name": "Dois Unidos",
                "operator": "CEMADEN",
                "city": "RECIFE",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 14.6,
                "last3hMm": 22.4,
                "last6hMm": 31.0,
                "last24hMm": 40.2,
                "last72hMm": 52.0,
                "intensity": "heavy"
            },
            {
                "id": "2613",
                "name": "Brasília Teimosa",
                "operator": "CEMADEN",
                "city": "RECIFE",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 11.2,
                "last3hMm": 18.6,
                "last6hMm": 25.4,
                "last24hMm": 36.8,
                "last72hMm": 47.5,
                "intensity": "heavy"
            },
            {
                "id": "2603",
                "name": "Alto José do Pinho",
                "operator": "CEMADEN",
                "city": "RECIFE",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 8.0,
                "last3hMm": 15.1,
                "last6hMm": 22.6,
                "last24hMm": 33.0,
                "last72hMm": 41.2,
                "intensity": "heavy"
            },
            {
                "id": "2614",
                "name": "Jardim Brasil",
                "operator": "CEMADEN",
                "city": "OLINDA",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 6.2,
                "last3hMm": 11.0,
                "last6hMm": 16.8,
                "last24hMm": 24.6,
                "last72hMm": 31.0,
                "intensity": "moderate"
            },
            {
                "id": "2604",
                "name": "Passarinho",
                "operator": "CEMADEN",
                "city": "OLINDA",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 4.4,
                "last3hMm": 9.8,
                "last6hMm": 14.2,
                "last24hMm": 20.0,
                "last72hMm": 26.3,
                "intensity": "moderate"
            },
            {
                "id": "2615",
                "name": "Janga",
                "operator": "CEMADEN",
                "city": "PAULISTA",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 3.8,
                "last3hMm": 7.6,
                "last6hMm": 11.0,
                "last24hMm": 17.2,
                "last72hMm": 22.4,
                "intensity": "moderate"
            },
            {
                "id": "2605",
                "name": "Vila Popular",
                "operator": "CEMADEN",
                "city": "PAULISTA",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 3.0,
                "last3hMm": 5.2,
                "last6hMm": 8.4,
                "last24hMm": 12.6,
                "last72hMm": 15.0,
                "intensity": "moderate"
            },
            {
                "id": "2616",
                "name": "Piedade",
                "operator": "CEMADEN",
                "city": "JABOATÃO DOS GUARARAPES",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 2.2,
                "last3hMm": 3.6,
                "last6hMm": 5.0,
                "last24hMm": 8.2,
                "last72hMm": 11.4,
                "intensity": "light"
            },
            {
                "id": "2606",
                "name": "Engenho Velho",
                "operator": "CEMADEN",
                "city": "JABOATÃO DOS GUARARAPES",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 1.6,
                "last3hMm": 2.4,
                "last6hMm": 3.8,
                "last24hMm": 6.8,
                "last72hMm": 9.9,
                "intensity": "light"
            },
            {
                "id": "2607",
                "name": "Muribeca",
                "operator": "CEMADEN",
                "city": "JABOATÃO DOS GUARARAPES",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 0.8,
                "last3hMm": 1.2,
                "last6hMm": 2.0,
                "last24hMm": 3.1,
                "last72hMm": 4.0,
                "intensity": "light"
            },
            {
                "id": "2617",
                "name": "Candeias",
                "operator": "CEMADEN",
                "city": "JABOATÃO DOS GUARARAPES",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 0.6,
                "last3hMm": 0.9,
                "last6hMm": 1.4,
                "last24hMm": 2.6,
                "last72hMm": 3.5,
                "intensity": "light"
            },
            {
                "id": "2610",
                "name": "Igarassu",
                "operator": "CEMADEN",
                "city": "IGARASSU",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 0.4,
                "last3hMm": 0.8,
                "last6hMm": 1.2,
                "last24hMm": 2.0,
                "last72hMm": 3.2,
                "intensity": "light"
            },
            {
                "id": "2608",
                "name": "Cabo de Santo Agostinho",
                "operator": "CEMADEN",
                "city": "CABO DE SANTO AGOSTINHO",
                "state": "PE",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "last1hMm": 0.2,
                "last3hMm": 0.2,
                "last6hMm": 0.6,
                "last24hMm": 1.0,
                "last72hMm": 2.2,
                "intensity": "light"
            }
        ],
        "alerts": [
            {
                "id": "inmet-9001",
                "event": "Chuvas Intensas",
                "language": "pt",
                "severity": "severe",
                "color": "#ff0000",
                "description": "Chuva entre 50 e 100 mm/h ou acumulado superior a 100 mm/dia, risco de alagamentos e deslizamentos.",
                "instruction": "Evite áreas de risco e não atravesse vias alagadas.",
                "areas": [
                    "Recife",
                    "Olinda",
                    "Camaragibe"
                ],
                "areaCount": 14,
                "onset": "2026-11-14T12:00:00.000Z",
                "expires": "2026-11-15T12:00:00.000Z",
                "sender": "INMET"
            },
            {
                "id": "inmet-9002",
                "event": "Chuvas Intensas",
                "language": "pt",
                "severity": "moderate",
                "color": "#ffcc00",
                "description": "Chuva entre 30 e 60 mm/h ou até 100 mm/dia.",
                "instruction": "Observe o avanço das águas e proteja seus bens.",
                "areas": [
                    "Paulista",
                    "Igarassu"
                ],
                "areaCount": 9,
                "onset": "2026-11-14T15:00:00.000Z",
                "expires": "2026-11-15T15:00:00.000Z",
                "sender": "INMET"
            },
            {
                "id": "inmet-9003",
                "event": "Ventos Costeiros",
                "language": "pt",
                "severity": "minor",
                "color": "#ffee88",
                "description": "Ventos de 40 a 60 km/h na faixa litorânea.",
                "instruction": "Cuidado com objetos soltos e embarcações.",
                "areas": [
                    "Cabo de Santo Agostinho"
                ],
                "areaCount": 6,
                "onset": "2026-11-14T09:00:00.000Z",
                "expires": "2026-11-15T09:00:00.000Z",
                "sender": "INMET"
            }
        ],
        "rivers": [
            {
                "id": "PE001H",
                "name": "Engenho Velho",
                "operator": "APAC",
                "river": "Capibaribe",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "levelCm": 342.0,
                "thresholds": {
                    "attention": 200,
                    "alert": 230,
                    "flood": 330
                },
                "status": "flood",
                "trend": "rising"
            },
            {
                "id": "PE004H",
                "name": "Limoeiro",
                "operator": "APAC",
                "river": "Capibaribe",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "levelCm": 251.5,
                "thresholds": {
                    "attention": 200,
                    "alert": 230,
                    "flood": 330
                },
                "status": "alert",
                "trend": "rising"
            },
            {
                "id": "PE002H",
                "name": "Várzea",
                "operator": "APAC",
                "river": "Capibaribe",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "levelCm": 205.5,
                "thresholds": {
                    "attention": 200,
                    "alert": 230,
                    "flood": 330
                },
                "status": "attention",
                "trend": "steady"
            },
            {
                "id": "PE005H",
                "name": "Jaboatão",
                "operator": "APAC",
                "river": "Jaboatão",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "levelCm": 188.0,
                "thresholds": {
                    "attention": 210,
                    "alert": 260,
                    "flood": 340
                },
                "status": "normal",
                "trend": "falling"
            },
            {
                "id": "PE003H",
                "name": "Palmares",
                "operator": "APAC",
                "river": "Una",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "levelCm": 90.0,
                "thresholds": {
                    "attention": 250,
                    "alert": 300,
                    "flood": 400
                },
                "status": "normal",
                "trend": "falling"
            },
            {
                "id": "PE006H",
                "name": "Barreiros",
                "operator": "APAC",
                "river": "Una",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "levelCm": 132.4,
                "thresholds": {
                    "attention": 250,
                    "alert": 300,
                    "flood": 400
                },
                "status": "normal",
                "trend": "steady"
            },
            {
                "id": "PE007H",
                "name": "Água Preta",
                "operator": "APAC",
                "river": "Sirinhaém",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "levelCm": 176.0,
                "thresholds": {
                    "attention": 220,
                    "alert": 280,
                    "flood": 360
                },
                "status": "normal",
                "trend": "rising"
            },
            {
                "id": "PE008H",
                "name": "Goiana",
                "operator": "APAC",
                "river": "Goiana",
                "observedAt": "2026-11-14T18:50:00.000Z",
                "levelCm": 215.0,
                "thresholds": {
                    "attention": 240,
                    "alert": 300,
                    "flood": 380
                },
                "status": "normal",
                "trend": "steady"
            }
        ],
        "conditions": [
            {
                "id": "B410U",
                "name": "Petrolina",
                "operator": "INMET",
                "city": "Petrolina",
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureC": 36.8,
                "humidityPct": 30,
                "windKmh": 14.4
            },
            {
                "id": "B411U",
                "name": "Floresta",
                "operator": "INMET",
                "city": "Floresta",
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureC": 35.1,
                "humidityPct": 34,
                "windKmh": 12.0
            },
            {
                "id": "A313M",
                "name": "Cabrobó",
                "operator": "INMET",
                "city": "Cabrobó",
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureC": 34.6,
                "humidityPct": 32,
                "windKmh": 13.1
            },
            {
                "id": "A305M",
                "name": "Arcoverde",
                "operator": "APAC",
                "city": "Arcoverde",
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureC": 33.4,
                "humidityPct": 41,
                "windKmh": 18.7
            },
            {
                "id": "A309M",
                "name": "Serra Talhada",
                "operator": "APAC",
                "city": "Serra Talhada",
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureC": 33.0,
                "humidityPct": 38,
                "windKmh": 15.2
            },
            {
                "id": "A301M",
                "name": "Recife",
                "operator": "APAC",
                "city": "Recife",
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureC": 31.4,
                "humidityPct": 62,
                "windKmh": 11.5
            },
            {
                "id": "A311M",
                "name": "Caruaru",
                "operator": "APAC",
                "city": "Caruaru",
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureC": 29.9,
                "humidityPct": 55,
                "windKmh": 16.8
            },
            {
                "id": "A312M",
                "name": "Palmares",
                "operator": "APAC",
                "city": "Palmares",
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureC": 29.2,
                "humidityPct": 68,
                "windKmh": 9.4
            },
            {
                "id": "A314M",
                "name": "Ipojuca",
                "operator": "APAC",
                "city": "Ipojuca",
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureC": 28.8,
                "humidityPct": 74,
                "windKmh": 10.2
            },
            {
                "id": "A315M",
                "name": "Surubim",
                "operator": "APAC",
                "city": "Surubim",
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureC": 28.1,
                "humidityPct": 59,
                "windKmh": 12.6
            },
            {
                "id": "A316M",
                "name": "Garanhuns",
                "operator": "APAC",
                "city": "Garanhuns",
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureC": 24.0,
                "humidityPct": 71,
                "windKmh": 7.3
            },
            {
                "id": "A317M",
                "name": "Triunfo",
                "operator": "APAC",
                "city": "Triunfo",
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureC": 22.6,
                "humidityPct": 78,
                "windKmh": 6.1
            }
        ],
        "climate": [
            {
                "id": "agreste-pernambucano",
                "name": "Agreste Pernambucano",
                "stations": 6,
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureNowC": 27.8,
                "humidityPct": 64,
                "temperatureMinC": 20.2,
                "temperatureMaxC": 31.5,
                "rainMm": 4.6,
                "etoMm": 3.9,
                "solarMj": 16.8,
                "windowStart": "2026-11-14T03:00:00.000Z",
                "windowEnd": "2026-11-14T18:10:00.000Z"
            },
            {
                "id": "mata-pernambucana",
                "name": "Mata Pernambucana",
                "stations": 5,
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureNowC": 29.4,
                "humidityPct": 70,
                "temperatureMinC": 22.0,
                "temperatureMaxC": 32.4,
                "rainMm": 9.8,
                "etoMm": 3.4,
                "solarMj": 15.2,
                "windowStart": "2026-11-14T03:00:00.000Z",
                "windowEnd": "2026-11-14T18:10:00.000Z"
            },
            {
                "id": "metropolitana-de-recife",
                "name": "Metropolitana de Recife",
                "stations": 4,
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureNowC": 30.9,
                "humidityPct": 66,
                "temperatureMinC": 23.4,
                "temperatureMaxC": 33.1,
                "rainMm": 12.4,
                "etoMm": 3.2,
                "solarMj": 14.1,
                "windowStart": "2026-11-14T03:00:00.000Z",
                "windowEnd": "2026-11-14T18:10:00.000Z"
            },
            {
                "id": "sertao-pernambucano",
                "name": "Sertão Pernambucano",
                "stations": 7,
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureNowC": 35.2,
                "humidityPct": 28,
                "temperatureMinC": 22.0,
                "temperatureMaxC": 38.4,
                "rainMm": 0.2,
                "etoMm": 5.8,
                "solarMj": 20.4,
                "windowStart": "2026-11-14T03:00:00.000Z",
                "windowEnd": "2026-11-14T18:10:00.000Z"
            },
            {
                "id": "sao-francisco-pernambucano",
                "name": "São Francisco Pernambucano",
                "stations": 3,
                "observedAt": "2026-11-14T18:10:00.000Z",
                "temperatureNowC": 36.1,
                "humidityPct": 26,
                "temperatureMinC": 24.6,
                "temperatureMaxC": 39.8,
                "rainMm": 0.0,
                "etoMm": 6.4,
                "solarMj": 21.7,
                "windowStart": "2026-11-14T03:00:00.000Z",
                "windowEnd": "2026-11-14T18:10:00.000Z"
            }
        ]
    },
};

var dsplay_template = {
    // this template has no variables
};

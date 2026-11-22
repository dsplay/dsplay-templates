var dsplay_config = {
    locale: 'pt_br',
    orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
    // Android SDK version
    osVersion: 19,
    // DSPLAY App version code
    appVersion: 99,
};

// Dev only: ?today=2026-09-07 makes the page believe it is that day (a real screen uses its own clock), to try a holiday, a long weekend or an ordinary day.
(function () {
    var match = /[?&]today=(\d{4})-(\d{2})-(\d{2})/.exec(window.location.search);
    if (!match) return;
    var RealDate = Date;
    var fixed = new RealDate(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0).getTime();
    function FakeDate(a, b, c, d, e, f, g) {
        if (arguments.length === 0) return new RealDate(fixed);
        if (arguments.length === 1) return new RealDate(a);
        return new RealDate(a, b, c, d || 1, e || 0, f || 0, g || 0);
    }
    FakeDate.prototype = RealDate.prototype;
    FakeDate.now = function () { return fixed; };
    FakeDate.UTC = RealDate.UTC;
    FakeDate.parse = RealDate.parse;
    window.Date = FakeDate;
})();

var dsplay_media = {
    // What the DSPLAY player gateway answers for a Holidays media ("holidays/1"); the player puts it here as `result`, with how long the media stays on screen
    // (`duration`, ms). This example is São Paulo (the city has its own list), Brazil's 2026 and 2027 holidays, so that the CMS preview and the screenshots show
    // something on any day of those two years. A real answer lists yesterday and the next `daysAhead` days. To try a day from the dev server add ?today=2026-09-07
    // (a holiday), ?today=2026-02-14 (Carnival, five days), ?today=2026-09-01 (a long weekend ahead), ?locale=en (or es, fr, de, it) for the template's own language.
    duration: 15000,
    result: {
            "schema": "holidays/1",
            "date": "2026-11-17",
            "country": "BR",
            "state": "SP",
            "region": "SP",
            "city": "São Paulo",
            "stateName": "São Paulo",
            "cityListed": true,
            "lang": "pt",
            "holidays": [
                    {
                            "date": "2026-01-01",
                            "name": "Ano Novo",
                            "kind": "newyear",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2026-01-25",
                            "name": "Aniversário da Cidade",
                            "kind": "city",
                            "scope": "city",
                            "type": "public"
                    },
                    {
                            "date": "2026-02-14",
                            "days": 5,
                            "name": "Carnaval",
                            "kind": "carnival",
                            "scope": "national",
                            "type": "optional"
                    },
                    {
                            "date": "2026-04-03",
                            "name": "Sexta-Feira Santa",
                            "kind": "easter",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2026-04-21",
                            "name": "Dia de Tiradentes",
                            "kind": "independence",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2026-05-01",
                            "name": "Dia do trabalhador",
                            "kind": "labour",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2026-06-04",
                            "name": "Corpo de Deus",
                            "kind": "religious",
                            "scope": "national",
                            "type": "optional"
                    },
                    {
                            "date": "2026-07-09",
                            "name": "Revolução Constitucionalista",
                            "kind": "independence",
                            "scope": "state",
                            "type": "public"
                    },
                    {
                            "date": "2026-09-07",
                            "name": "Dia da Independência",
                            "kind": "independence",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2026-10-04",
                            "name": "Dia de Eleição",
                            "kind": "election",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2026-10-12",
                            "name": "Nossa Senhora Aparecida",
                            "kind": "religious",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2026-10-25",
                            "name": "Dia de Eleição",
                            "kind": "election",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2026-11-02",
                            "name": "Dia de Finados",
                            "kind": "remembrance",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2026-11-15",
                            "name": "Proclamação da República",
                            "kind": "independence",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2026-11-20",
                            "name": "Dia da Consciência Negra",
                            "scope": "national",
                            "type": "public",
                            "kind": "people"
                    },
                    {
                            "date": "2026-12-24",
                            "name": "Noite de Natal",
                            "kind": "christmas",
                            "scope": "national",
                            "type": "optional"
                    },
                    {
                            "date": "2026-12-25",
                            "name": "Natal",
                            "kind": "christmas",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2026-12-31",
                            "name": "Véspera de Ano Novo",
                            "kind": "newyear",
                            "scope": "national",
                            "type": "optional"
                    },
                    {
                            "date": "2027-01-01",
                            "name": "Ano Novo",
                            "kind": "newyear",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2027-01-25",
                            "name": "Aniversário da Cidade",
                            "kind": "city",
                            "scope": "city",
                            "type": "public"
                    },
                    {
                            "date": "2027-02-06",
                            "days": 5,
                            "name": "Carnaval",
                            "kind": "carnival",
                            "scope": "national",
                            "type": "optional"
                    },
                    {
                            "date": "2027-03-26",
                            "name": "Sexta-Feira Santa",
                            "kind": "easter",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2027-04-21",
                            "name": "Dia de Tiradentes",
                            "kind": "independence",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2027-05-01",
                            "name": "Dia do trabalhador",
                            "kind": "labour",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2027-05-27",
                            "name": "Corpo de Deus",
                            "kind": "religious",
                            "scope": "national",
                            "type": "optional"
                    },
                    {
                            "date": "2027-07-09",
                            "name": "Revolução Constitucionalista",
                            "kind": "independence",
                            "scope": "state",
                            "type": "public"
                    },
                    {
                            "date": "2027-09-07",
                            "name": "Dia da Independência",
                            "kind": "independence",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2027-10-12",
                            "name": "Nossa Senhora Aparecida",
                            "kind": "religious",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2027-11-02",
                            "name": "Dia de Finados",
                            "kind": "remembrance",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2027-11-15",
                            "name": "Proclamação da República",
                            "kind": "independence",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2027-11-20",
                            "name": "Dia da Consciência Negra",
                            "scope": "national",
                            "type": "public",
                            "kind": "people"
                    },
                    {
                            "date": "2027-12-24",
                            "name": "Noite de Natal",
                            "kind": "christmas",
                            "scope": "national",
                            "type": "optional"
                    },
                    {
                            "date": "2027-12-25",
                            "name": "Natal",
                            "kind": "christmas",
                            "scope": "national",
                            "type": "public"
                    },
                    {
                            "date": "2027-12-31",
                            "name": "Véspera de Ano Novo",
                            "kind": "newyear",
                            "scope": "national",
                            "type": "optional"
                    }
            ],
            "today": [],
            "next": null,
            "longWeekends": [
                    {
                            "from": "2026-04-03",
                            "to": "2026-04-05",
                            "days": 3,
                            "holidays": [
                                    "Sexta-Feira Santa"
                            ]
                    },
                    {
                            "from": "2026-05-01",
                            "to": "2026-05-03",
                            "days": 3,
                            "holidays": [
                                    "Dia do trabalhador"
                            ]
                    },
                    {
                            "from": "2026-09-05",
                            "to": "2026-09-07",
                            "days": 3,
                            "holidays": [
                                    "Dia da Independência"
                            ]
                    },
                    {
                            "from": "2026-10-10",
                            "to": "2026-10-12",
                            "days": 3,
                            "holidays": [
                                    "Nossa Senhora Aparecida"
                            ]
                    },
                    {
                            "from": "2026-10-31",
                            "to": "2026-11-02",
                            "days": 3,
                            "holidays": [
                                    "Dia de Finados"
                            ]
                    },
                    {
                            "from": "2026-11-20",
                            "to": "2026-11-22",
                            "days": 3,
                            "holidays": [
                                    "Dia da Consciência Negra"
                            ]
                    },
                    {
                            "from": "2026-12-25",
                            "to": "2026-12-27",
                            "days": 3,
                            "holidays": [
                                    "Natal"
                            ]
                    },
                    {
                            "from": "2027-01-01",
                            "to": "2027-01-03",
                            "days": 3,
                            "holidays": [
                                    "Ano Novo"
                            ]
                    },
                    {
                            "from": "2027-01-23",
                            "to": "2027-01-25",
                            "days": 3,
                            "holidays": [
                                    "Aniversário da Cidade"
                            ]
                    },
                    {
                            "from": "2027-03-26",
                            "to": "2027-03-28",
                            "days": 3,
                            "holidays": [
                                    "Sexta-Feira Santa"
                            ]
                    },
                    {
                            "from": "2027-07-09",
                            "to": "2027-07-11",
                            "days": 3,
                            "holidays": [
                                    "Revolução Constitucionalista"
                            ]
                    },
                    {
                            "from": "2027-11-13",
                            "to": "2027-11-15",
                            "days": 3,
                            "holidays": [
                                    "Proclamação da República"
                            ]
                    }
            ],
            "sources": [
                    {
                            "text": "Holiday data: date-holidays by commenthol",
                            "url": "https://github.com/commenthol/date-holidays",
                            "license": "CC-BY-3.0"
                    }
            ]
    }
};

var dsplay_template = {
    // this template has no variables
};

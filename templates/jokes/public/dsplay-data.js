var dsplay_config = {
    locale: 'pt_br',
    orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
    // Android SDK version
    osVersion: 19,
    // DSPLAY App version code
    appVersion: 99,
};

var dsplay_media = {
    // What the DSPLAY player gateway answers for a Jokes media ("jokes/1"); the player puts it here as `result`, with how many times this media
    // was played (`iteration`) and how long it stays on screen (`duration`, ms). Every field is filled so that the CMS preview and the screenshots
    // show the whole template. The question is alone for 45% of the duration (between 3 and 9 seconds), then the answer pops in.
    // To try another screen from the dev server add ?iteration=N to the URL (joke N mod 12), ?duration=6000 for another length (the question stays
    // 3 s at that), ?locale=en (or es, fr, de, it) for the template's own language, ?long=3 for jokes three times longer.
    duration: 12000,
    iteration: 0,
    result: {
        "schema": "jokes/1",
        "lang": "pt",
        "date": "2026-11-15",
        "generatedAt": "2026-11-15T00:05:00Z",
        "jokes": [
            { "id": "2026-11-15-pt-01", "setup": "O que é um pontinho verde no fundo da sala?", "punchline": "Uma ervilha de castigo!" },
            { "id": "2026-11-15-pt-02", "setup": "Qual é o animal mais antigo do mundo?", "punchline": "A zebra, porque ela é em preto e branco!" },
            { "id": "2026-11-15-pt-03", "setup": "O que o tomate foi fazer no banco?", "punchline": "Tirar extrato!" },
            { "id": "2026-11-15-pt-04", "setup": "Por que o livro de matemática ficou triste?", "punchline": "Porque tinha muitos problemas!" },
            { "id": "2026-11-15-pt-05", "setup": "O que a vaca disse para o boi apaixonado?", "punchline": "Eu te amo muuuito!" },
            { "id": "2026-11-15-pt-06", "setup": "Qual é o café mais perigoso do mundo?", "punchline": "O ex-presso!" },
            { "id": "2026-11-15-pt-07", "setup": "O que o pato disse para a pata?", "punchline": "Vem quá!" },
            { "id": "2026-11-15-pt-08", "setup": "Por que o computador foi ao médico?", "punchline": "Porque estava com vírus!" },
            { "id": "2026-11-15-pt-09", "setup": "O que a Lua disse para o Sol?", "punchline": "Você me ilumina!" },
            { "id": "2026-11-15-pt-10", "setup": "Por que o esqueleto não foi à festa?", "punchline": "Porque não tinha corpo para dançar!" },
            { "id": "2026-11-15-pt-11", "setup": "O que é, o que é? Tem dentes, mas não morde.", "punchline": "O pente!" },
            { "id": "2026-11-15-pt-12", "setup": "Por que o gato sentou em cima do computador?", "punchline": "Para ficar de olho no mouse!" }
        ],
        "sources": [
            {
                "text": "Jokes written by AI",
                "url": "https://dsplay.tv",
                "license": null
            }
        ]
    }
};

var dsplay_template = {
    // this template has no variables
};

// Dev server only: the page's own address picks the screen (the player never sets these; it injects the real data before any script runs).
(function () {
    var query = window.location.search;
    var iteration = /[?&]iteration=(\d+)/.exec(query);
    var duration = /[?&]duration=(\d+)/.exec(query);
    var locale = /[?&]locale=([A-Za-z_-]+)/.exec(query);
    var long = /[?&]long=(\d+)/.exec(query);
    if (iteration) dsplay_media.iteration = Number(iteration[1]);
    if (duration) dsplay_media.duration = Number(duration[1]);
    if (locale) dsplay_config.locale = locale[1];
    if (long) {
        dsplay_media.result.jokes.forEach(function (joke) {
            joke.setup = new Array(Number(long[1]) + 1).join(joke.setup + ' ');
            joke.punchline = new Array(Number(long[1]) + 1).join(joke.punchline + ' ');
        });
    }
})();

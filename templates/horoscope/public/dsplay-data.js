var dsplay_config = {
    locale: 'pt_br',
    orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
    // Android SDK version
    osVersion: 19,
    // DSPLAY App version code
    appVersion: 99,
};

var dsplay_media = {
    // What the DSPLAY player gateway answers for a Daily Horoscope media ("horoscope/1"); the player puts it here as `result`, with how many times
    // this media was played (`iteration`) and how long it stays on screen (`duration`, ms). Every field is filled so that the CMS preview and the
    // screenshots show the whole template.
    // To try another screen from the dev server add ?iteration=N to the URL (one sign a screen: sign N mod 12; the Duo style: pair N mod 6) and
    // ?locale=en (or es, fr, de, it) for the template's own language, ?long=3 for texts three times longer; the text of the signs is in the language of the answer.
    duration: 15000,
    iteration: 4,
    result: {
        "schema": "horoscope/1",
        "date": "2026-11-15",
        "lang": "pt",
        "generatedAt": "2026-11-15T00:05:00Z",
        "signs": [
            { "sign": "aries", "from": "03-21", "to": "04-19", "element": "fire", "keyword": "Iniciativa",
              "text": "Um convite inesperado pede coragem para dizer sim. Comece pelo passo pequeno e deixe o entusiasmo fazer o resto.",
              "love": 4, "work": 5, "health": 3, "luckyNumber": 9, "luckyColor": "red", "compatible": "leo" },
            { "sign": "taurus", "from": "04-20", "to": "05-20", "element": "earth", "keyword": "Paciência",
              "text": "O dia favorece quem não tem pressa. Uma conversa tranquila resolve o que a insistência não resolveu.",
              "love": 3, "work": 4, "health": 4, "luckyNumber": 6, "luckyColor": "green", "compatible": "virgo" },
            { "sign": "gemini", "from": "05-21", "to": "06-20", "element": "air", "keyword": "Curiosidade",
              "text": "Uma ideia nova aparece no meio da rotina. Anote antes que escape: ela pode render mais do que parece.",
              "love": 4, "work": 3, "health": 4, "luckyNumber": 5, "luckyColor": "yellow", "compatible": "libra" },
            { "sign": "cancer", "from": "06-21", "to": "07-22", "element": "water", "keyword": "Acolhimento",
              "text": "Quem está por perto precisa de um gesto simples de atenção. Ao oferecer, você também recebe.",
              "love": 5, "work": 3, "health": 3, "luckyNumber": 2, "luckyColor": "white", "compatible": "pisces" },
            { "sign": "leo", "from": "07-23", "to": "08-22", "element": "fire", "keyword": "Confiança",
              "text": "Seu entusiasmo contagia quem está ao redor. Aproveite a manhã para propor aquela ideia que andava guardada.",
              "love": 4, "work": 5, "health": 3, "luckyNumber": 7, "luckyColor": "gold", "compatible": "aries" },
            { "sign": "virgo", "from": "08-23", "to": "09-22", "element": "earth", "keyword": "Organização",
              "text": "Pequenos ajustes de rotina trazem uma sensação boa de controle. Separe um momento para você.",
              "love": 3, "work": 4, "health": 5, "luckyNumber": 4, "luckyColor": "green", "compatible": "taurus" },
            { "sign": "libra", "from": "09-23", "to": "10-22", "element": "air", "keyword": "Equilíbrio",
              "text": "Entre duas opções, a mais leve costuma ser a certa. Conversar com um amigo ajuda a enxergar melhor.",
              "love": 5, "work": 3, "health": 4, "luckyNumber": 8, "luckyColor": "pink", "compatible": "gemini" },
            { "sign": "scorpio", "from": "10-23", "to": "11-21", "element": "water", "keyword": "Foco",
              "text": "Quando você escolhe um objetivo, o resto do dia se alinha. Evite dispersar a energia à tarde.",
              "love": 3, "work": 5, "health": 3, "luckyNumber": 3, "luckyColor": "purple", "compatible": "cancer" },
            { "sign": "sagittarius", "from": "11-22", "to": "12-21", "element": "fire", "keyword": "Aventura",
              "text": "Um plano de fim de semana ganha forma e anima a semana toda. Vale compartilhar a novidade com alguém.",
              "love": 4, "work": 3, "health": 4, "luckyNumber": 1, "luckyColor": "orange", "compatible": "aries" },
            { "sign": "capricorn", "from": "12-22", "to": "01-19", "element": "earth", "keyword": "Constância",
              "text": "O esforço de ontem começa a aparecer em pequenos resultados. Reconheça o caminho que já percorreu.",
              "love": 3, "work": 5, "health": 4, "luckyNumber": 10, "luckyColor": "blue", "compatible": "virgo" },
            { "sign": "aquarius", "from": "01-20", "to": "02-18", "element": "air", "keyword": "Novidade",
              "text": "Uma conversa fora do comum traz uma ideia fresca. Deixe de lado o roteiro e escute com curiosidade.",
              "love": 4, "work": 4, "health": 3, "luckyNumber": 11, "luckyColor": "teal", "compatible": "gemini" },
            { "sign": "pisces", "from": "02-19", "to": "03-20", "element": "water", "keyword": "Inspiração",
              "text": "A imaginação anda solta e merece espaço. Um momento de silêncio ao fim do dia traz clareza.",
              "love": 5, "work": 3, "health": 4, "luckyNumber": 12, "luckyColor": "blue", "compatible": "cancer" }
        ],
        "sources": [
            {
                "text": "Horoscope written by AI for entertainment",
                "url": "https://dsplay.tv",
                "license": "Generated text, not advice and not a prediction"
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
    var locale = /[?&]locale=([A-Za-z_-]+)/.exec(query);
    if (iteration) dsplay_media.iteration = Number(iteration[1]);
    if (locale) dsplay_config.locale = locale[1];
    // ?long=3 repeats every text three times, to check that a long text shrinks and never overflows
    var long = /[?&]long=(\d+)/.exec(query);
    if (long) {
        dsplay_media.result.signs.forEach(function (sign) {
            sign.text = new Array(Number(long[1]) + 1).join(sign.text + ' ');
        });
    }
})();

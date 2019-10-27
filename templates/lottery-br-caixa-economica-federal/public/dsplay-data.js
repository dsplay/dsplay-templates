var media = {
    duration: 30000,
    iteration: 6,

    // for json service based media
    result: {"validity":"2019-07-22T00:00:00.000Z","showOutdated":true,"data":{
        "federal":{"round":{"date":"2019-07-20T00:00:00.000Z","number":"5407","city":"SAO PAULO, SP","prizes":[{"ticket":"54368","amount":500000},{"ticket":"73522","amount":27000},{"ticket":"1562","amount":24000},{"ticket":"61044","amount":19000},{"ticket":"3588","amount":18329}]},"validity":"2019-07-24T00:00:00.000Z"},
        "megasena":{"next":{"date":"2019-07-24T00:00:00.000Z","estimatedPrize":45000000},"accumulatedNextEnding5Round":5795073.34,"validity":"2019-07-24T00:00:00.000Z","accumulatedMegaVirada":58843986.23,"round":{"date":"2019-07-20T00:00:00.000Z","number":"2171","city":"SÃO PAULO, SP","prizes":{"sena":{"winners":1,"amount":21978571.91},"quina":{"winners":118,"amount":23023.47},"quadra":{"winners":7127,"amount":544.56}},"numbers":["12","13","19","36","44","55"],"totalCollection":47121518.5,"place":"Espaço Loterias Caixa","accumulated":0},"accumulatedNextEnding0Round":0},
        "duplasena":{"next":{"date":"2019-07-23T00:00:00.000Z","estimatedPrize":13000000},"validity":"2019-07-23T00:00:00.000Z","round":{"date":"2019-07-20T00:00:00.000Z","number":"1963","prizes2":{"sena":{"winners":1,"amount":10000},"terno":{"winners":23401,"amount":2.4},"quina":{"winners":22,"amount":4032.49},"quadra":{"winners":1221,"amount":92.26}},"prizes1":{"sena":{"winners":0,"amount":0},"terno":{"winners":24658,"amount":2.28},"quina":{"winners":31,"amount":3179.74},"quadra":{"winners":1267,"amount":88.91}},"city":"SÃO PAULO, SP","numbers2":["11","18","29","30","34","46"],"numbers1":["07","10","18","21","30","31"],"totalCollection":3248430,"place":"Espaço Loterias Caixa","accumulated":5559239.57},"accumulatedEasterSpecialPrize":3921960.13},
        "quina":{"next":{"date":"2019-07-22T00:00:00.000Z","estimatedPrize":45000000},"accumulatedSaintJohnSpecialPrize":8053737.02,"validity":"2019-07-22T00:00:00.000Z","round":{"date":"2019-07-20T00:00:00.000Z","number":"5025","city":"SÃO PAULO, SP","prizes":{"terno":{"winners":5531,"amount":108.16},"duque":{"winners":133747,"amount":2.46},"quina":{"winners":0,"amount":0},"quadra":{"winners":59,"amount":6743.04}},"numbers":["06","19","46","59","61"],"totalCollection":6900399,"place":"Espaço Loterias Caixa","accumulated":1405207.71}},
        "lotofacil":{"next":{"date":"2019-07-22T00:00:00.000Z","estimatedPrize":35000000},"validity":"2019-07-22T00:00:00.000Z","accumulatedIndependenceDaySpecialPrize":62321873.68,"round":{"date":"2019-07-19T00:00:00.000Z","number":"1842","city":"SÃO PAULO, SP","prizes":{"hits_11":{"winners":1123372,"amount":4},"hits_13":{"winners":15699,"amount":20},"hits_12":{"winners":203230,"amount":8},"hits_15":{"winners":2,"amount":1173213.54},"hits_14":{"winners":431,"amount":1675.13}},"numbers":["03","04","05","06","09","11","12","13","14","16","17","19","20","21","23"],"totalCollection":26736984,"place":"Espaço Loterias Caixa","accumulated":0}},
        "lotomania":{"round":{"date":"2019-07-19T00:00:00.000Z","number":"1988","city":"SÃO PAULO, SP","prizes":{"hits_20":{"winners":1,"amount":565850.51},"hits_0":{"winners":2,"amount":50297.84},"hits_17":{"winners":1679,"amount":74.89},"hits_16":{"winners":8372,"amount":15.01},"hits_19":{"winners":17,"amount":11834.79},"hits_18":{"winners":205,"amount":876.26},"hits_15":{"winners":41219,"amount":3.05}},"numbers":["01","03","05","08","24","51","54","65","71","76","78","82","83","84","86","88","90","91","93","99"],"totalCollection":4143900,"place":"Espaço Loterias Caixa","accumulated":0},"next":{"date":"2019-07-23T00:00:00.000Z","estimatedPrize":33000000},"validity":"2019-07-23T00:00:00.000Z"},
        "timemania":{"round":{"date":"2019-07-20T00:00:00.000Z","number":"1359","city":"SÃO PAULO, SP","prizes":{"hits_5":{"winners":211,"amount":976.74},"hits_6":{"winners":4,"amount":36066.17},"hits_3":{"winners":40656,"amount":2},"hits_4":{"winners":3968,"amount":6},"hits_7":{"winners":0,"amount":0},"heart_club":{"club":"S Raimundo/AM","winners":8739,"amount":5}},"numbers":["01","41","43","53","69","71","72"],"totalCollection":2563646,"place":"Espaço Loterias Caixa","accumulated":9214653.46},"next":{"date":"2019-07-23T00:00:00.000Z","estimatedPrize":33000000},"validity":"2019-07-23T00:00:00.000Z"},
        "diadesorte":{"round":{"date":"2019-07-20T00:00:00.000Z","number":"178","month":"9","city":"SÃO PAULO, SP","prizes":{"hits_5":{"winners":2992,"amount":20},"luck_month":{"month":"9","winners":178472,"amount":2},"hits_6":{"winners":68,"amount":2493.22},"hits_4":{"winners":43186,"amount":4},"hits_7":{"winners":0,"amount":0}},"numbers":["02","03","04","09","12","23","24"],"totalCollection":3222324,"place":"Espaço Loterias Caixa","accumulated":1136207.62},"next":{"date":"2019-07-23T00:00:00.000Z","estimatedPrize":42000000},"validity":"2019-07-23T00:00:00.000Z"}}},
    
    // custom media parameters
    customMediaParam: "value",
};

var template = {
    // template parameter

    template_var: "My Template Var",
    
    // bg_horizontal: '../test-data/bg-instagram.jpg',
    // bg_vertical: '../test-data/bg-instagram.jpg',


    title: "My Super Template",
    expanded: "false",
    
};

var config = {
    // config parameters
    locale: 'pt_br',
    orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
    // Android SDK version
    osVersion: 16,
    // DSPLAY App version code
    appVersion: 99,
    fontRatio: 1.33334,
    scaledDensity: 1,
    xdpi: 1,
    ydpi: 1,
};
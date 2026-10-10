"use strict";

$(function () {
  $('#root').hide();

  var u = dsplayTemplateUtils;
  var exchanges = (u.media.result && u.media.result.exchanges) || {};

  function formatRate(value) {
    return value.toFixed(4).replace('.', ',');
  }

  function renderCurrency(code, buySelector, sellSelector) {
    var rate = exchanges[code];

    if (!rate) {
      return;
    }

    $(buySelector).text(formatRate(rate.buy.value));
    $(sellSelector).text(formatRate(rate.sell.value));
  }

  renderCurrency('EUR', '#eur-buy', '#eur-sell');
  renderCurrency('USD', '#usd-buy', '#usd-sell');

  $('#root').fadeIn();
});

"use strict";

function updateTime() {
  var now = new Date();

  document.getElementById("time").innerHTML = formateTime(now);
  document.getElementById("date").innerHTML = formateDate(now);
  setTimeout(updateTime, 1000);
}

var lang = 'pt_br';

var texts = {
  'en_us': {
    weekDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    getFormatted: function (date) {
      return date.toDateString();
    }
  },
  'pt_br': {
    weekDays: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    getFormatted: function (date) {
      return texts[lang].weekDays[date.getDay()] + ", " + fillZeros(date.getDate()) + " de " + texts[lang].months[date.getMonth()] + " de " + date.getFullYear();
    }
  }
};

function formateDate(date) {
  return texts[lang].getFormatted(date);
}

function formateTime(date) {
  return fillZeros(date.getHours()) + ":" + fillZeros(date.getMinutes()) + ":" + fillZeros(date.getSeconds());
}

function fillZeros(value) {
  return (value < 10 ? "0" : "") + value;
}

$(function () {

  var data = JSON.parse(DSPLAY.getData());
  var config = data.config;
  var template = data.template;


  if (config.locale && typeof (config.locale) === 'string') {
    config.locale = config.locale.toLowerCase();
    if (texts[config.locale]) {
      lang = config.locale;
    }
  }

  updateTime();

  if (template.barColor) {
    $("#bar").css("background-color", template.barColor);
  }

  if (template.barOpacity) {
    $("#bar").css("opacity", template.barOpacity);
  }

  if (template.dateColor) {
    $("#dateDiv").css("color", template.dateColor);
  }

  if (template.timeColor) {
    $("#timeDiv").css("color", template.timeColor);
  }

  if (template.background) {
    $("#mainDiv").css("background-image", "url('" + template.background + "')");
  }

  $('#overlay').fadeOut(500);
});

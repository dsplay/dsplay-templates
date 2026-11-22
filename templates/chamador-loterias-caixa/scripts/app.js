"use strict";

// Fonts: the cover waits for them (an old WebView has no document.fonts: a short fixed wait there).
function whenFontsReady(done) {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(done, done);
  } else {
    setTimeout(done, 300);
  }
}

(function () {
  var u = dsplayTemplateUtils;

  var input = u.media.buffer;

  var result = '';

  for (var i = 0, len = input.length; i < len; i++) {
    var c = input[i];

    if (!isNaN(c)) {
      result += c;
    }
  }

  if (result.length === 1) {
    result = '0' + result;
  }

  document.getElementById('numero').textContent = result;

  whenFontsReady(function () {
    var overlay = document.getElementById('overlay');
    overlay.className = 'is-hidden';
    setTimeout(function () {
      overlay.style.display = 'none';
    }, 500);
  });
})();

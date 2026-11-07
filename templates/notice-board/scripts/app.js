"use strict";

// The notice board template. The player gateway answers with posts already turned into the only HTML allowed (text escaped,
// **bold**, *italic* and line breaks), the player picks one per showing (or the one ticker line) and hands it over as
// `media.kind`, `media.title` and `media.html`. This script chooses the layout and sizes the text from the region it is
// rendered in (the page is exactly as big as the region), so there is no font size variable: the text is as large as fits.
(function () {
    var u = dsplayTemplateUtils;
    var media = u.media || {};
    var kind = media.kind === 'ticker' || media.kind === 'notice' ? media.kind : 'card';

    var body = document.body;
    var width = window.innerWidth;
    var height = window.innerHeight;
    body.style.color = u.tval('text_color', '#ffffff');
    body.style.backgroundColor = u.tval('background_color', '#0b3b4a');

    var layout = document.querySelector('.layout.' + kind);
    layout.style.display = 'flex';

    // The largest size the region allows, then smaller until neither the height nor the width overflows (never under 10 px).
    function fit(box, largest) {
        var size = Math.max(10, Math.floor(largest));
        box.style.fontSize = size + 'px';
        while (size > 10 && (box.scrollHeight > box.clientHeight + 1 || box.scrollWidth > box.clientWidth + 1)) {
            size = Math.max(10, Math.floor(size * 0.92));
            box.style.fontSize = size + 'px';
        }
    }

    if (kind === 'ticker') {
        var track = layout.querySelector('.track');
        track.innerHTML = media.html || '';
        layout.style.fontSize = Math.max(12, Math.floor(height * 0.4)) + 'px';
        // Pixels per second; the line enters from the right edge and leaves through the left one.
        var speed = u.tfval('ticker_speed', 120);
        var distance = track.offsetWidth + window.innerWidth;
        var seconds = Math.max(distance / speed, 5);
        track.style.animationDuration = seconds + 's';
        track.style.webkitAnimationDuration = seconds + 's';
        track.className += ' run';
    } else {
        var title = layout.querySelector('.title');
        title.innerHTML = u.tbval('show_title', true) ? (media.title || '') : '';
        title.style.display = title.innerHTML ? 'block' : 'none';
        layout.querySelector('.text').innerHTML = media.html || '';
        // The margin follows the shorter side too: a percentage would be measured on the width and eat a wide, short region.
        layout.style.padding = Math.round(Math.min(width, height) * (kind === 'notice' ? 0.04 : 0.06)) + 'px';
        fit(layout, Math.min(height * 0.2, width * 0.08));
    }

    document.querySelector('#root').style.opacity = 1;
})();

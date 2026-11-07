"use strict";

// The notice board template. The player gateway answers with posts already turned into the only HTML allowed (text escaped,
// **bold**, *italic* and line breaks), the player picks one per showing (or the one ticker line) and hands it over as
// `media.kind`, `media.title` and `media.html`. This script only chooses the layout and applies the style variables.
(function () {
    var u = dsplayTemplateUtils;
    var media = u.media || {};
    var kind = media.kind === 'ticker' || media.kind === 'notice' ? media.kind : 'card';

    var body = document.body;
    body.style.fontSize = u.tval('base_font_size', '4.2vmin');
    body.style.color = u.tval('text_color', '#ffffff');
    body.style.backgroundColor = u.tval('background_color', '#0b3b4a');

    var layout = document.querySelector('.layout.' + kind);
    layout.style.display = 'flex';

    if (kind === 'ticker') {
        var track = layout.querySelector('.track');
        track.innerHTML = media.html || '';
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
    }

    document.querySelector('#root').style.opacity = 1;
})();

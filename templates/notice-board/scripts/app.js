"use strict";

// The notice board template. The player gateway answers with each post as `blocks` (runs of text with `bold`, `italic` and a
// named `color`), never as HTML; the player picks one post per showing (or the one ticker line) and hands it over as `media.kind`,
// `media.title` and `media.blocks`. This script draws the blocks (every text is set as text, never as markup), chooses the layout
// and sizes the text from the region it is rendered in (the page is exactly as big as the region), so there is no font size
// variable: the text is as large as fits.
(function () {
    var u = dsplayTemplateUtils;
    var media = u.media || {};
    var kind = media.kind === 'ticker' || media.kind === 'notice' ? media.kind : 'card';

    var body = document.body;
    var width = window.innerWidth;
    var height = window.innerHeight;
    body.style.color = u.tval('text_color', '#ffffff');
    body.style.backgroundColor = u.tval('background_color', '#0b3b4a');

    // Named colours are tuned for the template's dark background; the post says "red", the template decides which red.
    var COLORS = { red: '#ff8a80', teal: '#5eead4', amber: '#fbbf24' };

    function draw(box, blocks) {
        box.textContent = '';
        for (var i = 0; i < (blocks || []).length; i++) {
            var block = blocks[i];
            if (!block || typeof block.text !== 'string') continue;
            var run = document.createElement('span');
            run.textContent = block.text;
            if (block.bold === true) run.style.fontWeight = 'bold';
            if (block.italic === true) run.style.fontStyle = 'italic';
            if (COLORS.hasOwnProperty(block.color)) run.style.color = COLORS[block.color];
            box.appendChild(run);
        }
    }

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
        draw(track, media.blocks);
        // 40% of the height, capped at 6% of the width: on a thin strip the height decides, on a big screen the width does.
        layout.style.fontSize = Math.max(12, Math.floor(Math.min(height * 0.4, width * 0.06))) + 'px';
        // Pixels per second; the line enters from the right edge and leaves through the left one.
        var speed = u.tfval('ticker_speed', 120);
        var distance = track.offsetWidth + window.innerWidth;
        var seconds = distance / speed;
        // The player ends the showing after the media's duration, so a pass slower than that would be cut on its first words:
        // the whole line crosses within the showing, faster than ticker_speed when it has to.
        var showing = ((media.duration || 0) / 1000) * 0.95;
        if (showing >= 5 && seconds > showing) seconds = showing;
        seconds = Math.max(seconds, 5);
        track.style.animationDuration = seconds + 's';
        track.style.webkitAnimationDuration = seconds + 's';
        track.className += ' run';
    } else {
        var title = layout.querySelector('.title');
        title.textContent = u.tbval('show_title', true) ? (media.title || '') : '';
        title.style.display = title.textContent ? 'block' : 'none';
        draw(layout.querySelector('.text'), media.blocks);
        // The margin follows the shorter side too: a percentage would be measured on the width and eat a wide, short region.
        layout.style.padding = Math.round(Math.min(width, height) * (kind === 'notice' ? 0.04 : 0.06)) + 'px';
        fit(layout, Math.min(height * 0.2, width * 0.08));
    }

    document.querySelector('#root').style.opacity = 1;
})();

"use strict";

// The notice board template. The player gateway answers with each post as `blocks` (runs of text with `bold`, `italic` and a
// named `color`), never as HTML; the player picks one post per showing (the ticker included) and hands it over as `media.kind`,
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
    // The post may bring its own background (a name: the template paints it) and the alignment of its text; without them the template's variables rule.
    var BACKGROUNDS = { navy: '#12284c', teal: '#0b3b4a', green: '#14532d', purple: '#4c1d95', red: '#7f1d1d', orange: '#9a3412', white: '#ffffff', black: '#000000' };
    var background = BACKGROUNDS.hasOwnProperty(media.background) ? media.background : '';
    var light = background === 'white';
    body.style.color = light ? '#111827' : u.tval('text_color', '#ffffff');
    body.style.backgroundColor = background ? BACKGROUNDS[background] : u.tval('background_color', '#0b3b4a');

    // Named colours: the post says "red", the template decides which red, one set tuned for dark backgrounds and one for the white one.
    var COLORS_ON_DARK = { red: '#ff8a80', orange: '#fdba74', amber: '#fbbf24', green: '#86efac', teal: '#5eead4', blue: '#93c5fd', purple: '#d8b4fe', pink: '#f9a8d4' };
    var COLORS_ON_LIGHT = { red: '#b91c1c', orange: '#c2410c', amber: '#b45309', green: '#15803d', teal: '#0f766e', blue: '#1d4ed8', purple: '#7e22ce', pink: '#be185d' };
    var COLORS = light ? COLORS_ON_LIGHT : COLORS_ON_DARK;
    // Sizes are relative to the text the script fits to the region.
    var SIZES = { small: 0.75, large: 1.4, xlarge: 1.9 };

    function draw(box, blocks) {
        box.textContent = '';
        for (var i = 0; i < (blocks || []).length; i++) {
            var block = blocks[i];
            if (!block || typeof block.text !== 'string') continue;
            var run = document.createElement('span');
            run.textContent = block.text;
            if (block.bold === true) run.style.fontWeight = 'bold';
            if (block.italic === true) run.style.fontStyle = 'italic';
            if (block.underline === true) run.style.textDecoration = 'underline';
            if (SIZES.hasOwnProperty(block.size)) run.style.fontSize = SIZES[block.size] + 'em';
            if (COLORS.hasOwnProperty(block.color)) run.style.color = COLORS[block.color];
            box.appendChild(run);
        }
    }

    // Only a picture the gateway (an http(s) url) or the dashboard preview (a small JPEG data url) can send.
    function imageSource(value) {
        return typeof value === 'string' && /^(https?:\/\/|data:image\/jpeg;base64,)/.test(value) ? value : '';
    }

    var layout = document.querySelector('.layout.' + kind);
    layout.style.display = 'flex';

    // The largest size the region allows, then smaller until neither the height nor the width overflows (never under 10 px).
    // The size is set on `host` and what has to fit is `box`, the body that holds the title and the text.
    function fit(host, box, largest) {
        var size = Math.max(10, Math.floor(largest));
        host.style.fontSize = size + 'px';
        while (size > 10 && (box.scrollHeight > box.clientHeight + 1 || box.scrollWidth > box.clientWidth + 1)) {
            size = Math.max(10, Math.floor(size * 0.92));
            host.style.fontSize = size + 'px';
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
        var pad = Math.round(Math.min(width, height) * (kind === 'notice' ? 0.04 : 0.06));
        layout.style.padding = pad + 'px';
        var pic = layout.querySelector('.pic');
        var body = layout.querySelector('.body');
        var ALIGNS = { left: 'flex-start', center: 'center', right: 'flex-end' };
        if (ALIGNS.hasOwnProperty(media.align)) {
            body.style.textAlign = media.align;
            body.style.alignItems = ALIGNS[media.align];
        }
        var source = imageSource(media.image);
        // With a picture, a wide short region puts it on the left (a third of the width) and any other puts it on top (under half of the height); the text takes the rest.
        var arrange = function (withPicture) {
            var wide = width / height > 1.8;
            var innerWidth = width - pad * 2;
            var innerHeight = height - pad * 2;
            var gap = Math.round(pad / 2);
            pic.style.display = withPicture ? 'block' : 'none';
            layout.style.flexDirection = withPicture && wide ? 'row' : 'column';
            if (withPicture) {
                pic.style.width = (wide ? Math.round(innerWidth * 0.34) : innerWidth) + 'px';
                pic.style.height = (wide ? innerHeight : Math.round(innerHeight * 0.46)) + 'px';
                pic.style.marginRight = (wide ? gap : 0) + 'px';
                pic.style.marginBottom = (wide ? 0 : gap) + 'px';
                pic.style.borderRadius = Math.round(Math.min(width, height) * 0.02) + 'px';
            }
            fit(layout, body, Math.min(height * 0.2, width * 0.08));
        };
        if (source) {
            var img = pic.querySelector('img');
            // A picture that cannot load gives its room back to the text.
            img.onerror = function () { arrange(false); };
            img.src = source;
        }
        arrange(source !== '');
    }

    document.querySelector('#root').style.opacity = 1;
})();

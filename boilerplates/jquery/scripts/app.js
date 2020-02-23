"use strict";

$(function () {
    $('#root').hide();

    // here we can apply the dsplay-data.js values to your template using jQuery

    // we have access to dsplay objects: dsplay_config, dsplay_media and dsplay_template
    $('.title').html(dsplay_template.title);

    var opacity = parseFloat(dsplay_template.text_opacity);
    $('.text')
        .html(dsplay_media.name)
        .css({ opacity });

    $('img').attr({ src: dsplay_template.image });

    // dsplayTemplateUtils can make our lives easier
    // use the method tval to get string values with a optional default value
    // the methods tbval, tival, tfval are useful for non-string values (boolean, integer, float)
    var u = dsplayTemplateUtils;

    var fontSize = u.tval('base_font_size', '1.5em');
    $(document.body).css({ fontSize });

    var titleOpacity = u.tfval('title_opacity', 1);
    $('.title').css({ opacity: titleOpacity });

    $('#root').fadeIn();
});
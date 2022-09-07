"use strict";

$(document).ready(function () {
  var u = dsplayTemplateUtils;

  const {
    images = [],
    result: {
      data: {
        posts = [],
      } = {},
    } = {},
  } = u.media;
  const result = posts.map(({
    media = [],
  }) => media.map(({ urls: { lg }, cached_media_url: cached }) => cached || lg));

  let allMediaImages = [];
  result.forEach((mediaImages) => {
    allMediaImages = allMediaImages.concat(mediaImages);
  });

  const imagesToShow = [...images, ...allMediaImages];

  var delay = (u.media.duration - 1000) / imagesToShow.length;

  $.each(imagesToShow, function (i, image) {
    console.log(image);
    $('#root ul').append(`<li><a href="${image}"><img src="${image}"></a></li>`);
  })

  $('#root').skitter({
    theme: 'clean',
    numbers_align: 'center',
    progressbar: false,
    dots: false,
    preview: false,
    controls: false,
    hideTools: true,
    fullscreen: true,
    label: false,
    numbers: false,
    animation: u.tval('animation', 'fade'),
    interval: delay,
    responsive: {
      small: {
        animation: 'fade',
        max_width: 768,
        suffix: '-small'
      },
      medium: {
        animation: 'directionRight',
        max_width: 1024,
        suffix: '-medium'
      }
    }
  });
});
var dsplay_config = {
  // config parameters
  locale: 'en_US',
  orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
  // Android SDK version
  osVersion: 19,
  // DSPLAY App version code
  appVersion: 99,
};

var dsplay_media = {
  duration: 20000,
  postCount: 10,

  // for json service based media
  // result: { "validity": "2018-08-13T18:22:55.238Z", "showOutdated": true, "data": {} },
  result: {
    "validity": "2024-01-25T17:32:09.425Z",
    "showOutdated": true,
    "data": {
      "user": {
        "id": "1000000002",
        "name": "Petal & Stem Flowers",
        "pic": "https://picsum.photos/seed/petalstem/150/150"
      },
      "posts": [
        {
          "id": "example-post-101",
          "text": "Fresh arrangements just in for spring 🌸 Visit us in store or order online at https://example.com/shop #freshflowers #springcollection",
          "created": "2024-01-20T13:35:03+0000",
          "link": "https://www.facebook.com/example/posts/example101/",
          "media": [
            {
              "id": "example-media-101",
              "type": "image",
              "urls": {
                "tb": "https://picsum.photos/seed/petalstem-post1/720/720",
                "sm": "https://picsum.photos/seed/petalstem-post1/720/720",
                "md": "https://picsum.photos/seed/petalstem-post1/720/720",
                "lg": "https://picsum.photos/seed/petalstem-post1/720/720"
              }
            }
          ],
          "tags": ["freshflowers", "springcollection"],
          "reactions": { "like": 84, "love": 52, "wow": 3 },
          "shares": 12,
          "comments": 9
        },
        {
          "id": "example-post-102",
          "text": "Thank you for 10 wonderful years serving our community! 💐 Couldn't have done it without you, @localcommunity",
          "created": "2024-01-18T14:00:00+0000",
          "link": "https://www.facebook.com/example/posts/example102/",
          "media": [],
          "reactions": { "like": 210, "love": 145, "haha": 2 },
          "shares": 31,
          "comments": 28
        },
        {
          "id": "example-post-103",
          "text": "Need a custom bouquet for a special occasion? Call +55 (21) 98765-4321 to place your order ☎️ #customorders",
          "created": "2024-01-15T02:00:00+0000",
          "link": "https://www.facebook.com/example/posts/example103/",
          "media": [
            {
              "id": "example-media-103",
              "type": "image",
              "urls": {
                "tb": "https://picsum.photos/seed/petalstem-post3/720/720",
                "sm": "https://picsum.photos/seed/petalstem-post3/720/720",
                "md": "https://picsum.photos/seed/petalstem-post3/720/720",
                "lg": "https://picsum.photos/seed/petalstem-post3/720/720"
              }
            }
          ],
          "tags": ["customorders"],
          "reactions": { "like": 67, "love": 14 },
          "shares": 5,
          "comments": 11
        },
        {
          "id": "example-post-104",
          "text": "Our new greenhouse is finally open! Come take a look 🌿 #newgreenhouse #gardening",
          "created": "2024-01-15T00:00:00+0000",
          "link": "https://www.facebook.com/example/posts/example104/",
          "media": [
            {
              "id": "example-media-104",
              "type": "image",
              "urls": {
                "tb": "https://picsum.photos/seed/petalstem-post4/720/720",
                "sm": "https://picsum.photos/seed/petalstem-post4/720/720",
                "md": "https://picsum.photos/seed/petalstem-post4/720/720",
                "lg": "https://picsum.photos/seed/petalstem-post4/720/720"
              }
            }
          ],
          "tags": ["newgreenhouse", "gardening"],
          "reactions": { "like": 45, "love": 8 },
          "shares": 3,
          "comments": 4
        },
        {
          "id": "example-post-105",
          "text": "Wedding season is here 💍 Book your consultation today. #weddingflowers #bridalbouquet",
          "created": "2024-01-14T20:42:28+0000",
          "link": "https://www.facebook.com/example/posts/example105/",
          "media": [
            {
              "id": "example-media-105",
              "type": "image",
              "urls": {
                "tb": "https://picsum.photos/seed/petalstem-post5/720/720",
                "sm": "https://picsum.photos/seed/petalstem-post5/720/720",
                "md": "https://picsum.photos/seed/petalstem-post5/720/720",
                "lg": "https://picsum.photos/seed/petalstem-post5/720/720"
              }
            }
          ],
          "tags": ["weddingflowers", "bridalbouquet"],
          "reactions": { "like": 132, "love": 98, "wow": 6 },
          "shares": 22,
          "comments": 15
        }
      ]
    }
  },
};

var dsplay_template = {
  // template parameter
  // bg_horizontal: '../test-assets/bg-facebook2.png',
  // bg_vertical: '../test-assets/bg-facebook.png',
  // overlay: '../test-assets/dsplay-logo.png',
  // overlay_position: 'top-right',
  // image_fit: 'stretch',
  // image_fit: 'cover',
  // image_fit: 'contain',
  // logo: '../test-assets/dsplay-logo.png',
  // link_color: 'purple',
  // color_1: '#000',
  // color_2: '#51a8b1',
  // color_3: '#ff0',
  // color_4: '#5fa',
  // text_color: 'grey',
  // border_color: 'cyan',
  // hashtag_color: 'yellow',
  // mention_color: 'green',
  // phone_color: 'red',
  // link_color: 'pink',
  // text_bg_color: '#fff',
  // text_bg_opacity: '.6',
};

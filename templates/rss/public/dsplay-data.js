// Local development only. Query string switches, to try every way the template is fed:
//   (none)          an old player: the item comes ready-made in the flat keys (itemTitle, ...) and there is no `result`
//   ?player=new     a new player: no flat keys, the gateway's body in `media.result.data` (the template picks the item)
//   &clogo=0        (new player) the channel declares no logo
//   &tlogo=0        the `logo` template variable is empty
var dev_query = typeof location !== 'undefined' ? location.search : '';
var dev_new_player = /player=new/.test(dev_query);
var dev_channel_logo = !/clogo=0/.test(dev_query);
var dev_template_logo = !/tlogo=0/.test(dev_query);

var dsplay_config = {
  // config parameters
  locale: 'pt_br',
  orientation:
    window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
  // Android SDK version
  osVersion: 16,
  // DSPLAY App version code
  appVersion: 40100,
  json: {
    a: 1,
    b: 2,
  },
};

var dsplay_media = {
  id: 1,
  name: 'RSS CNN',
  count: 1,
  iteration: 4,
  duration: 15000,
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Hopper_Nighthawks.jpg',
  // hasImage: true,
  qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://dsplay.tv',
  link: 'https://dsplay.tv',
  imageTitle: 'Image Title', // Title of RSS item image (if available)
  title: 'Breaking News', // The media title
  // title: 'Últimas Notícias', // The media title
  
  itemContent: 'Content', // RSS item content
  itemDescription: 'Lorem ipsum dolor sit amet, &#36; consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', // RSS item description
  // itemTitle: 'Lorem ipsum dolor sit amet, &#36; consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', // RSS item title
  itemTitle: '\'Se morre sua mãe, é 100%. Perda é absoluta\'. Diz médica paliativista sobre ameaça do corona', // RSS item title
  // itemTitle: 'Jogo criano na UFPU, em Uberada é registrado no INPI como programa de computador', // RSS item title
  source: 'UOLIndoor', // An internal control field indicating the source of RSS.


  // UOL
  // itemContent: 'Conteúdo da notícia',
  // itemDescription: 'Lorem ipsum dolor sit amet, &#36; consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', // RSS item description
  // itemTitle: 'Celebridades', // RSS item title
  // source: 'UOLIndoor', // An internal control field indicating the source of RSS.
};

if (dev_new_player) {
  delete dsplay_media.itemTitle;
  delete dsplay_media.itemDescription;
  delete dsplay_media.itemContent;
  delete dsplay_media.imageUrl;
  delete dsplay_media.source;
  delete dsplay_media.link;
  delete dsplay_media.qrCode;
  dsplay_media.result = {
    data: {
      title: 'Feed title',
      link: 'https://dsplay.tv',
      logo: dev_channel_logo ? 'test-assets/channel-logo.svg' : null,
      items: [
        {
          title: 'Jogo criado na UFPR é registrado no INPI como programa de computador',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          content: 'Content',
          link: 'https://dsplay.tv',
          categories: [],
          images: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Hopper_Nighthawks.jpg', title: 'Image Title' }],
        },
      ],
    },
  };
}

var dsplay_template = {
  show_qr_code: 'true',
  bg_color: 'black',
  logo: dev_template_logo ? 'test-assets/template-logo.svg' : '',
  logo_bg_color: 'white',
  title_color: 'white',
  title_bg_color: 'darkorange',
  text_color: 'white',
  text_bg_color: 'black',
  long_value: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.',
  debug: false,
};

// What the components read from @dsplay/react-template-utils, in one place: tests set `player` and mock the module with `mockUtils`.
export const player = { media: {}, format: 'landscape', w: 1280, h: 720 };

export const mockUtils = () => ({
  useMedia: () => player.media,
  useConfig: () => ({ locale: 'pt_br' }),
  useScreenInfo: () => ({ screenFormat: player.format, w: player.w, h: player.h }),
  Loader: ({ children }) => children,
  screen: {
    LANDSCAPE: 'landscape', PORTRAIT: 'portrait', SQUARE: 'square', H_BANNER: 'h-banner', V_BANNER: 'v-banner',
  },
});

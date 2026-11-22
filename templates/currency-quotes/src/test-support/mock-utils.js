// What the components read from @dsplay/react-template-utils, in one place: tests set `player` and mock the module with `mockUtils`.
export const player = {
  media: {}, template: {}, format: 'landscape', w: 1280, h: 720,
};

export const mockUtils = () => ({
  useMedia: () => player.media,
  useConfig: () => ({ locale: 'pt_br' }),
  useTemplateBoolVal: (name, fallback) => (name in player.template ? Boolean(player.template[name]) : fallback),
  useScreenInfo: () => ({ screenFormat: player.format, w: player.w, h: player.h }),
  Loader: ({ children }) => children,
  screen: {
    LANDSCAPE: 'landscape', PORTRAIT: 'portrait', SQUARE: 'square', H_BANNER: 'h-banner', V_BANNER: 'v-banner',
  },
});

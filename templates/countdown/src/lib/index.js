import * as screen from './utils/screen';
import * as color from './utils/colors';
import * as time from './utils/time';

export { default as FontLoader } from './components/font-loader/font-loader';
export { default as ImageLoader } from './components/image-loader/image-loader';
export { default as Loader } from './components/loader/loader';
export { default as LoaderContext } from './components/loader/loader-context';
export { default as FitText } from './components/fit-text/fit-text';
export { default as Render } from './components/render/render';
export { default as Landscape } from './components/landscape/landscape';
export { default as Portrait } from './components/portrait/portrait';
export { default as Square } from './components/square/square';
export { default as HBanner } from './components/h-banner/h-banner';
export { default as VBanner } from './components/v-banner/v-banner';
export { default as QrCode } from './components/qr-code';

export { default as useInterval } from './hooks/use-interval';
export { default as useScreenInfo } from './hooks/use-screen-info';
export { default as useMedia } from './hooks/use-media';
export { default as useConfig } from './hooks/use-config';
export { default as useTemplate } from './hooks/use-template';
export { useTemplateVal } from './hooks/use-template';
export { useTemplateBoolVal } from './hooks/use-template';
export { useTemplateIntVal } from './hooks/use-template';
export { useTemplateFloatVal } from './hooks/use-template';

export {
  screen,
  color,
  time,
};

import { createContext, useEffect } from 'react';

// What the components read from @dsplay/react-template-utils, in one place: tests set `player` and mock the module with `mockUtils`.
export const player = { media: {}, template: {}, locale: 'pt_br' };

// the real FittedText tells its parent when it is final (`onReady`); the stand-in does at once
function MockFittedText({
  text, className, style, children, onReady,
}) {
  useEffect(() => { if (onReady) onReady(); }, []); // eslint-disable-line react-hooks/exhaustive-deps -- once, like the real one
  return <span className={className} style={style}>{children !== undefined ? children : text}</span>;
}

const LoaderContext = createContext({});

export const mockUtils = () => ({
  LoaderContext,
  useMedia: () => player.media,
  useConfig: () => ({ locale: player.locale }),
  useTemplateVal: (key, fallback) => (player.template[key] === undefined ? fallback : player.template[key]),
  Loader: ({ children }) => children,
  FittedText: MockFittedText,
});

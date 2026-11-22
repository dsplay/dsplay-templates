import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import ImageLoader from '../image-loader/image-loader';
import FontLoader from '../font-loader/font-loader';
import LoaderContext from './loader-context';
import { wait } from '../../utils/time';

const style = {
  position: 'absolute',
  // Anchored: without an offset the wrapper sits at its static position, inside the body's padding, and overflows the screen by that padding.
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  margin: 0,
};

const defaultTasks = [];

const hiddenStyle = { ...style, visibility: 'hidden' };

/** Longest time (ms) `reveal` waits for fonts and images before showing the template anyway. */
const DEFAULT_REVEAL_TIMEOUT = 4000;

/**
 * Shows a placeholder while fonts and images preload (and any extra `tasks` resolve), then
 * renders its children wrapped in a `LoaderContext.Provider` exposing the tasks' results.
 * @param {object} props
 * @param {string[]} [props.fonts] - Font family names to preload, see `FontLoader`
 * @param {string[]} [props.images] - Image URLs to preload, see `ImageLoader`
 * @param {React.ReactNode} [props.placeholder] - Shown while loading
 * @param {React.ReactNode} props.children - Rendered once loading finishes
 * @param {number} [props.minDuration] - Minimum time (ms) the placeholder stays visible
 * @param {boolean} [props.reveal] - Reveal mode: no placeholder and no minimum time. The tasks are
 * awaited first, then `children` are mounted but kept hidden (`visibility: hidden`, so they still
 * lay out and measure) while the fonts and images load, and finally shown with the class
 * `dsplay-ready` on the wrapper (and `ready: true` on `LoaderContext`). Start an entrance
 * animation from that class: `.dsplay-ready .title { animation: ... both }`
 * @param {number} [props.revealTimeout] - Reveal mode only: longest time (ms) to wait for the
 * fonts and images before showing the template anyway, so a broken image never blocks the media
 * @param {Promise<unknown>[]} [props.tasks] - Extra promises to await before loading finishes. A
 * rejected task no longer keeps the placeholder stuck forever: it settles as `undefined` in
 * `tasksResults` at that same index, with the rejection reason exposed in parallel via
 * `tasksErrors`, both on `LoaderContext`
 * @returns {React.ReactElement}
 */
function Loader({
  fonts,
  images,
  placeholder = <div>loading...</div>,
  children,
  minDuration = 0,
  reveal = false,
  revealTimeout = DEFAULT_REVEAL_TIMEOUT,
  tasks = defaultTasks,
}) {
  const [loadingMin, setLoadingMin] = useState(true);
  const [loadingFonts, setLoadingFonts] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const [tasksResults, setTasksResults] = useState();
  const [tasksErrors, setTasksErrors] = useState();

  const handleImagesLoad = useCallback(() => {
    setLoadingImages(false);
  }, []);

  const handleFontsLoad = useCallback(() => {
    setLoadingFonts(false);
  }, []);

  useEffect(() => {
    if (loadingMin) {
      (async () => {
        const [, ...settledTasks] = await Promise.allSettled([
          wait(minDuration),
          ...tasks,
        ]);
        setTasksResults(settledTasks.map(
          (task) => (task.status === 'fulfilled' ? task.value : undefined),
        ));
        setTasksErrors(settledTasks.map(
          (task) => (task.status === 'rejected' ? task.reason : undefined),
        ));
        setLoadingMin(false);
        // console.log('min loading time passed', loadingMin, minLoadingTime, tasks);
      })();
    }
  }, [loadingMin, minDuration, tasks]);

  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!reveal) return undefined;
    const timer = setTimeout(() => setTimedOut(true), revealTimeout);
    return () => clearTimeout(timer);
  }, [reveal, revealTimeout]);

  const ready = !loadingFonts && !loadingImages && !loadingMin;
  const revealed = ready || (reveal && timedOut && !loadingMin);

  const context = useMemo(() => ({
    tasksResults,
    tasksErrors,
    ready: revealed,
  }), [tasksResults, tasksErrors, revealed]);

  if (reveal) {
    if (loadingMin) return <div style={hiddenStyle} />;
    return (
      <LoaderContext.Provider value={context}>
        <div
          className={revealed ? 'dsplay-reveal dsplay-ready' : 'dsplay-reveal'}
          style={revealed ? style : hiddenStyle}
        >
          {children}
        </div>
        {!revealed && <ImageLoader key="image-loader" images={images} onLoad={handleImagesLoad} />}
        {!revealed && <FontLoader key="font-loader" families={fonts} onLoad={handleFontsLoad} />}
      </LoaderContext.Provider>
    );
  }

  if (loadingFonts || loadingImages || loadingMin) {
    // console.log('loading...');
    return (
      <div style={style}>
        <React.Fragment key="placeholder">{placeholder}</React.Fragment>
        <ImageLoader key="image-loader" images={images} onLoad={handleImagesLoad} />
        <FontLoader key="font-loader" families={fonts} onLoad={handleFontsLoad} />
      </div>
    );
  }

  return (
    <LoaderContext.Provider value={context}>
      {children}
    </LoaderContext.Provider>
  );
}

export default Loader;

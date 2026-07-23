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
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  margin: 0,
};

const defaultTasks = [];

/**
 * Shows a placeholder while fonts and images preload (and any extra `tasks` resolve), then
 * renders its children wrapped in a `LoaderContext.Provider` exposing the tasks' results.
 * @param {object} props
 * @param {string[]} [props.fonts] - Font family names to preload, see `FontLoader`
 * @param {string[]} [props.images] - Image URLs to preload, see `ImageLoader`
 * @param {React.ReactNode} [props.placeholder] - Shown while loading
 * @param {React.ReactNode} props.children - Rendered once loading finishes
 * @param {number} [props.minDuration] - Minimum time (ms) the placeholder stays visible
 * @param {Promise<unknown>[]} [props.tasks] - Extra promises to await before loading finishes; their
 * resolved values are exposed via `LoaderContext` as `tasksResults`
 * @returns {React.ReactElement}
 */
function Loader({
  fonts,
  images,
  placeholder = <div>loading...</div>,
  children,
  minDuration = 0,
  tasks = defaultTasks,
}) {
  const [loadingMin, setLoadingMin] = useState(true);
  const [loadingFonts, setLoadingFonts] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const [tasksResults, setTasksResults] = useState();

  const handleImagesLoad = useCallback(() => {
    setLoadingImages(false);
  }, []);

  const handleFontsLoad = useCallback(() => {
    setLoadingFonts(false);
  }, []);

  useEffect(() => {
    if (loadingMin) {
      (async () => {
        const results = await Promise.all([
          wait(minDuration),
          ...tasks,
        ]);
        setTasksResults(results.slice(1));
        setLoadingMin(false);
        // console.log('min loading time passed', loadingMin, minLoadingTime, tasks);
      })();
    }
  }, [loadingMin, minDuration, tasks]);

  const context = useMemo(() => ({
    tasksResults,
  }), [tasksResults]);

  if (loadingFonts || loadingImages || loadingMin) {
    // console.log('loading...');
    return (
      <div style={style}>
        {placeholder}
        <ImageLoader images={images} onLoad={handleImagesLoad} />
        <FontLoader families={fonts} onLoad={handleFontsLoad} />
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

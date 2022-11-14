import React, {
  useState,
  useEffect,
  useCallback,
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

  const context = {
    tasksResults,
  };

  return (
    <LoaderContext.Provider value={context}>
      {children}
    </LoaderContext.Provider>
  );
}

export default Loader;

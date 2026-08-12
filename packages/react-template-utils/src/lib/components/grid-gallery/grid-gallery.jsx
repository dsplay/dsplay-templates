import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './grid-gallery.sass';

/**
 * @typedef {object} InputImage
 * @property {string} src
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {InputImage & {id: string, marginTop: number, marginBottom: number, marginLeft: number, marginRight: number}} LaidOutImage
 */

function makeId(length = 16) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * @param {Array<InputImage | string>} images
 * @returns {Promise<InputImage[]>}
 */
async function convertImages(images) {
  return Promise.all(images.map((imageOrSrc) => {
    if (typeof imageOrSrc === 'string') {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageOrSrc;
        image.onload = (e) => {
          const img = e.target;
          const { src, width, height } = img;
          resolve({ src, width, height });
        };
        image.onerror = (e) => {
          reject(e);
        };
      });
    }

    return Promise.resolve(imageOrSrc);
  }));
}

/**
 * Lays out a set of images in a justified grid (like a photo-gallery wall), filling
 * the container's width/height by scaling each row's images to a common height.
 * @param {object} props
 * @param {Array<InputImage | string>} props.images - Image URLs, or `{src, width, height}` objects (skips the preload step needed to measure a bare URL's natural size).
 * @param {number} [props.margin] - Pixel gap between images.
 * @param {string} [props.containerClassName] - Extra class applied to the gallery container.
 * @param {string} [props.imageClassName] - Extra class applied to each image.
 * @returns {React.ReactElement}
 */
function GridGallery({
  images,
  margin = 2,
  containerClassName = '',
  imageClassName = '',
}) {
  const [containerWidth, setContainerWidth] = useState();
  const [containerHeight, setContainerHeight] = useState();
  const [convertedImages, setProcessedImages] = useState();
  const element = useRef(null);

  useEffect(() => {
    (async () => {
      const processed = await convertImages(images);
      setProcessedImages(processed);
    })();
  }, [images]);

  useEffect(() => {
    if (element.current !== null) {
      setContainerWidth(element.current.offsetWidth);
      setContainerHeight(element.current.offsetHeight);
    }
  }, []);

  const finalImages = useMemo(() => {
    if (containerWidth === undefined || containerHeight === undefined || convertedImages === undefined) return undefined;

    const maxRatio = 0.5;
    const unit = Math.sqrt((containerWidth * containerHeight) / convertedImages.length);

    const rowCount = Math.min(Math.round(containerHeight / unit), convertedImages.length);
    const maxColumnCount = Math.ceil(convertedImages.length / rowCount);
    const minColumnCount = Math.floor(convertedImages.length / rowCount);
    const rowHeight = Math.floor((containerHeight - ((rowCount + 1) * margin)) / rowCount);

    let currentRowWidths = [];
    let finalData = [];
    let currentRowTotalWidth = margin;
    let currentRowCount = 1;
    const maxWidth = Math.floor(rowHeight * (1 + maxRatio));
    const minWidth = Math.floor(rowHeight * (1 - maxRatio));

    function finishRow(row) {
      const currentSum = row.reduce((sum, { width: colWidth }) => sum + colWidth, 0);
      const colCount = row.length;
      const availableWidth = containerWidth - (colCount * margin) - margin;
      const resized = row.map(({ width: colWidth, ...image }) => ({
        ...image,
        width: Math.min(Math.floor((colWidth / currentSum) * availableWidth), containerWidth - 2 * margin),
      }));
      const resizedSum = resized.reduce((sum, { width: colWidth }) => sum + colWidth, 0);

      const remainingItemSpace = availableWidth - resizedSum;
      const [lastItem] = resized.slice(-1);

      return [
        ...resized.slice(0, -1),
        {
          ...lastItem,
          width: lastItem.width + remainingItemSpace,
        },
      ];
    }

    convertedImages.forEach((image, i) => {
      let w = Math.floor((image.width * rowHeight) / image.height);
      w = Math.max(w, minWidth);
      w = Math.min(w, maxWidth);
      currentRowWidths.push({
        src: image.src,
        height: rowHeight,
        width: w,
        marginTop: currentRowCount === 1 ? margin : 0,
        marginBottom: margin,
        marginLeft: currentRowWidths.length === 0 ? margin : 0,
        marginRight: margin,
        id: makeId(),
      });
      currentRowTotalWidth += w + margin;
      const remainingSpace = containerWidth - currentRowTotalWidth;
      const rowWidthReached = remainingSpace - margin < minWidth;
      const minColumnCountSatisfied = currentRowWidths.length >= minColumnCount;
      const maxColumnCountReached = currentRowWidths.length === maxColumnCount;
      const noRowSpace = rowWidthReached && minColumnCountSatisfied;
      const itemsToProcess = convertedImages.length - (i + 1);
      const remainingRows = rowCount - currentRowCount;
      const enoughItemsForNextRows = itemsToProcess > remainingRows;
      const enoughRowsForNextItems = itemsToProcess / maxColumnCount < remainingRows;
      const widthOrColumnCountReached = noRowSpace || maxColumnCountReached;
      const shouldBreakLine = enoughRowsForNextItems && widthOrColumnCountReached;
      if (!enoughItemsForNextRows || shouldBreakLine) {
        finalData = [
          ...finalData,
          ...finishRow(currentRowWidths),
        ];
        currentRowWidths = [];
        currentRowTotalWidth = margin;
        currentRowCount += 1;
      }
    });

    if (currentRowWidths.length > 0) {
      finalData = [
        ...finalData,
        ...finishRow(currentRowWidths),
      ];
    }

    return finalData;
  }, [containerWidth, containerHeight, convertedImages, margin]);

  if (finalImages === undefined) {
    return (
      <div
        className={`${containerClassName}`}
        ref={element}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    );
  }

  return (
    <div
      className={`grid-gallery ${containerClassName}`}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {
        finalImages.map((image) => (
          <div
            key={image.id}
            className={`${imageClassName} gallery-item`}
            style={{
              ...image,
              backgroundImage: `url('${image.src}')`,
            }}
          />
        ))
      }
    </div>
  );
}

export default GridGallery;

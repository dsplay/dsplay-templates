import React, { useState, useEffect, useMemo } from 'react';

function ImageLoader({
  images = [],
  onLoad,
}) {
  const [loadCount, setLoadCount] = useState(0);
  const [errors, setErrors] = useState([]);
  const uniqueImages = useMemo(() => [...new Set(images.filter((i) => i))], [images]);
  const total = uniqueImages.length;

  const onLoadImage = () => setLoadCount(loadCount + 1);

  const onErrorImage = ({ target: { src } }) => {
    setLoadCount(loadCount + 1);
    setErrors([...errors, src]);
  };

  useEffect(() => {
    // console.log(loadCount, 'of', total);
    if (loadCount === total) {
      // console.log('all images loaded! errors:', errors);
      onLoad();
    }
  }, [total, loadCount, onLoad, errors]);

  const style = {
    display: 'inline',
    visibility: 'hidden',
    width: 0,
    height: 0,
  };

  return (
    <div style={style}>
      {uniqueImages.map((image) => <img key={image} src={image} alt="" onLoad={onLoadImage} onError={onErrorImage} />)}
    </div>
  );
}

export default ImageLoader;

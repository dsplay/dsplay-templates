import React from 'react';
import GridGallery from './grid-gallery';

const images = [
  'https://source.unsplash.com/2ShvY8Lf6l0',
  'https://source.unsplash.com/Dm-qxdynoEc',
  'https://source.unsplash.com/qDkso9nvCg0',
  'https://source.unsplash.com/iecJiKe_RNg',
  'https://source.unsplash.com/epcsn8Ed8kY',
  'https://source.unsplash.com/NQSWvyVRIJk',
  'https://source.unsplash.com/zh7GEuORbUw',
  'https://source.unsplash.com/PpOHJezOalU',
  'https://source.unsplash.com/I1ASdgphUH4',
  'https://source.unsplash.com/XiDA78wAZVw',
  'https://source.unsplash.com/x8xJpClTvR0',
  'https://source.unsplash.com/qGQNmBE7mYw',
  'https://source.unsplash.com/NuO6iTBkHxE',
  'https://source.unsplash.com/pF1ug8ysTtY',
  'https://source.unsplash.com/A-fubu9QJxE',
  'https://source.unsplash.com/5P91SF0zNsI',
  'https://source.unsplash.com/Uw0PjM7WKPQ',
  'https://source.unsplash.com/hOGGq-e4aWI',
  'https://source.unsplash.com/-V2SNXfhbwE',
  'https://source.unsplash.com/JL4OgwQ0NHs',
];

export default {
  title: 'dsplay/GridGallery',
  component: GridGallery,
};

function Template({ containerWidth, containerHeight, containerBgColor, ...args }) {
  return (
    <div style={{ width: containerWidth, height: containerHeight, backgroundColor: containerBgColor }}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading -- Storybook args are inherently a spread bag */}
      <GridGallery {...args} />
    </div>
  );
}

const containerBgColor = 'black';

export const LandscapeWide = {
  render: Template,
  name: '16:9 Landscape',
  args: { containerWidth: 1280, containerHeight: 720, containerBgColor, images },
};

export const PortraitTall = {
  render: Template,
  name: '16:9 Portrait',
  args: { containerWidth: 720, containerHeight: 1280, containerBgColor, images },
};

export const Landscape4x3 = {
  render: Template,
  name: '4:3 Landscape',
  args: { containerWidth: 1024, containerHeight: 748, containerBgColor, images },
};

export const Portrait4x3 = {
  render: Template,
  name: '4:3 Portrait',
  args: { containerWidth: 748, containerHeight: 1024, containerBgColor, images },
};

export const Square = {
  render: Template,
  args: { containerWidth: 640, containerHeight: 640, containerBgColor, images },
};

export const HBanner = {
  render: Template,
  name: 'H Banner',
  args: { containerWidth: 1280, containerHeight: 100, containerBgColor, images },
};

export const VBanner = {
  render: Template,
  name: 'V Banner',
  args: { containerWidth: 100, containerHeight: 1280, containerBgColor, images, margin: 2 },
};

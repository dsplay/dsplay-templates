import React from 'react';
import FitText from './fit-text';

export default {
  title: 'dsplay/FitText',
  component: FitText,
};

function Template({ containerWidth, containerHeight, text }) {
  return (
    <div style={{ width: containerWidth, height: containerHeight, border: '1px solid #ccc' }}>
      <FitText>{text}</FitText>
    </div>
  );
}

export const Default = {
  render: Template,
  args: { containerWidth: 600, containerHeight: 200, text: 'Scales to fill me!' },
};

export const NarrowBanner = {
  render: Template,
  args: { containerWidth: 1000, containerHeight: 80, text: 'A horizontal banner headline' },
};

export const Square = {
  render: Template,
  args: { containerWidth: 300, containerHeight: 300, text: 'Square' },
};

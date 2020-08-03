import React from 'react';
import { FitText } from '@dsplay/react-template-utils';

const MyFitText = ({
  children,
  style = {},
}) => (
  <FitText style={style} readyClassName="fade-in">
    {children}
  </FitText>
);

export default MyFitText;

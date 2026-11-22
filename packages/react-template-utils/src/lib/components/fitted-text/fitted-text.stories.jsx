import React from 'react';
import FittedText from './fitted-text';

export default {
  title: 'dsplay/FittedText',
  component: FittedText,
};

function Template({ boxWidth, text, max, min }) {
  return (
    <div style={{ width: boxWidth, border: '1px solid #ccc', fontSize: 16 }}>
      <FittedText text={text} max={max} min={min} />
    </div>
  );
}

export const ShortKeepsTheBiggest = {
  render: Template,
  args: { boxWidth: 400, text: 'Nova Network', max: 3, min: 1.2 },
};

export const LongShrinksToFit = {
  render: Template,
  args: { boxWidth: 400, text: 'Votaí - Concurso de fotos do nosso condomínio', max: 3, min: 1.2 },
};

export const TooLongIsCut = {
  render: Template,
  args: { boxWidth: 200, text: 'Votaí - Concurso de fotos do nosso condomínio', max: 3, min: 1.2 },
};

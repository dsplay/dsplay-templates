import { SIZES, known } from '../../lib/post-look';

// The blocks of a post (runs of text with bold, italic, underline, a size and a named colour) as spans: every text is set as text, never as markup.
function Blocks({ blocks, colors }) {
  return (blocks || []).map((block, index) => {
    if (!block || typeof block.text !== 'string') return null;
    const style = {};
    if (block.bold === true) style.fontWeight = 'bold';
    if (block.italic === true) style.fontStyle = 'italic';
    if (block.underline === true) style.textDecoration = 'underline';
    const size = known(SIZES, block.size);
    if (size) style.fontSize = `${SIZES[size]}em`;
    const color = known(colors, block.color);
    if (color) style.color = colors[color];
    return <span key={index} style={style}>{block.text}</span>;
  });
}

export default Blocks;

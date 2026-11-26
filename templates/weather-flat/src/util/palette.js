// Flat weather colors (weather-flat 2.1 and 2.2). Colors only reach the DOM by inline style (no CSS variables).

// background of the `now` card and of the bars, by weather family and day/night; white text and the original icons read on them
export const FAMILY = {
  clear: { day: '#1F5FA3', night: '#2B2F6E' },
  clouds: { day: '#4A5A72', night: '#2F3647' },
  rain: { day: '#35507A', night: '#1F2A44' },
  snow: { day: '#4F6485', night: '#2D3A57' },
  mist: { day: '#5A6370', night: '#343A46' },
};

export const familyColor = (family, day) => (FAMILY[family] || FAMILY.clouds)[day ? 'day' : 'night'];

// the original icon colors, and their replacement on light cards (the same table as the information bar)
const LIGHT_CARD = {
  '#FFFFFF': '#4A4F57',
  '#9AB0C4': '#4A4F57',
  '#FFC83D': '#B26A00',
  '#9AD1FF': '#1F5FA3',
};

/** SVG text with the colors replaced for a light card; the original text for dark surfaces. */
export function recolor(svg, lightCard) {
  if (!lightCard) {
    return svg;
  }
  return Object.keys(LIGHT_CARD).reduce((text, from) => text.split(from).join(LIGHT_CARD[from]), svg);
}

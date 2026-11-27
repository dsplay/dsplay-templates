// Boxes of every element, in rem of the design screen (spec qrcode-wifi-neo, section 5). { x, y, w, h }.
// The card margin (6 rem) holds the shadow reach (2 rem) plus 4 rem of air. The H and V bars are laid out in sass.

export const QR_PADDING = 2; // rem of white around the canvas (quiet zone of the tile)

export const LAYOUT = {
  land: {
    card: [6, 6, 180, 96],
    seal: [14, 12, 18, 18],
    marker: [36, 17.5, 0.8, 8],
    sub: [38.5, 12, 66.5, 4.6],
    title: [38.5, 16.6, 66.5, 10],
    legend: [108, 14, 74, 4.6],
    qr: [108, 22, 74, 74],
    netLabel: [14, 38, 84, 3.8],
    net: [14, 42, 84, 13],
    pwLabel: [14, 59, 84, 3.8],
    pw: [14, 63, 84, 13],
    logo: [14, 84, 14, 7],
    sizes: { title: 9, sub: 3.4, net: 5.4, pw: 4.6, lines: 2 },
  },
  port: {
    card: [6, 6, 96, 180],
    seal: [14, 12, 16, 16],
    marker: [33, 18, 0.8, 8],
    sub: [35.5, 12, 62.5, 4.6],
    title: [35.5, 16.6, 62.5, 11],
    legend: [14, 40, 80, 4.6],
    qr: [14, 46, 80, 80],
    netLabel: [10, 131, 88, 3.8],
    net: [10, 135, 88, 13],
    pwLabel: [10, 152, 88, 3.8],
    pw: [10, 156, 88, 13],
    logo: [10, 174, 14, 7],
    sizes: { title: 10, sub: 3.4, net: 5.4, pw: 4.6, lines: 2 },
  },
  sq: {
    card: [6, 6, 96, 96],
    seal: [12, 12, 14, 14],
    marker: [12, 30, 0.8, 7],
    title: [14.5, 28.5, 37.5, 16],
    legend: [52, 26.5, 46, 4.6],
    qr: [52, 32, 46, 46],
    netLabel: [12, 47, 38, 3.8],
    net: [12, 51, 38, 11],
    pwLabel: [12, 65, 38, 3.8],
    pw: [12, 69, 38, 11],
    logo: [12, 86, 12, 6],
    sizes: { title: 7, net: 4.2, pw: 4.2, lines: 1, titleLines: 2 },
  },
  wide: {
    card: [3, 3, 186, 42],
    seal: [9, 15, 18, 18],
    netLabel: [32, 15.85, 26, 3.8],
    net: [60, 13.5, 68, 8.5],
    pwLabel: [32, 28.35, 26, 3.8],
    pw: [60, 26, 68, 8.5],
    logo: [133, 21, 12, 6],
    qr: [149, 6, 36, 36],
    sizes: { net: 4.4, pw: 4.0, lines: 1 },
  },
};

export const box = ([x, y, w, h]) => ({
  position: 'absolute', left: `${x}rem`, top: `${y}rem`, width: `${w}rem`, height: `${h}rem`,
});

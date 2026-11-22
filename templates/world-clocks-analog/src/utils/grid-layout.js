// Share of a cell the clock may take: its width, and its height once the city and date lines are taken out.
const CLOCK_OF_WIDTH = 0.7;
const CLOCK_OF_HEIGHT = 0.54;
// The city and date lines are as tall as these shares of the clock, so they follow it in every grid.
const CITY_OF_CLOCK = 0.19;
const DATE_OF_CLOCK = 0.13;

/**
 * Lays `count` equal cells out on a `width` x `height` screen: the number of columns that makes the
 * clocks biggest wins (fewer rows on a tie), whatever the size or shape of the screen.
 * `clockPercent` is the clock's width as a percentage of the cell's width, `cityPercent` and
 * `datePercent` the height of the two text lines as a percentage of the cell's height.
 */
function gridLayout(count, width, height) {
  const total = Math.max(1, count);
  let best = null;

  for (let columns = 1; columns <= total; columns += 1) {
    const rows = Math.ceil(total / columns);
    const cellWidth = width / columns;
    const cellHeight = height / rows;
    const diameter = Math.min(cellWidth * CLOCK_OF_WIDTH, cellHeight * CLOCK_OF_HEIGHT);

    if (!best || diameter > best.diameter + 0.5) {
      best = {
        columns,
        rows,
        diameter,
        cellWidth,
        cellHeight,
      };
    }
  }

  return {
    columns: best.columns,
    rows: best.rows,
    cellWidthPercent: 100 / best.columns,
    cellHeightPercent: 100 / best.rows,
    clockPercent: (best.diameter / best.cellWidth) * 100,
    cityPercent: ((best.diameter * CITY_OF_CLOCK) / best.cellHeight) * 100,
    datePercent: ((best.diameter * DATE_OF_CLOCK) / best.cellHeight) * 100,
  };
}

export default gridLayout;

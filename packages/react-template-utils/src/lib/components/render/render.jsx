import useScreenInfo from '../../hooks/use-screen-info';

/**
 * Renders its children only when the current screen format matches the given constraints.
 * @param {object} props
 * @param {string[]} [props.on] - Screen formats to render on (any format when empty). See screen.js format constants.
 * @param {string[]} [props.notOn] - Screen formats to never render on
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode | null}
 */
function Render({
  on = [],
  notOn = [],
  children,
}) {
  const { screenFormat } = useScreenInfo();

  if ((on.length === 0 || on.includes(screenFormat)) && !notOn.includes(screenFormat)) {
    return children;
  }

  return null;
}

export default Render;

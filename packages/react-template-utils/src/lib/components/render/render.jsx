import useScreenInfo from '../../hooks/use-screen-info';

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

import { useTemplateVal } from '@dsplay/react-template-utils';

const CELSIUS = 'celsius';
const FAHRENHEIT = 'fahrenheit';

export function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

export function useTemperature(celsius) {
  const unit = useTemplateVal('unit', CELSIUS);

  return unit === FAHRENHEIT ? celsiusToFahrenheit(celsius) : celsius;
}

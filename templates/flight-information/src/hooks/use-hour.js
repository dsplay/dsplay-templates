import { useConfig } from '@dsplay/react-template-utils';

export default function useHourFormat() {
  const { locale } = useConfig();
  return locale === 'en';
}

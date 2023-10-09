import { useConfig } from '@dsplay/react-template-utils';

export default function hourFormat() {
  const { locale } = useConfig();
  if (locale === 'en') {
    return true;
  }
  return false;
}

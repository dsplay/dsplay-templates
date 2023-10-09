import { useConfig } from '@dsplay/react-template-utils';

export default function useLanguage() {
  const { locale } = useConfig();

  return locale;
}

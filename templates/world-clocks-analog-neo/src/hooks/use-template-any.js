import { useTemplate } from '@dsplay/react-template-utils';

// TODO(tvalAny): replace this local helper by the shared library's tvalAny when it ships (spec-variaveis.md §2).
// First non-empty legacy key wins. The settings hook passes its result as the *default* of the new key's
// `useTemplateVal`, so the new key still wins, and the manifest scanner still sees the new key.
export default function useLegacyVal(keys, def = '') {
  const source = useTemplate() || {};
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') return String(value).trim();
  }
  return def;
}

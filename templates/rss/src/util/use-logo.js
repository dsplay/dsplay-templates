import { useState } from 'react';
import { useMedia, useTemplateVal } from '@dsplay/react-template-utils';
import { channelLogoOf } from './rss-item';

/**
 * The picture shown next to the title, in order: the channel's own logo (a player that sends the gateway's body),
 * the template's `logo` variable, then nothing (the caller draws the default RSS icon). A picture that fails to load
 * hands over to the next one.
 * @returns {{ src: string|undefined, onError: () => void }}
 */
export default function useLogo() {
  const channelLogo = channelLogoOf(useMedia());
  const templateLogo = useTemplateVal('logo', '');
  const candidates = [channelLogo, templateLogo].filter(Boolean);

  const [failed, setFailed] = useState([]);
  const src = candidates.find((candidate) => !failed.includes(candidate));
  const onError = () => setFailed((list) => [...list, src]);

  return { src, onError };
}

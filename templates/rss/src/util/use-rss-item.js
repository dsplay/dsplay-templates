import { useMedia } from '@dsplay/react-template-utils';
import rssItemOf from './rss-item';

/** `useMedia()` with the item's flat keys filled in from the gateway's body when the player did not send them. */
export default function useRssItem() {
  return rssItemOf(useMedia());
}

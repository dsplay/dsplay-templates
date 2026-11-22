import { useScreenInfo } from '@dsplay/react-template-utils';
import { plateOf } from '../../lib/layout';

/** The design plate of the screen (`{ kind, w, h }`): what a style lays itself out on and sizes its texts for. */
export default function usePlate() {
  const { screenFormat, w, h } = useScreenInfo();
  return plateOf(screenFormat, w, h);
}

import { useMedia } from '@dsplay/react-template-utils';
import './style.sass';

/**
 * The address the gateway signed for this showing: `media.result.data.url` (the answer of the DSPLAY player gateway, `data: { url, expiresAt }`). Nothing is fetched or
 * configured here: the player asks the gateway again for every showing, and the address works once, so a showing never reuses an old one.
 */
export function embeddedUrl(result) {
  const url = result && result.data && result.data.url;
  return typeof url === 'string' && /^https?:\/\//i.test(url) ? url : null;
}

function Main() {
  const { result } = useMedia();
  const url = embeddedUrl(result);

  return (
    <div className="main">
      {url && (
        <iframe
          key={url}
          className="page"
          title="dashboard"
          src={url}
          sandbox="allow-scripts allow-same-origin allow-forms"
          allow="fullscreen"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
}

export default Main;

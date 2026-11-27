// A tiny GET for JSON on XMLHttpRequest (old WebViews: no fetch). Resolves with the parsed body, rejects otherwise.

export default function getJson(url, timeout) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.timeout = timeout || 15000;
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        try {
          resolve(JSON.parse(request.responseText));
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error(`HTTP ${request.status}`));
      }
    };
    request.onerror = () => reject(new Error('network'));
    request.ontimeout = () => reject(new Error('timeout'));
    request.send();
  });
}

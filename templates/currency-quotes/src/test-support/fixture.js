import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// The example media of public/dsplay-data.js (what the CMS preview and the screenshots show), evaluated the way the browser does; `search` is the query
// string of the dev server (?count=2&period=none...).
const code = readFileSync(resolve(import.meta.dirname, '../../public/dsplay-data.js'), 'utf8');
const load = new Function('window', `${code}; return dsplay_media;`);

export const exampleMedia = (search = '') => load({ innerHeight: 720, innerWidth: 1280, location: { search } });
export const exampleResult = (search = '') => exampleMedia(search).result;

// Where the web view gets its data: the local server's JSON API, or a backend
// given to the page as `globalThis.skillAtlasBackend`, such as the browser
// playground's (src/browser.ts). URLs are relative, so the page works from any path.

const backend = () => globalThis.skillAtlasBackend;

/** The repository and a line about each skill. */
export async function skills() {
  return backend() ? backend().skills() : get('api/skills');
}

/** One skill with its front matter properties and body, or null. */
export async function skill(id) {
  return backend() ? backend().skill(id) : get(`api/skills/${encodeURIComponent(id)}`);
}

/** Calls `listener` when the atlas changes; only a backend in the page changes under it. */
export function subscribe(listener) {
  backend()?.subscribe?.(listener);
}

async function get(url) {
  const response = await fetch(url);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);
  return response.json();
}

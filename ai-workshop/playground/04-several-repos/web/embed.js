// The web view without the terminal, as the slides embed it: this page makes the backend,
// scans the repositories named by ?scan=, then starts the web view.
import { createBrowserBackend } from '../backend.js';

const load = (name) => fetch(`../../fixtures/${name}`).then((response) => response.json());
const backend = createBrowserBackend({
  fixtures: await Promise.all(["JetBrains-MPS.json","JetBrains-intellij-community.json","JetBrains-kotlin.json"].map(load)),
  claude: undefined,
});
for (const repository of new URLSearchParams(location.search).getAll('scan')) await backend.load(repository);
globalThis.skillAtlasBackend = backend;
await import('./app.js');

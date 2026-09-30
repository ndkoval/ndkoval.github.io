// In the playground, the shell page around this one owns the backend.
globalThis.skillAtlasBackend = parent === window ? undefined : parent.skillAtlasBackend;
// Alt+1…6 switches the step here too.
document.addEventListener('keydown', (event) => parent.playgroundKey?.(event));
if (globalThis.skillAtlasBackend) await import('./app.js');
else location.replace('../');

/* Preserve the user's last draft before the legacy bootstrap runs. */
window.__planformSavedState = localStorage.getItem('planform-state');
window.__planformHasLocalDraft = Boolean(window.__planformSavedState);

/* A published plan can provide the first-run layout without replacing a local draft. */
if (!window.__planformHasLocalDraft) {
  const defaultPlanUrls = [
    '../hw904.json',
    'hw904.json'
  ];
  window.__planformDefaultStatePromise = (async () => {
    for (const url of defaultPlanUrls) {
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok && response.status !== 0) continue;
        return await response.json();
      } catch {}
    }
    return null;
  })();
}

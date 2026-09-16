/* Single post-action persistence boundary for the prototype's layered UI. */
queueMicrotask(() => {
  const serializeState = () => ({
    nodes: state.nodes,
    edges: state.edges,
    objects: state.objects,
    builtins: [],
    assets: state.assets,
    areas: state.areas || [],
    view: state.view
  });
  const persist = () => {
    if (typeof window.planformPersist === 'function') {
      window.planformPersist();
    } else {
      localStorage.setItem('planform-state', JSON.stringify(serializeState()));
    }
    const status = document.getElementById('saveState');
    if (status) status.textContent = 'Saved locally';
  };
  const commitAfterSave = () => {
    setTimeout(() => {
      render();
      renderLibrary('assets');
      persist();
    }, 0);
  };
  const saveSelector = '#saveRightAsset, #saveAssetDefinition, #saveLibraryAsset, #saveFurniture, #saveAsset';
  document.addEventListener('click', event => {
    if (event.target?.closest?.(saveSelector)) commitAfterSave();
  }, true);

  const importClipboard = async () => {
    const status = document.getElementById('saveState');
    try {
      let text = '';
      if (navigator.clipboard?.readText) {
        try { text = await navigator.clipboard.readText(); } catch {}
      }
      if (!text) {
        text = window.prompt('Clipboard access is unavailable here. Paste an exported plan JSON value:') || '';
      }
      if (!text.trim()) throw new Error('The clipboard is empty.');
      const imported = JSON.parse(text);
      if (!Array.isArray(imported.nodes) || !Array.isArray(imported.edges)) {
        throw new Error('This does not look like an Interior Planning Tool plan.');
      }
      checkpoint();
      state.nodes = imported.nodes;
      state.edges = imported.edges;
      state.objects = Array.isArray(imported.objects) ? imported.objects : [];
      state.assets = Array.isArray(imported.assets) ? imported.assets : [];
      state.areas = Array.isArray(imported.areas) ? imported.areas : [];
      state.builtins = [];
      if (imported.view && typeof imported.view === 'object') state.view = imported.view;
      state.mode = 'select';
      state.selected = null;
      state.edgeDraft = null;
      state.areaSelection = null;
      state.areaCandidates = null;
      state.labelCandidate = null;
      state.labelError = null;
      render();
      renderLibrary('assets');
      persist();
      if (status) status.textContent = 'Imported from clipboard';
    } catch (error) {
      if (status) status.textContent = 'Import failed';
      window.alert(error.message || 'Could not import the clipboard contents.');
    }
  };
  document.getElementById('importClipboardBtn')?.addEventListener('click', importClipboard);
  window.addEventListener('beforeunload', persist);
});

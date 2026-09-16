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
  window.addEventListener('beforeunload', persist);
});

/* Asset-library / inspector layout and cursor-anchored zoom. */
queueMicrotask(() => {
  const left = document.querySelector('.left-panel');
  const library = document.getElementById('library');
  const inspector = document.getElementById('inspector');
  const detachedEditor = document.getElementById('assetEditor');
  let libraryAssetId = null;
  let rotatingObjectId = null;

  if ((!Array.isArray(state.areas) || state.areas.length === 0) && window.__planformSavedState) {
    try {
      const saved = JSON.parse(window.__planformSavedState);
      if (Array.isArray(saved.areas)) state.areas = saved.areas;
    } catch {}
  }
  state.areas = Array.isArray(state.areas) ? state.areas : [];

  const persistCurrentState = () => localStorage.setItem('planform-state', JSON.stringify({
    nodes: state.nodes,
    edges: state.edges,
    objects: state.objects,
    builtins: [],
    assets: state.assets,
    areas: state.areas,
    view: state.view
  }));
  window.planformPersist = persistCurrentState;
  const baseCheckpoint = checkpoint;
  checkpoint = () => {
    baseCheckpoint();
    persistCurrentState();
  };

  if (detachedEditor) detachedEditor.remove();
  document.querySelectorAll('.tabs').forEach(tabs => { tabs.style.display = 'none'; });
  const objectsTitle = [...document.querySelectorAll('.section-title.with-action')]
    .find(title => title.textContent.includes('Objects'));
  if (objectsTitle) {
    const label = objectsTitle.querySelector('span');
    if (label) label.textContent = 'Asset library';
    objectsTitle.classList.remove('with-action');
    objectsTitle.querySelector('button')?.remove();
  }
  const oldNewAsset = document.getElementById('newAsset');
  if (oldNewAsset) oldNewAsset.style.display = 'none';

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
  const selectedObject = () => state.objects.find(o => o.id === state.selected);
  const assetFor = object => {
    if (!object) return null;
    const direct = state.assets.find(asset => asset.id === object.assetId);
    if (direct) return direct;
    const legacy = state.assets.find(asset =>
      object.id.startsWith(`${asset.id}-`) ||
      (asset.name === object.name && Number(asset.w) === Number(object.w) && Number(asset.d) === Number(object.d))
    );
    if (legacy) {
      object.assetId = legacy.id;
      return legacy;
    }
    return object;
  };

  const renderAddAsset = () => {
    if (!library || document.getElementById('newAssetRow')) return;
    const add = document.createElement('button');
    add.id = 'newAssetRow';
    add.className = 'library-item new-asset-row';
    add.type = 'button';
    add.innerHTML = '<span class="new-asset-mark">NEW</span><span><strong>New asset</strong><small>Create reusable furniture</small></span>';
    add.onclick = () => {
      checkpoint();
      const asset = { id: `asset-${Date.now()}`, name: 'New asset', type: 'custom', w: 36, d: 36, h: 30, legs: false, floor: true, collision: true };
      state.assets.push(asset);
      state.selected = null;
      libraryAssetId = asset.id;
      render();
      persistCurrentState();
    };
    library.prepend(add);
  };

  const baseLibrary = renderLibrary;
  const renderAssetCards = () => {
    if (!library) return;
    library.innerHTML = state.assets.length
      ? state.assets.map(asset => `<button class="library-item" draggable="true" data-asset-id="${esc(asset.id)}"><span class="swatch">${asset.legs ? '♜' : '▰'}</span><span><strong>${esc(asset.name)}</strong><small>${fmt(asset.w)} × ${fmt(asset.d)}${asset.legs ? ' · legs' : ''}</small></span></button>`).join('')
      : '<div class="empty-library">No assets yet. Create one, then drag it onto the plan.</div>';
    library.querySelectorAll('[data-asset-id]').forEach(button => {
      button.addEventListener('dragstart', event => {
        event.dataTransfer?.setData('planform-asset', button.dataset.assetId);
        if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy';
      });
    });
    renderAddAsset();
  };
  renderLibrary = tab => {
    if (tab !== 'assets') return baseLibrary(tab);
    renderAssetCards();
  };

  const baseRenderObjects = renderObjects;
  renderObjects = () => {
    baseRenderObjects();
    const all = [...state.builtins.map(o => ({ ...o, builtin: true })), ...state.objects];
    objectLayer.querySelectorAll('g').forEach((group, index) => {
      const object = all[index];
      if (!object) return;
      const label = group.querySelector('.asset-label, .builtin-label');
      if (label) label.setAttribute('transform', `rotate(${-(Number(object.rot) || 0)} ${object.w / 2} ${object.d / 2})`);
    });
    if (rotatingObjectId) {
      const object = state.objects.find(o => o.id === rotatingObjectId);
      if (object) {
        const cx = object.x + object.w / 2;
        const cy = object.y + object.d / 2;
        uiLayer.append(el('circle', { cx, cy, r: 3.2, class: 'rotation-center' }));
        uiLayer.append(el('line', { x1: cx - 5, y1: cy, x2: cx + 5, y2: cy, class: 'rotation-center-cross' }));
        uiLayer.append(el('line', { x1: cx, y1: cy - 5, x2: cx, y2: cy + 5, class: 'rotation-center-cross' }));
      }
    }
  };

  const formFor = (asset, object) => {
    const instance = Boolean(object);
    inspector.innerHTML = `<div class="asset-editor right-asset-editor">
      <h3>${esc(asset.name)}</h3>
      <div class="asset-form-note">${instance ? 'Shared asset definition' : 'Reusable asset definition'}</div>
      <label>Name<input id="rightAssetName" value="${esc(asset.name)}"></label>
      <div class="form-row"><label>Width (in)<input id="rightAssetW" type="number" step="1" value="${Math.round(asset.w)}"></label>
      <label>Depth (in)<input id="rightAssetD" type="number" step="1" value="${Math.round(asset.d)}"></label></div>
      <label>Height (in)<input id="rightAssetH" type="number" step="1" value="${Math.round(asset.h || 0)}"></label>
      <label class="check"><input id="rightAssetLegs" type="checkbox" ${asset.legs ? 'checked' : ''}>Show legs / supports</label>
      <label class="check"><input id="rightAssetFloor" type="checkbox" ${asset.floor !== false ? 'checked' : ''}>Takes up floor space</label>
      <label class="check"><input id="rightAssetCollision" type="checkbox" ${asset.collision ? 'checked' : ''}>Show collision footprint</label>
      <div class="asset-status">${instance ? 'This furniture uses the shared asset definition.' : 'Drag from the library to place this asset on the plan.'}</div>
      <button class="asset-save" id="saveRightAsset">Save asset</button>
      <button class="asset-delete" id="${instance ? 'deleteRightFurniture' : 'deleteRightAsset'}">${instance ? 'Delete furniture' : 'Delete asset'}</button>
    </div>`;

    document.getElementById('saveRightAsset').onclick = () => {
      checkpoint();
      const values = {
        name: document.getElementById('rightAssetName').value.trim() || asset.name,
        w: Math.max(1, Math.round(Number(document.getElementById('rightAssetW').value) || asset.w)),
        d: Math.max(1, Math.round(Number(document.getElementById('rightAssetD').value) || asset.d)),
        h: Math.max(0, Math.round(Number(document.getElementById('rightAssetH').value) || asset.h || 0)),
        legs: document.getElementById('rightAssetLegs').checked,
        floor: document.getElementById('rightAssetFloor').checked,
        collision: document.getElementById('rightAssetCollision').checked
      };
      Object.assign(asset, values);
      state.objects.forEach(o => {
        if (assetFor(o) === asset) {
          o.assetId = asset.id;
          Object.assign(o, values);
        }
      });
      render();
      renderLibrary('assets');
      persistCurrentState();
    };

    document.getElementById(instance ? 'deleteRightFurniture' : 'deleteRightAsset').onclick = () => {
      checkpoint();
      if (instance) {
        state.objects = state.objects.filter(o => o.id !== object.id);
        state.selected = null;
      } else {
        state.assets = state.assets.filter(a => a.id !== asset.id);
        state.objects = state.objects.filter(o => o.assetId !== asset.id);
        libraryAssetId = null;
      }
      render();
      persistCurrentState();
    };
  };

  const baseInspector = renderInspector;
  renderInspector = () => {
    const object = selectedObject();
    const asset = assetFor(object) || state.assets.find(a => a.id === libraryAssetId);
    if (state.mode === 'select' && asset) {
      formFor(asset, object);
      return;
    }
    baseInspector();
  };

  if (library) {
    library.addEventListener('click', event => {
      const button = event.target.closest('[data-asset-id]');
      if (!button) return;
      libraryAssetId = button.dataset.assetId;
      state.selected = null;
      setTimeout(() => renderInspector(), 0);
    });
  }

  const baseObjectDown = objectDown;
  objectDown = (event, object) => {
    if (event.button === 0 || event.button === 2) libraryAssetId = null;
    if (event.button === 2 && state.mode === 'select' && !object.locked) {
      rotatingObjectId = object.id;
      renderObjects();
    }
    baseObjectDown(event, object);
  };

  const stopRotationMarker = () => {
    if (!rotatingObjectId) return;
    rotatingObjectId = null;
    renderObjects();
  };
  svg.addEventListener('pointerup', stopRotationMarker);
  svg.addEventListener('pointercancel', stopRotationMarker);

  if (inspector) {
    inspector.addEventListener('keydown', event => {
      if (event.key !== 'Enter' || !event.target.matches('input')) return;
      const save = document.getElementById('saveRightAsset');
      if (save) {
        event.preventDefault();
        save.click();
      }
    });
  }

  zoom = (factor, event) => {
    const rect = svg.getBoundingClientRect();
    const viewportX = event ? event.clientX - rect.left : rect.width / 2;
    const viewportY = event ? event.clientY - rect.top : rect.height / 2;
    const old = state.view;
    const nextW = old.w * factor;
    const nextH = old.h * factor;
    if (!event) {
      setView(old.x + (old.w - nextW) / 2, old.y + (old.h - nextH) / 2, nextW, nextH);
      return;
    }
    const scale = Math.min(rect.width / old.w, rect.height / old.h);
    const offsetX = (rect.width - old.w * scale) / 2;
    const offsetY = (rect.height - old.h * scale) / 2;
    const anchor = {
      x: old.x + (viewportX - offsetX) / scale,
      y: old.y + (viewportY - offsetY) / scale
    };
    const nextScale = Math.min(rect.width / nextW, rect.height / nextH);
    const nextOffsetX = (rect.width - nextW * nextScale) / 2;
    const nextOffsetY = (rect.height - nextH * nextScale) / 2;
    setView(
      anchor.x - (viewportX - nextOffsetX) / nextScale,
      anchor.y - (viewportY - nextOffsetY) / nextScale,
      nextW,
      nextH
    );
  };

  render();
});

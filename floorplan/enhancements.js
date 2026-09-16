/* Focused furniture interaction refinements layered over the prototype. */
queueMicrotask(() => {
  const editor = document.getElementById('assetEditor');
  const inspector = document.getElementById('inspector');
  const library = document.getElementById('library');
  let editorAssetId = null;

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

  const assetForm = (asset, object, instanceMode) => {
    if (!asset) {
      editor.hidden = true;
      editor.innerHTML = '';
      return;
    }
    editor.hidden = false;
    editor.innerHTML = `<h3>${esc(asset.name)}</h3>
      <div class="asset-form-note">${instanceMode ? 'Shared asset definition' : 'Reusable asset definition'}</div>
      <label>Name<input id="assetDefinitionName" value="${esc(asset.name)}"></label>
      <div class="form-row"><label>Width (in)<input id="assetDefinitionW" type="number" step="1" value="${Math.round(asset.w)}"></label>
      <label>Depth (in)<input id="assetDefinitionD" type="number" step="1" value="${Math.round(asset.d)}"></label></div>
      <label>Height (in)<input id="assetDefinitionH" type="number" step="1" value="${Math.round(asset.h || 0)}"></label>
      <label class="check"><input id="assetDefinitionLegs" type="checkbox" ${asset.legs ? 'checked' : ''}>Show legs / supports</label>
      <label class="check"><input id="assetDefinitionFloor" type="checkbox" ${asset.floor !== false ? 'checked' : ''}>Takes up floor space</label>
      <label class="check"><input id="assetDefinitionCollision" type="checkbox" ${asset.collision ? 'checked' : ''}>Show collision footprint</label>
      <button class="asset-save" id="saveAssetDefinition">Save asset</button>
      <button class="asset-delete" id="${instanceMode ? 'deleteFurnitureInstance' : 'deleteAssetDefinition'}">${instanceMode ? 'Delete furniture' : 'Delete asset'}</button>`;

    document.getElementById('saveAssetDefinition').onclick = () => {
      checkpoint();
      const values = {
        name: document.getElementById('assetDefinitionName').value.trim() || asset.name,
        w: Math.max(1, Math.round(Number(document.getElementById('assetDefinitionW').value) || asset.w)),
        d: Math.max(1, Math.round(Number(document.getElementById('assetDefinitionD').value) || asset.d)),
        h: Math.max(0, Math.round(Number(document.getElementById('assetDefinitionH').value) || asset.h || 0)),
        legs: document.getElementById('assetDefinitionLegs').checked,
        floor: document.getElementById('assetDefinitionFloor').checked,
        collision: document.getElementById('assetDefinitionCollision').checked
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
    };

    const remove = document.getElementById(instanceMode ? 'deleteFurnitureInstance' : 'deleteAssetDefinition');
    remove.onclick = () => {
      checkpoint();
      if (instanceMode) {
        state.objects = state.objects.filter(o => o.id !== object.id);
        state.selected = null;
        editorAssetId = null;
      } else {
        state.assets = state.assets.filter(a => a.id !== asset.id);
        state.objects = state.objects.filter(o => o.assetId !== asset.id);
        editorAssetId = null;
      }
      render();
    };
  };

  const refreshLeftEditor = () => {
    if (!editor) return;
    const object = selectedObject();
    const asset = assetFor(object) || state.assets.find(a => a.id === editorAssetId);
    assetForm(asset, object, Boolean(object));
  };

  if (editor) {
    editor.addEventListener('keydown', event => {
      if (event.key !== 'Enter' || !event.target.matches('input')) return;
      const save = document.getElementById('saveAssetDefinition');
      if (save) {
        event.preventDefault();
        save.click();
      }
    });
  }

  if (library) {
    library.addEventListener('click', event => {
      const button = event.target.closest('[data-asset-id]');
      if (!button) return;
      editorAssetId = button.dataset.assetId;
      setTimeout(refreshLeftEditor, 0);
    });
  }

  const baseRenderObjects = renderObjects;
  renderObjects = () => {
    baseRenderObjects();
    refreshLeftEditor();
  };

  const baseObjectDown = objectDown;
  objectDown = (event, object) => {
    if (event.button === 2 && state.mode === 'select' && !object.locked) {
      event.preventDefault();
      event.stopPropagation();
      state.selected = object.id;
      editorAssetId = object.assetId || object.id;
      renderInspector();
      refreshLeftEditor();

      const center = { x: object.x + object.w / 2, y: object.y + object.d / 2 };
      const start = screenPoint(event);
      const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
      const startRotation = ((object.rot || 0) % 360 + 360) % 360;
      let checkpointed = false;

      svg.setPointerCapture(event.pointerId);
      const move = moveEvent => {
        const current = screenPoint(moveEvent);
        const angle = Math.atan2(current.y - center.y, current.x - center.x);
        const delta = (angle - startAngle) * 180 / Math.PI;
        const rotation = (startRotation + Math.round(delta / 90) * 90 + 360) % 360;
        if (rotation !== (object.rot || 0)) {
          if (!checkpointed) {
            checkpoint();
            checkpointed = true;
          }
          object.rot = rotation;
          renderObjects();
          renderInspector();
        }
      };
      const up = () => {
        svg.releasePointerCapture(event.pointerId);
        svg.removeEventListener('pointermove', move);
        svg.removeEventListener('pointerup', up);
        object.x = Math.round(object.x);
        object.y = Math.round(object.y);
        object.rot = ((object.rot || 0) % 360 + 360) % 360;
        render();
      };
      svg.addEventListener('pointermove', move);
      svg.addEventListener('pointerup', up);
      return;
    }
    baseObjectDown(event, object);
  };

  svg.addEventListener('contextmenu', event => {
    if (state.mode === 'select') event.preventDefault();
  });

  const baseRenderInspector = renderInspector;
  renderInspector = () => {
    const object = selectedObject();
    if (state.mode === 'select' && object) {
      const asset = assetFor(object);
      inspector.innerHTML = `<div class="asset-editor right-asset-editor">
        <h3>${esc(asset?.name || object.name)}</h3>
        <div class="asset-form-note">Furniture selection · shared asset</div>
        <label>Name<input value="${esc(asset?.name || object.name)}" readonly></label>
        <div class="form-row"><label>Width (in)<input value="${Math.round(asset?.w || object.w)}" readonly></label>
        <label>Depth (in)<input value="${Math.round(asset?.d || object.d)}" readonly></label></div>
        <label>Height (in)<input value="${Math.round(asset?.h || object.h || 0)}" readonly></label>
        <div class="asset-status">Legs, floor space, and collision belong to the shared asset definition.</div>
        <button class="asset-delete" id="removeSelectedFurniture">Remove from plan</button>
      </div>`;
      document.getElementById('removeSelectedFurniture').onclick = () => {
        checkpoint();
        state.objects = state.objects.filter(o => o.id !== object.id);
        state.selected = null;
        editorAssetId = null;
        render();
      };
      return;
    }
    baseRenderInspector();
  };

  const guide = document.getElementById('geometryGuide');
  const baseUpdateMode = updateMode;
  updateMode = () => {
    baseUpdateMode();
    if (guide && state.mode === 'select') {
      guide.innerHTML = '<strong>Select (Q)</strong><b>Click</b> a furniture object to inspect it.<br><b>Drag</b> furniture to move it.<br><b>Right-drag</b> inside furniture to rotate 90°.';
    }
  };

  const clearPreview = () => {
    const preview = document.querySelector('.drag-preview');
    if (preview) preview.style.display = 'none';
  };
  document.addEventListener('dragend', clearPreview, true);
  document.addEventListener('drop', clearPreview, true);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') clearPreview();
  }, true);
  window.addEventListener('blur', clearPreview);

  render();
});

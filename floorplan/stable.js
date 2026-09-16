/* Final interaction contract. This is the only layer allowed to change mode
   or expose furniture selection outside the legacy prototype handlers. */
queueMicrotask(() => {
  if (window.__planformSavedState) {
    try {
      const saved = JSON.parse(window.__planformSavedState);
      const savedObjects = new Map((saved.objects || []).map(object => [object.id, object]));
      state.objects.forEach(object => {
        const savedObject = savedObjects.get(object.id);
        if (!savedObject) return;
        object.x = savedObject.x;
        object.y = savedObject.y;
        object.rot = savedObject.rot || 0;
      });
    } catch {}
  }
  const inspector = document.getElementById('inspector');
  const modeButtons = [...document.querySelectorAll('.mode')];

  const selectedObject = () => state.objects.find(o => o.id === state.selected);
  const edgeJoins = (a, b) => state.edges.some(edge =>
    (edge.a === a && edge.b === b) || (edge.a === b && edge.b === a)
  );
  const areaStatus = area => {
    const nodes = Array.isArray(area?.nodes) ? area.nodes : [];
    const missingNodes = nodes.filter(id => !state.nodes.some(node => node.id === id));
    const missingEdges = nodes.length < 3 || nodes.some((id, index) =>
      !edgeJoins(id, nodes[(index + 1) % nodes.length])
    );
    return { orphaned: missingNodes.length > 0 || missingEdges, nodes };
  };
  const selectAreaLabel = area => {
    const status = areaStatus(area);
    state.areaSelection = { area, nodes: status.nodes };
    state.areaCandidates = null;
    state.labelError = null;
    state.labelCandidate = status.nodes;
    state.selected = null;
    render();
  };
  const renderAreaLabelBrowser = () => {
    if (state.mode !== 'label' || state.areaSelection || state.areaCandidates?.length || state.labelError) return;
    inspector.innerHTML = `<div class="inspector-head">
      <div class="eyebrow">Label area</div>
      <h2>Area labels</h2>
      <span class="sub">Select a saved label to edit it</span>
    </div><div class="area-label-browser"></div>`;
    const browser = inspector.querySelector('.area-label-browser');
    if (!state.areas.length) {
      browser.innerHTML = '<div class="empty-label-list">No area labels yet. Click inside a closed area to add one.</div>';
      return;
    }
    state.areas.forEach(area => {
      const status = areaStatus(area);
      const row = document.createElement('div');
      row.className = `area-label-row${status.orphaned ? ' orphaned' : ''}`;
      const select = document.createElement('button');
      select.type = 'button';
      select.className = 'area-label-select';
      select.innerHTML = `<strong></strong><small></small>`;
      select.querySelector('strong').textContent = area.name || 'Unnamed area';
      select.querySelector('small').textContent = status.orphaned ? 'Boundary no longer resolves' : 'Saved closed area';
      select.onclick = () => selectAreaLabel(area);
      row.append(select);
      if (status.orphaned) {
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'area-label-delete';
        remove.textContent = 'Delete';
        remove.title = 'Delete orphaned label';
        remove.onclick = event => {
          event.stopPropagation();
          checkpoint();
          state.areas = state.areas.filter(item => item.id !== area.id);
          render();
        };
        row.append(remove);
      }
      browser.append(row);
    });
  };
  const footprintMetrics = object => {
    const quarterTurn = Math.abs(((Number(object.rot) || 0) % 180) - 90) < 1;
    const width = quarterTurn ? object.d : object.w;
    const depth = quarterTurn ? object.w : object.d;
    return {
      width,
      depth,
      offsetX: (object.w - width) / 2,
      offsetY: (object.d - depth) / 2
    };
  };
  const alignObjectEdges = object => {
    const metrics = footprintMetrics(object);
    const left = Math.round((Number(object.x) || 0) + metrics.offsetX);
    const top = Math.round((Number(object.y) || 0) + metrics.offsetY);
    object.x = left - metrics.offsetX;
    object.y = top - metrics.offsetY;
  };

  const syncModeUi = () => {
    modeButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.mode === state.mode);
      button.setAttribute('aria-pressed', button.dataset.mode === state.mode ? 'true' : 'false');
    });
  };

  const setMode = mode => {
    if (!['select', 'geometry', 'label'].includes(mode)) return;
    const previousMode = state.mode;
    state.mode = mode;
    state.edgeDraft = null;
    state.measureStart = null;
    state.areaCandidates = null;
    state.labelError = null;
    state.labelCandidate = null;
    if (mode !== 'label' || previousMode !== 'label') state.areaSelection = null;
    if (mode !== 'select' || !selectedObject()) state.selected = null;
    render();
    syncModeUi();
  };

  const baseInspector = renderInspector;
  renderInspector = () => {
    if (state.mode !== 'select' && selectedObject()) {
      state.selected = null;
      inspector.innerHTML = '<div class="placeholder"><span class="placeholder-icon">＋</span><strong>Geometry mode active</strong><span>Furniture selection is available in Select mode.</span></div>';
      return;
    }
    baseInspector();
    renderAreaLabelBrowser();
  };

  inspector.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || state.mode !== 'label' || !event.target.matches('input')) return;
    const save = inspector.querySelector('#saveAreaLabel, #saveAreaName, .area-form-button');
    if (save) {
      event.preventDefault();
      save.click();
    }
  });

  let rotatingObjectId = null;
  const baseRenderObjects = renderObjects;
  renderObjects = () => {
    state.objects.forEach(object => {
      object.w = Math.max(1, Math.round(Number(object.w) || 1));
      object.d = Math.max(1, Math.round(Number(object.d) || 1));
      alignObjectEdges(object);
    });
    baseRenderObjects();
    const all = [...state.builtins.map(o => ({ ...o, builtin: true })), ...state.objects];
    objectLayer.querySelectorAll('g').forEach((group, index) => {
      const object = all[index];
      const label = group.querySelector('.asset-label, .builtin-label');
      if (object && label) label.setAttribute('transform', `rotate(${-(Number(object.rot) || 0)} ${object.w / 2} ${object.d / 2})`);
    });
    const object = state.objects.find(o => o.id === rotatingObjectId);
    if (!object) return;
    const cx = object.x + object.w / 2;
    const cy = object.y + object.d / 2;
    uiLayer.append(el('circle', { cx, cy, r: 3.2, class: 'rotation-center' }));
    uiLayer.append(el('line', { x1: cx - 5, y1: cy, x2: cx + 5, y2: cy, class: 'rotation-center-cross' }));
    uiLayer.append(el('line', { x1: cx, y1: cy - 5, x2: cx, y2: cy + 5, class: 'rotation-center-cross' }));
  };

  objectDown = (event, object) => {
    event.stopImmediatePropagation();
    if (state.mode !== 'select' || !object || object.locked) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    state.selected = object.id;
    const start = screenPoint(event);
    const gridStart = snap(start);
    const originX = Number(object.x) || 0;
    const originY = Number(object.y) || 0;
    object.x = originX;
    object.y = originY;
    let checkpointed = false;

    if (event.button === 2) {
      rotatingObjectId = object.id;
      const center = { x: object.x + object.w / 2, y: object.y + object.d / 2 };
      const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
      const startRotation = ((object.rot || 0) % 360 + 360) % 360;

      try { svg.setPointerCapture(event.pointerId); } catch {}
      const move = moveEvent => {
        const current = screenPoint(moveEvent);
        const currentAngle = Math.atan2(current.y - center.y, current.x - center.x);
        let delta = (currentAngle - startAngle) * 180 / Math.PI;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        const rotation = (startRotation + Math.round(delta / 90) * 90 + 360) % 360;
        if (rotation === (object.rot || 0)) return;
        if (!checkpointed) {
          checkpoint();
          checkpointed = true;
        }
        object.rot = rotation;
        renderObjects();
        renderInspector();
      };
      const finish = () => {
        try { svg.releasePointerCapture(event.pointerId); } catch {}
        svg.removeEventListener('pointermove', move);
        svg.removeEventListener('pointerup', finish);
        svg.removeEventListener('pointercancel', finish);
        rotatingObjectId = null;
        object.rot = ((object.rot || 0) % 360 + 360) % 360;
        render();
      };
      svg.addEventListener('pointermove', move);
      svg.addEventListener('pointerup', finish);
      svg.addEventListener('pointercancel', finish);
      render();
      return;
    }

    if (event.button !== 0) return;
    try { svg.setPointerCapture(event.pointerId); } catch {}
    const move = moveEvent => {
      const current = snap(screenPoint(moveEvent));
      const nextX = originX + current.x - gridStart.x;
      const nextY = originY + current.y - gridStart.y;
      if (nextX === object.x && nextY === object.y) return;
      if (!checkpointed) {
        checkpoint();
        checkpointed = true;
      }
      object.x = nextX;
      object.y = nextY;
      renderObjects();
      updateCursor(moveEvent);
    };
    const finish = () => {
      try { svg.releasePointerCapture(event.pointerId); } catch {}
      svg.removeEventListener('pointermove', move);
      svg.removeEventListener('pointerup', finish);
      svg.removeEventListener('pointercancel', finish);
      render();
    };
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerup', finish);
    svg.addEventListener('pointercancel', finish);
    render();
  };

  const baseRender = render;
  render = () => {
    baseRender();
    syncModeUi();
  };

  svg.addEventListener('drop', event => {
    const assetId = event.dataTransfer?.getData('planform-asset');
    if (!assetId) return;
    const asset = state.assets.find(item => item.id === assetId);
    if (!asset) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const pointer = snap(screenPoint(event));
    const width = Math.max(1, Math.round(Number(asset.w) || 1));
    const depth = Math.max(1, Math.round(Number(asset.d) || 1));
    checkpoint();
    const object = {
      ...asset,
      w: width,
      d: depth,
      id: `${asset.id}-${Date.now()}`,
      assetId: asset.id,
      x: 0,
      y: 0
    };
    const metrics = footprintMetrics(object);
    object.x = Math.round(pointer.x - metrics.width / 2) - metrics.offsetX;
    object.y = Math.round(pointer.y - metrics.depth / 2) - metrics.offsetY;
    state.objects.push(object);
    state.selected = object.id;
    render();
  }, true);

  document.addEventListener('click', event => {
    const button = event.target.closest('.mode');
    if (!button || button.disabled) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    setMode(button.dataset.mode);
  }, true);

  document.addEventListener('keydown', event => {
    if (event.target?.matches('input, textarea, select')) return;
    const key = event.key.toLowerCase();
    if (!['q', 'w', 'e'].includes(key)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    setMode(key === 'q' ? 'select' : key === 'w' ? 'geometry' : 'label');
  }, true);

  syncModeUi();
  render();
  window.planformPersist?.();
});

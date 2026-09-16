/* Collision visualization and vertical-clearance metadata. */
queueMicrotask(() => {
  const clearanceLayer = document.getElementById('clearanceLayer');
  const positive = value => Number.isFinite(Number(value)) && Number(value) > 0;
  const heightOf = object => Math.max(0, Number(object.h) || 0);
  const footprint = object => {
    const quarterTurn = Math.abs(((object.rot || 0) % 180) - 90) < 1;
    if (quarterTurn) {
      const cx = object.x + object.w / 2;
      const cy = object.y + object.d / 2;
      const w = object.d / 2;
      const d = object.w / 2;
      return [
        { x: cx - w, y: cy - d },
        { x: cx + w, y: cy - d },
        { x: cx + w, y: cy + d },
        { x: cx - w, y: cy + d }
      ];
    }
    return [
      { x: object.x, y: object.y },
      { x: object.x + object.w, y: object.y },
      { x: object.x + object.w, y: object.y + object.d },
      { x: object.x, y: object.y + object.d }
    ];
  };
  const pointOnSegment = (p, a, b) => {
    const cross = (p.y - a.y) * (b.x - a.x) - (p.x - a.x) * (b.y - a.y);
    if (Math.abs(cross) > 0.001) return false;
    return p.x >= Math.min(a.x, b.x) - 0.001 && p.x <= Math.max(a.x, b.x) + 0.001 &&
      p.y >= Math.min(a.y, b.y) - 0.001 && p.y <= Math.max(a.y, b.y) + 0.001;
  };
  const orientation = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const segmentsCross = (a, b, c, d) => {
    const ab1 = orientation(a, b, c), ab2 = orientation(a, b, d);
    const cd1 = orientation(c, d, a), cd2 = orientation(c, d, b);
    if (Math.abs(ab1) < 0.001 && pointOnSegment(c, a, b)) return true;
    if (Math.abs(ab2) < 0.001 && pointOnSegment(d, a, b)) return true;
    if (Math.abs(cd1) < 0.001 && pointOnSegment(a, c, d)) return true;
    if (Math.abs(cd2) < 0.001 && pointOnSegment(b, c, d)) return true;
    return (ab1 > 0) !== (ab2 > 0) && (cd1 > 0) !== (cd2 > 0);
  };
  const segmentsStrictlyCross = (a, b, c, d) => {
    const ab1 = orientation(a, b, c), ab2 = orientation(a, b, d);
    const cd1 = orientation(c, d, a), cd2 = orientation(c, d, b);
    return ((ab1 > 0.001 && ab2 < -0.001) || (ab1 < -0.001 && ab2 > 0.001)) &&
      ((cd1 > 0.001 && cd2 < -0.001) || (cd1 < -0.001 && cd2 > 0.001));
  };
  const inside = (p, polygon) => {
    let hit = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[i], b = polygon[j];
      if (((a.y > p.y) !== (b.y > p.y)) && p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) hit = !hit;
    }
    return hit;
  };
  const polygonsOverlap = (a, b) => {
    for (let i = 0; i < a.length; i++) {
      const a1 = a[i], a2 = a[(i + 1) % a.length];
      for (let j = 0; j < b.length; j++) {
        if (segmentsCross(a1, a2, b[j], b[(j + 1) % b.length])) return true;
      }
    }
    return inside(a[0], b) || inside(b[0], a);
  };
  const polygonsIntrude = (a, b) => {
    for (let i = 0; i < a.length; i++) {
      const a1 = a[i], a2 = a[(i + 1) % a.length];
      for (let j = 0; j < b.length; j++) {
        if (segmentsStrictlyCross(a1, a2, b[j], b[(j + 1) % b.length])) return true;
      }
    }
    return inside(a[0], b) || inside(b[0], a);
  };
  const edgePairMatches = (edge, a, b) =>
    (edge.a === a && edge.b === b) || (edge.a === b && edge.b === a);
  const clearanceForEdge = edge => {
    let clearance = positive(edge.clearance) ? Number(edge.clearance) : 0;
    state.areas.filter(area => positive(area.clearance) && Array.isArray(area.nodes)).forEach(area => {
      for (let i = 0; i < area.nodes.length; i++) {
        const a = area.nodes[i], b = area.nodes[(i + 1) % area.nodes.length];
        if (edgePairMatches(edge, a, b)) clearance = Math.max(clearance, Number(area.clearance));
      }
    });
    return clearance;
  };
  const areaEdges = area => state.edges.filter(edge => {
    for (let i = 0; i < area.nodes.length; i++) {
      if (edgePairMatches(edge, area.nodes[i], area.nodes[(i + 1) % area.nodes.length])) return true;
    }
    return false;
  });
  const areaPolygon = area => area.nodes.map(point).filter(Boolean);
  const clearanceAreas = () => state.areas.filter(area => positive(area.clearance) && areaPolygon(area).length >= 3);
  const areaContainsEdge = (area, edge) => {
    for (let i = 0; i < area.nodes.length; i++) {
      if (edgePairMatches(edge, area.nodes[i], area.nodes[(i + 1) % area.nodes.length])) return true;
    }
    return false;
  };
  const edgeUnderClearance = edge => {
    const a = point(edge.a), b = point(edge.b);
    if (!a || !b) return false;
    return clearanceAreas().some(area => {
      if (areaContainsEdge(area, edge)) return false;
      const polygon = areaPolygon(area);
      if (!inside(a, polygon) || !inside(b, polygon)) return false;
      return !polygon.some((p, i) => segmentsCross(a, b, p, polygon[(i + 1) % polygon.length]));
    });
  };
  const objectUnderClearance = object => {
    if (object.floor === false) return false;
    const poly = footprint(object);
    return clearanceAreas().some(area => {
      if (heightOf(object) > Number(area.clearance)) return false;
      return polygonsOverlap(poly, areaPolygon(area));
    });
  };
  const renderClearanceLayer = (collisions = { edgeIds: new Set() }) => {
    if (!clearanceLayer) return;
    clearanceLayer.innerHTML = '';
    const areas = clearanceAreas();
    const defs = document.querySelector('#plan defs');
    defs?.querySelectorAll('[data-clearance-clip]').forEach(clip => clip.remove());
    areas.forEach(area => {
      const polygon = areaPolygon(area);
      clearanceLayer.append(el('polygon', {
        points: polygon.map(p => `${p.x},${p.y}`).join(' '),
        class: 'clearance-surface',
        'data-clearance': Math.round(Number(area.clearance))
      }));
    });
    let clipIndex = 0;
    state.objects.filter(objectUnderClearance).forEach(object => {
      const objectPolygon = footprint(object);
      areas.forEach(area => {
        if (heightOf(object) > Number(area.clearance) || !polygonsOverlap(objectPolygon, areaPolygon(area))) return;
        const clipId = `clearance-under-${Date.now()}-${clipIndex++}`;
        const clip = el('clipPath', { id: clipId, 'clipPathUnits': 'userSpaceOnUse', 'data-clearance-clip': 'true' });
        clip.append(el('polygon', { points: objectPolygon.map(p => `${p.x},${p.y}`).join(' ') }));
        defs?.append(clip);
        clearanceLayer.append(el('polygon', {
          points: areaPolygon(area).map(p => `${p.x},${p.y}`).join(' '),
          class: 'clearance-under-furniture',
          'clip-path': `url(#${clipId})`
        }));
      });
    });
    state.edges.forEach(edge => {
      if (!collisions.edgeIds.has(edge.id)) return;
      const a = point(edge.a), b = point(edge.b);
      if (!a || !b) return;
      clearanceLayer.append(el('line', {
        x1: a.x, y1: a.y, x2: b.x, y2: b.y,
        class: 'collision-edge-overlay'
      }));
    });
  };

  const computeCollisions = () => {
    const edgeIds = new Set();
    const objectIds = new Set();
    const objects = state.objects.filter(object => object.floor !== false && object.collision !== false);

    objects.forEach(object => {
      const poly = footprint(object);
      const height = heightOf(object);
      state.edges.forEach(edge => {
        const a = point(edge.a), b = point(edge.b);
        if (!a || !b || height <= clearanceForEdge(edge)) return;
        if (poly.some((p, i) => segmentsStrictlyCross(p, poly[(i + 1) % poly.length], a, b)) || inside(a, poly) || inside(b, poly)) {
          objectIds.add(object.id);
          edgeIds.add(edge.id);
        }
      });

      state.areas.filter(area => positive(area.clearance) && height > Number(area.clearance)).forEach(area => {
        const areaPoints = areaPolygon(area);
        if (areaPoints.length >= 3 && polygonsIntrude(poly, areaPoints)) {
          objectIds.add(object.id);
          areaEdges(area).forEach(edge => edgeIds.add(edge.id));
        }
      });
    });

    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        if (polygonsIntrude(footprint(objects[i]), footprint(objects[j]))) {
          objectIds.add(objects[i].id);
          objectIds.add(objects[j].id);
        }
      }
    }
    return { edgeIds, objectIds };
  };

  const applyEdgeCollisions = collisions => {
    roomLayer.querySelectorAll('.room-edge').forEach((line, index) => {
      const edge = state.edges[index];
      if (!edge) return;
      const edgeType = edge.type || 'wall';
      line.classList.toggle('collision-edge', collisions.edgeIds.has(edge.id));
      line.classList.toggle('doorway-edge', edgeType === 'doorway');
      line.classList.toggle('sliding-door-edge', edgeType === 'sliding-door');
      line.classList.toggle('sliding-door-part-edge', edgeType === 'sliding-door-part');
      line.dataset.edgeType = edgeType;
      line.classList.toggle('hidden-edge', Boolean(edge.hidden));
      const clearanceBoundary = clearanceAreas().some(area => areaContainsEdge(area, edge));
      line.classList.toggle('clearance-boundary', clearanceBoundary && !edge.hidden);
      line.classList.toggle('clearance-edge', !clearanceBoundary && (positive(edge.clearance) || edgeUnderClearance(edge)));
    });
  };

  const baseGeometry = renderGeometry;
  renderGeometry = () => {
    baseGeometry();
    const collisions = computeCollisions();
    renderClearanceLayer(collisions);
    applyEdgeCollisions(collisions);
  };

  const applyObjectCollisions = collisions => {
    const all = [...state.builtins.map(object => ({ ...object, builtin: true })), ...state.objects];
    objectLayer.querySelectorAll('g').forEach((group, index) => {
      const object = all[index];
      const shape = group.querySelector('.asset-shape');
      if (!shape || !object) return;
      const colliding = collisions.objectIds.has(object.id);
      shape.classList.toggle('collision-furniture', colliding);
      shape.dataset.collision = colliding ? 'true' : 'false';
      shape.style.opacity = colliding ? '.38' : '';
      shape.style.fill = colliding ? '#efaaa0' : '';
      shape.style.stroke = colliding ? '#c8564b' : '';
    });
  };

  const baseObjects = renderObjects;
  renderObjects = () => {
    baseObjects();
    const collisions = computeCollisions();
    renderClearanceLayer(collisions);
    applyEdgeCollisions(collisions);
    applyObjectCollisions(collisions);
  };

  let collisionFrame = 0;
  const refreshLiveCollisions = () => {
    collisionFrame = 0;
    const collisions = computeCollisions();
    renderClearanceLayer(collisions);
    applyEdgeCollisions(collisions);
    applyObjectCollisions(collisions);
  };
  const scheduleLiveCollisionRefresh = () => {
    if (collisionFrame) return;
    collisionFrame = requestAnimationFrame(refreshLiveCollisions);
  };
  svg.addEventListener('pointermove', scheduleLiveCollisionRefresh);
  svg.addEventListener('pointerup', scheduleLiveCollisionRefresh);
  svg.addEventListener('pointercancel', scheduleLiveCollisionRefresh);

  const appendEdgeEditor = () => {
    if (state.mode !== 'geometry') return;
    const edge = state.edges.find(item => item.id === state.selected);
    if (!edge) return;
    const panel = document.createElement('div');
    panel.className = 'clearance-editor';
    panel.innerHTML = `<div class="eyebrow">Edge properties</div>
      <label>Edge type<select id="edgeType">
        <option value="wall" ${edge.type === 'doorway' || edge.type === 'sliding-door' || edge.type === 'sliding-door-part' ? '' : 'selected'}>Wall</option>
        <option value="doorway" ${edge.type === 'doorway' ? 'selected' : ''}>Doorway</option>
        <option value="sliding-door" ${edge.type === 'sliding-door' ? 'selected' : ''}>Sliding door</option>
        <option value="sliding-door-part" ${edge.type === 'sliding-door-part' ? 'selected' : ''}>Sliding-door part</option>
      </select></label>
      <div class="asset-form-note">One type per edge. The edge color shows the opening or door hardware on the plan.</div>
      <div class="eyebrow edge-clearance-heading">Clearance</div>
      <label>Clearance height (in)<input id="edgeClearance" type="number" min="0" step="1" value="${positive(edge.clearance) ? Math.round(edge.clearance) : ''}" placeholder="None"></label>
      <label class="check"><input id="edgeHidden" type="checkbox" ${edge.hidden ? 'checked' : ''}>Hidden / overhead edge</label>
      <div class="asset-form-note">Objects at or below this height may pass through. Enter a positive value, then press Enter or click elsewhere to save.</div>`;
    document.getElementById('inspector').innerHTML = `<div class="inspector-head">
      <div class="eyebrow">Inspector</div>
      <h2>Edge properties</h2>
      <span class="sub">independent geometry</span>
    </div>`;
    document.getElementById('inspector').append(panel);
    panel.querySelector('#edgeType').onchange = event => {
      checkpoint();
      edge.type = event.target.value;
      render();
    };
    const saveClearance = event => {
      checkpoint();
      const value = Number(event.target.value);
      edge.clearance = positive(value) ? Math.round(value) : null;
      render();
    };
    panel.querySelector('#edgeClearance').onchange = saveClearance;
    panel.querySelector('#edgeClearance').onkeydown = event => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      event.target.blur();
    };
    panel.querySelector('#edgeHidden').onchange = event => {
      checkpoint();
      edge.hidden = event.target.checked;
      render();
    };
    document.getElementById('inspector').append(panel);
  };

  const appendAreaEditor = () => {
    if (state.mode !== 'label' || !state.areaSelection?.area) return;
    const area = state.areaSelection.area;
    const panel = document.createElement('div');
    panel.className = 'clearance-editor';
    panel.innerHTML = `<div class="eyebrow">Area clearance</div>
      <label>Clearance height (in)<input id="areaClearance" type="number" min="0" step="1" value="${positive(area.clearance) ? Math.round(area.clearance) : ''}" placeholder="None"></label>
      <div class="asset-form-note">This labeled area is overhead space. Furniture at or below this height may occupy it.</div>`;
    panel.querySelector('#areaClearance').onchange = event => {
      checkpoint();
      const value = Number(event.target.value);
      area.clearance = positive(value) ? Math.round(value) : null;
      render();
    };
    document.getElementById('inspector').append(panel);
  };

  const baseInspector = renderInspector;
  renderInspector = () => {
    baseInspector();
    const placeholder = document.querySelector('#inspector .placeholder');
    if (placeholder) {
      const heading = placeholder.querySelector('strong');
      const note = placeholder.querySelector('span:not(.placeholder-icon)');
      if (heading) heading.textContent = 'Inspector';
      if (note) note.textContent = 'Select an object or geometry to view its properties.';
    }
    appendEdgeEditor();
    appendAreaEditor();
  };

  roomLayer.addEventListener('click', event => {
    if (state.mode !== 'geometry' || !event.target?.classList?.contains('room-edge')) return;
    const index = [...roomLayer.querySelectorAll('.room-edge')].indexOf(event.target);
    const edge = state.edges[index];
    if (!edge) return;
    event.preventDefault();
    event.stopPropagation();
    state.selected = edge.id;
    render();
  }, true);

  render();
});

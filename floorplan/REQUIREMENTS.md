# Floorplan Tool — Product Requirements

Status: requirements reset / pre-implementation
Last updated: 2026-09-15

## Product goal

Create a browser-based floor-planning tool for accurately modeling a real room, its built-in structures, and movable furniture. The tool should make it easy to measure and revise a space without requiring CAD expertise.

The primary experience is a precise 2D plan. Height and vertical-clearance information should be captured in the data model from the beginning so a future 3D or vertical-clearance view can be added without redesigning the core model.

## Core concepts

The plan is made of three related layers:

1. **Room geometry** — user-defined nodes and explicitly user-defined edges. Nodes may exist without edges; the geometry is not required to be a polygon, convex shape, or continuous loop.
2. **Named areas** — user-labeled closed regions created from existing edges, such as kitchen counters, closets, walls, columns, radiators, and AC units. They are semantic labels, not a separate locked object category.
3. **Movable assets** — reusable, named objects such as tables, couches, chairs, beds, and appliances. Instances can be placed, rotated, resized where permitted, and moved around the room.

The visual plan should distinguish these layers, but they should share the same measurement system and geometric primitives.

## Scale and measurement requirements

- The plan must use a precise internal coordinate system, not screen pixels.
- Inches are the canonical unit and the default unit throughout the application.
- Every dimension input should be a plain numeric value representing inches. A value of `148` means 148 inches.
- Dimension inputs should not require unit suffixes, feet symbols, or mixed-format parsing.
- Internally, normalize lengths to precise inches, using decimal or fractional precision sufficient for the intended measurements.
- The user may toggle an optional display mode that formats inch values as feet plus inches, such as `148 in` → `12′ 4″`.
- Feet-plus-inches is a presentation convenience only; it is not the primary editing mode or underlying unit.
- Metric units can be added later, but the initial model should not prevent them.
- Display dimensions consistently according to the active display toggle: plain inches by default, feet-plus-inches when enabled.
- A visible scale indicator must always be present on the plan. It should include:
  - a graphic scale bar;
  - the current zoom percentage or equivalent;
  - the relationship between grid spacing and real-world inches.
- Zooming must not change measurements. The scale bar and labels should update as the view zooms.
- Dimension labels should be available for room edges and selected objects. Labels should show the measured length of the relevant geometry.
- The user should be able to toggle grid visibility, grid spacing, and snap-to-grid behavior.

## Room setup and geometry

- A room is not limited to width and depth.
- Room geometry must be an editable graph of independent nodes and explicit edges.
- Adding a node must not create, delete, or reshape any existing edge or other geometry.
- The user must be able to draw an edge between any two chosen nodes, including edges that overlap, cross, or form disconnected groups.
- The geometry must not be limited to a polygon, convex outline, or continuous boundary.
- The user must be able to maintain disconnected geometry and overlapping built-in regions in the same plan.
- Any closed edge loop should be nameable as a semantic area from the editor. Naming an area must not change its underlying nodes or edges.
- Named areas should render with a distinct, lighter fill/line treatment so they are visually separate from ordinary geometry.
- Built-in structures can jut into or out of the main room footprint. Examples include:
  - kitchen counters;
  - closets;
  - door recesses;
  - alcoves;
  - wall bump-outs;
  - columns;
  - HVAC or radiator enclosures.
- These structures should be representable as geometry belonging to the room setup, rather than forcing the entire room into one simplistic polygon.
- The model should distinguish between:
  - **walkable/usable floor area**;
  - **solid room boundary or wall geometry**;
  - **built-in occupied geometry** that cannot be moved;
  - optional non-floor geometry above or below the floor plane.
- Editing the room should work directly on the plan using visible vertices and connecting edges/regions.
- The user should be able to:
  - add a vertex;
  - move a vertex;
  - delete a vertex;
  - split an edge;
  - merge or close a loop;
  - move an entire built-in region;
  - edit a selected edge's exact length;
  - edit an angle or constrain it.
- The editor should support helpful geometry constraints without making freeform drawing frustrating:
  - snap to grid;
  - horizontal/vertical or 90-degree constraint;
  - optionally 45-degree constraint;
  - endpoint snapping;
  - alignment guides;
  - inferred parallel/perpendicular relationships;
  - numeric entry after drawing a segment.
- Snapping is always enabled at a 1-inch increment for this prototype. The UI should show that increment, but should not expose a confusing snap toggle.
- The UI should make it clear whether the user is editing the room shell, a built-in region, or a movable asset.
- Geometry editing should use one coherent Edit Geometry mode rather than separate add-node and connect-node commands.
- In Edit Geometry mode:
  - double-clicking blank canvas creates an independent node;
  - left-click-dragging a node moves it;
  - right-click-dragging from one node to another creates an edge;
  - releasing a drag must reliably complete the operation through pointer capture, even if the pointer leaves the node.
- Edges must be selectable and deletable independently of their endpoint nodes.
- Built-in elements must be removable from the current plan, even though they are locked against ordinary movement.
- The current plan, including nodes, edges, objects, built-ins, assets, and view state, should persist locally and restore on reload.
- The active geometry mode should show concise gesture guidance in the interface.
- Selected nodes should expose their X/Y coordinates in inches. With snapping enabled, coordinates should be integer inches.
- Snapped dragging must snap both the drag origin and destination; it must never introduce a hidden fractional offset that is merely rounded for display.
- Furniture dragging must use integer world coordinates throughout the gesture, so collision previews cannot differ from the released placement by one inch.
- The canvas should visibly communicate the current snap increment and cursor coordinates.

## Geometry primitives

The underlying model should not assume that every thing is just a rectangle or that lines alone are the right primitive.

Recommended model:

- **Vertex**: a precise 2D point in world units.
- **Edge**: a connected segment between vertices, with optional constraints and dimension metadata.
- **Region**: an optional closed loop of edges/vertices representing an area; regions are not required for every piece of geometry.
- **Shape**: one or more regions and/or edges, with a transform and semantic metadata.

This supports rectangles, polygons, stepped outlines, open line features, and future curved geometry without making the first version depend on curves.

## Fixed geometry and areas

- There is no separate built-in element catalog in the current workflow.
- Counters, closets, wall projections, and other permanent features are represented by the same independent nodes and explicit edges as the rest of the plan.
- Closed regions may be given an area label, but labels must not change the underlying geometry.

## Asset library and movable objects

- The left rail is dedicated to the asset library. It should not duplicate the furniture editor or add an unrelated “Objects” section above the library.
- The right rail is the single furniture/asset editor and should use the same form language whether editing a library definition or a selected placed instance.
- The library itself is primarily a drag source. Clicking an asset is reserved for opening its definition in the right editor; it must not place an instance.
- “New asset” should be a compact library-row-style action rather than a large separate control or creation modal.
- The asset library header should remain visually prominent, with the compact New asset action directly underneath it.
- The user should be able to create a reusable asset from scratch.
- An asset should have:
  - a name;
  - a category;
  - one or more editable 2D shapes;
  - default dimensions;
  - optional min/max dimensions or locked dimensions;
  - rotation/orientation;
  - height and elevation information;
  - floor-space and collision settings.
- Default asset rendering should use rectangular footprints with a 1-inch corner radius; tables should not render as capsules or circles by default.
- The asset library starts empty; no sample or built-in assets should be inserted automatically.
- Creating an asset should happen directly in the left-side asset editor rather than requiring a separate creation modal.
- The asset editor uses a generic heading such as “Furniture asset”; the asset's name appears once in its Name field and is not repeated as the panel heading.
- The placed-furniture inspector should use the same visual language and field layout as the left asset editor, rather than introducing a separate card style.
- The right rail is a generic Inspector area. It must not present a misleading “Select geometry” panel above a second, unrelated properties panel; the selected item’s properties should occupy the Inspector directly.
- Pressing Enter in an asset editor input should save the current asset or furniture instance.
- Assets in the library must be explicitly dragged onto the plan to create an instance. Clicking a library item edits its definition; it must not silently place an object.
- A visible drag preview should follow the pointer while an asset is being dragged from the library.
- The drag preview must disappear on successful drop, canceled drag, Escape, window blur, or any other drag termination.
- Users can delete both library asset definitions and placed furniture instances. Deleting an asset definition also removes its placed instances after confirmation or through the explicit delete action.
- Placing an asset creates an instance linked to the asset definition, with the option to override permitted properties.
- Asset-instance properties such as legs/supports, floor-space behavior, collision footprint, and dimensions are inherited from the shared asset definition. Editing the definition updates its instances; instances do not expose independent copies of those controls.
- Saving a shared asset definition must immediately refresh every asset-library card and every linked placed instance; no mode switch or reload should be required.
- Saving an asset must persist the post-edit state immediately; a later movement or unrelated action must never be required to commit a rename or other asset change.
- Every explicit asset save action must use the same post-save commit boundary: re-render the current state, refresh the left asset cards, persist the complete plan, and provide saved feedback.
- A selected furniture instance should show its collision footprint automatically. Unselected furniture should not show collision footprints.
- In Select mode, right-dragging inside a selected or targeted furniture instance rotates it around its center in 90-degree increments. Its rendered footprint remains aligned to whole-inch grid lines.
- Furniture widths and depths remain whole-inch values, and movement uses whole-inch deltas. The rendered footprint edges—not the object center—must align to whole-inch grid lines; the local origin may be a half-inch when required by rotation or dimensions.
- Furniture movement must use whole-inch deltas only and must not magnetically snap to nearby edges. Dropped furniture should round its rendered footprint bounds to the inch grid.
- The visible canvas grid must use the same world-coordinate transform as geometry and furniture; a fixed screen-pixel background grid must not be used as the alignment reference.
- Furniture labels should remain upright on screen regardless of the furniture's rotation.
- Furniture leg markers should sit close to the asset corners and remain visually smaller than the main furniture outline.
- While rotating furniture, show a temporary center marker at the object's pivot; remove it when the gesture ends.
- Asset dimensions should be practical and editable. A table should not be an abstract generic rectangle only; it should have a specific size, shape, and optional corner geometry.

## Overlap, floor space, and collisions

- Visual overlap must be allowed. The editor should not automatically prevent one object from overlapping another.
- When a floor-occupying furniture object collides with a solid edge, clearance-enabled labeled area, or another colliding furniture object, its visual footprint should become translucent and visibly flagged.
- Mere contact with an edge or another furniture footprint is allowed; collision means geometric penetration, not shared-boundary contact.
- Any room/feature edge participating in a furniture collision should turn red so the blocking geometry is clear.
- Normal furniture should render with approximately 50% fill opacity and 75% edge opacity so dimension labels remain legible through it. Collision furniture may use a stronger warning treatment.
- Collision edges must be rendered in a top layer with an opaque red stroke so furniture translucency cannot obscure the blocking geometry.
- A clearance-enabled labeled area represents overhead geometry and must render above floor furniture without opaque occlusion. Furniture that fits beneath it remains visible through the translucent clearance surface, with the overlay limited to the overlapping portion.
- Edges fully contained inside a clearance area that are not part of that area's enclosing boundary should render dotted; merely touching or crossing the area does not qualify. Clearance-area boundary edges remain solid unless explicitly marked hidden.
- The user must be able to designate whether an element occupies floor space.
- The user must be able to designate whether an element is:
  - solid/impassable;
  - walkable/clearable;
  - overhead/non-floor;
  - decorative/non-colliding.
- Floor-space behavior and collision behavior are separate concepts. For example:
  - a tabletop occupies volume above the floor but may allow a chair to extend beneath it;
  - a counter may have a lower base that blocks the floor and an overhang that allows a stool or table to pass beneath it;
  - an AC unit may occupy wall space but not floor space;
  - a chair may have a collision footprint even if its visual back or arms extend beyond it.
- Objects should support a distinct collision footprint, which may be:
  - the visible shape;
  - a simplified polygon;
  - an editable set of corner points;
  - disabled.
- Collision footprints should be editable separately from the visual shape when useful.
- Collision checks should be advisory first: show warnings or highlights, but do not block placement by default.
- Collision highlighting must respect vertical clearance. An object whose height is at or below the applicable clearance is allowed to overlap that overhead edge/area.
- The tool should support vertical clearance rules in the model, including:
  - base elevation;
  - object height;
  - underside/overhang height;
  - clearance height;
  - whether an overlap is valid when objects occupy different vertical ranges.
- A future 3D/clearance view should use these values to explain why a table can pass under a counter for part of its depth.

## Clearance edges and overhead areas

- Every edge may be assigned one mutually exclusive type: wall, doorway, sliding door, or sliding-door part. The type persists with the edge and is editable from the edge Inspector in Edit Geometry mode.
- Doorways, sliding doors, and sliding-door parts use distinct visual treatments so they can be read directly on the plan. Collision red remains the higher-priority warning treatment when a typed edge is blocking furniture.
- A selected edge may have an optional clearance height in inches.
- A clearance-enabled labeled area may have an optional clearance height in inches.
- Clearance means that objects at or below that height may occupy or pass through the associated edge/area; taller objects collide.
- An edge may be marked hidden/overhead. Hidden edges remain real geometry for selection, collision, and editing, but render as subdued dashed guides rather than ordinary solid walls.
- A clearance edge or area should explain its rule in the inspector in plain language.
- The initial implementation may use a single height value per edge or labeled area; later versions can add base elevation and multiple vertical intervals.

## Area-label maintenance

- When Label area mode is active and no area is selected, the right Inspector should list every saved area label so the user can open one directly for editing.
- A saved area label is orphaned when its saved boundary no longer resolves to existing nodes and connecting edges. Orphaned labels should be visibly identified and offer a direct delete action.

## Interaction and viewport

- Smooth scroll-wheel zoom is required.
- The top bar should provide an Import clipboard action beside Export plan. It should accept the tool's exported JSON, validate it before mutation, import it as one undoable operation, and refresh the canvas, inspector, asset library, and local draft immediately.
- Zoom should be centered around the cursor position when possible.
- Wheel zoom must preserve the exact world coordinate under the cursor. Plus/minus zoom must preserve the center of the canvas.
- Pan should be available through right-click-and-drag, with middle mouse or space-drag as possible alternatives.
- The drawing surface should behave as an effectively infinite canvas; panning should not be limited to a fixed room-sized viewport.
- Room nodes and movable objects should snap in 1-inch increments by default.
- The plan should remain crisp and readable at different zoom levels.
- Selection should be obvious and support multi-select in a later iteration.
- The user should be able to undo and redo every geometry and placement operation.
- The app should autosave locally and provide explicit save/export/import behavior.
- Export should preserve exact geometry, dimensions, semantic types, asset definitions, and collision/clearance metadata.

## Suggested editing modes

The UI should have explicit modes rather than trying to infer every action from a click:

1. Select / move furniture
2. Edit geometry
3. Label area
4. Create or edit asset
5. Inspect collision and clearance

The current selected mode should always be visible. Escape should cancel the current drawing/editing operation.

## Interaction consistency contract

- There is exactly one active mode at a time, and the active mode button must update immediately on click and keyboard shortcut.
- Select mode is the only mode that selects, moves, rotates, or deletes furniture instances.
- Edit Geometry mode is reserved for nodes and edges. It must not show the legacy furniture inspector or mutate furniture transforms.
- Label Area mode is reserved for closed-area selection and labeling. It must not show the legacy furniture inspector or mutate furniture transforms.
- When an area-label input is focused, Enter performs the same action as Save label.
- Switching away from Select clears any furniture selection and its furniture inspector state.
- Selecting furniture must update the canvas highlight, the mode state, and the right inspector in the same interaction; it must not wait for a later mode switch.
- Furniture rotation is an internal 90-degree transform only. It should not be exposed as a current-rotation field or status readout in the inspector.
- The legacy movable-asset inspector is removed from all modes. The right inspector always uses the shared asset editor when a furniture instance or library asset is selected.
- Named areas are canonical state and must survive reloads, undo/redo checkpoints, mode switches, and asset-library interactions.
- Furniture labels are always screen-upright, independent of furniture rotation, selection, or inspector state.

## Coordinate invariants and resolved pitfalls

- The inch grid is authoritative. Furniture movement changes position only by whole-inch deltas.
- Snapping applies to the rendered footprint edges, not the furniture center. A local origin may be a half-inch when needed to put the visible edges on whole-inch grid lines.
- Render normalization must be idempotent: rendering or refreshing must never repeatedly move an already-aligned object.
- Reload/bootstrap code must not round furniture origins to integers before edge alignment, because that destroys intentional half-inch local origins and causes cumulative refresh drift.
- Touching geometry is not a collision. Collision highlighting requires geometric penetration.
- The visible grid must be in the same world-coordinate system as the rendered geometry; a fixed pixel background grid is not an alignment reference.

## Initial implementation scope

The first rebuilt version should focus on a strong 2D foundation:

1. Precise inch-based coordinate system with plain numeric inch inputs, optional feet-plus-inches display, and a visible scale bar.
2. Editable room graphs with independent node creation, explicit edge creation, 1-inch snapping, orthogonal constraints, and numeric edge dimensions.
3. Named areas layered over the independent geometry graph.
4. Movable, named assets with editable dimensions and transforms.
5. Explicit floor-space and collision-footprint settings.
6. Overlap allowed, with advisory collision highlighting.
7. Smooth cursor-centered zoom, pan, undo, redo, and local persistence.

Defer full 3D rendering until the 2D geometry, vertical metadata, and collision semantics are stable.

## Open decisions to resolve before implementation

- Should room walls have thickness as real geometry, or should the first version model only the inside face/usable floor boundary?
- Should door swings and window openings be first-class geometry or built-in asset types initially?
- Should dimensions be stored as exact fractions of an inch, decimal inches, or a fixed precision such as 1/16 inch?
- Should asset instances inherit later changes from their library definition, or be copied independently when placed?
- How should a user define partial-height or overhead geometry in the 2D editor: elevation fields only, or a dedicated vertical-clearance panel?
- Should collision warnings be shown continuously, only on selection, or through a separate validation mode?
- Is a plan intended to support one floor/level initially, with levels added later?

## Non-goals for the first rebuild

- Photorealistic 3D rendering.
- Automatic inference of a room from a photograph.
- Building-code validation.
- Contractor-grade CAD/BIM interchange.
- Automatic furniture recommendations.

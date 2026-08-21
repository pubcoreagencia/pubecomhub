# Plan: Prototype B Hub Design Sync

Align the Dashboard, Live Shop, Inventory, and Audience Engine with the Emerald Dark (OKLCH) design system from pub-ops-hub.

## User Review Required

> [!IMPORTANT]
> This will update the "estoque" and "audience engine" modules which were still using the light theme layout, bringing them into the Dark Hub aesthetic.

- Do you want any specific metrics for the "visitor by hour" or "orders by hour" charts?

## Proposed Changes

### UI & Aesthetics
- Apply `hub-card`, `hub-glass`, and `ShellB` layout to all missing modules.
- Convert all text labels to the high-fidelity `font-black uppercase tracking-widest` style.
- Use Emerald Green `oklch(69.6% .17 162.5)` for primary highlights.

### Dashboard Master
- Add "Sales by Store" ranking (already partially present, will enhance).
- Add "Sales by Channel" widget.
- Implement "Real-time Events" stream (Sales, Cart, Checkout).
- Add "Visitors by Hour" and "Orders by Hour" simulated charts.

### Live Shop
- Implement the "Real-time Event Feed" identical to the reference project.
- Enhance the "Visual Funnel Monitor" with live-simulated counters.

### Inventory (Estoque) & Audience Engine
- Reconstruct from the ground up using the Dark Hub layout.
- Replace light-theme cards with Dark Hub metrics and tables.

## Technical Details
- CSS: Reuse `src/prototype-b/styles/theme-b.css` and its sub-imports.
- Components: Use `CardMetric` and `HubTable` from `ui-b.tsx`.
- Data: All metrics will be simulated/mocked in `src/prototype-b/data/mock.ts` or directly in components for the prototype experience.

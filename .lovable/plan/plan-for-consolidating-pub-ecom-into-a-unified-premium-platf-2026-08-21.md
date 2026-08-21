# Plan for Consolidating PUB ECOM into a Unified Premium Platform

We will transform the current multi-prototype structure into a single, cohesive PUB ECOM platform based on the premium PUB Ops Hub aesthetic (Dark Hub/Emerald/OKLCH).

## Technical Details

- **Frontend Architecture**: Move from path-based prototypes (`/prototype-b`) to a root-level architecture.
- **Design System**: Consolidate global CSS using the OKLCH-based Emerald Dark theme from PUB Ops Hub.
- **Routing**: Restructure `src/routes` to eliminate redundancy and provide a direct entry into the dashboard or storefront.
- **Shared Logic**: Unify services, types, and mock data into single directories (`src/services`, `src/types`, `src/data`).
- **Cleanup**: Remove `src/prototype-b`, `src/routes/prototype-b`, and legacy dashboard files once successfully migrated.

## Proposed Changes

### 1. Global Styles & Theme
- Merge `src/prototype-b/styles/theme-b.css` and its imports into a new `src/styles/hub.css`.
- Update `src/styles.css` to import the new hub styles and set the base theme.

### 2. Core Layout & Shell
- Move `src/prototype-b/components/ShellB.tsx` to `src/components/layout/Shell.tsx` and update links to be relative to root (e.g., `/dashboard`).
- Update the root `__root.tsx` to include any necessary provider-level styles.

### 3. Route Restructuring
- Replace existing `src/routes/dashboard/*` with the high-fidelity versions currently in `src/routes/prototype-b/dashboard/*`.
- Replace `src/routes/store/*` with the versions in `src/routes/prototype-b/store/*`.
- Update `src/routes/index.tsx` to redirect to `/dashboard` or render the Landing Page directly.

### 4. Data & Services Consolidation
- Unify all mock data into `src/data/mock.ts`.
- Move services from `src/prototype-b/services/*` to `src/lib/services/*`.
- Standardize all types in `src/types/index.ts`.

### 5. Final Audit & Cleanup
- Verify all routes, links, and components.
- Delete `src/prototype-b` folder and legacy `src/routes/prototype-b` folder.
- Run typecheck and build validation.

# Plan: Final Audit & Structural Cleanup

Complete the structural consolidation of PUB ECOM by moving all inline dashboard route components to `src/pages/dashboard/` and standardizing their naming (removing 'B' suffixes).

## Proposed Changes

### 1. Extract and Rename Page Components
Move implementation from route files to new page files and remove "B" suffixes.

- `src/routes/dashboard/live.tsx` -> `src/pages/dashboard/LiveShopPage.tsx`
- `src/routes/dashboard/orders.tsx` -> `src/pages/dashboard/OrdersPage.tsx`
- `src/routes/dashboard/inventory.tsx` -> `src/pages/dashboard/InventoryPage.tsx`
- `src/routes/dashboard/audience.tsx` -> `src/pages/dashboard/AudiencePage.tsx`
- `src/routes/dashboard/products.tsx` -> `src/pages/dashboard/ProductsPage.tsx`
- `src/routes/dashboard/stores.tsx` -> `src/pages/dashboard/StoresPage.tsx`
- `src/routes/dashboard/suppliers.tsx` -> `src/pages/dashboard/SuppliersPage.tsx`
- `src/routes/dashboard/tracking.tsx` -> `src/pages/dashboard/TrackingPage.tsx`
- `src/routes/dashboard/marketing.tsx` -> `src/pages/dashboard/MarketingPage.tsx`
- `src/routes/dashboard/seo.tsx` -> `src/pages/dashboard/SEOPage.tsx`
- `src/routes/dashboard/affiliates.tsx` -> `src/pages/dashboard/AffiliatesPage.tsx`
- `src/routes/dashboard/influencers.tsx` -> `src/pages/dashboard/InfluencersPage.tsx`
- `src/routes/dashboard/ranking.tsx` -> `src/pages/dashboard/RankingPage.tsx`
- `src/routes/dashboard/bonifications.tsx` -> `src/pages/dashboard/BonificationsPage.tsx`
- `src/routes/dashboard/settings.tsx` -> `src/pages/dashboard/SettingsPage.tsx`

### 2. Update Route Files
Update `src/routes/dashboard/*.tsx` to import and render the new components from `src/pages/dashboard/`.

### 3. Verification
- Run `lovable-exec build` to ensure the application is stable.
- Run `tsgo` for typechecking.
- Confirm all links in `Shell.tsx` and `navGroups` match the new route structure.

## Technical Details
- All components will follow the `export default function ...Page()` pattern.
- 'B' suffixes in function names and display labels will be removed to reflect the final product state.
- Redundant style imports or legacy "Prototype" references in comments will be cleaned up.

# Ingestion Interface Refinement

Create a professional and functional UI for the Catalog Ingestion Engine in the PUB ECOM HUB, allowing operators to input URLs, monitor progress, view results, and import products.

## UI Components to Implement

### 1. Ingestion Form (Idle State)
- Central section titled "Importar catálogo".
- URL input field: "URL da loja ou fonte".
- Placeholder: "https://shopee.com.br/9r18ht6m88".
- Action button: "Analisar catálogo".
- Example URL and supported sources (Shopee).
- URL pre-processing: Remove `#product_list` and other fragments before processing.

### 2. Progress Tracker (Loading State)
- Visual feedback: "Analisando catálogo...".
- Step-by-step progress display:
  - Validando URL
  - Identificando fonte
  - Descobrindo loja
  - Buscando produtos
  - Preparando preview

### 3. Execution Result (Success State)
- Display metadata: Store name, Origin, ShopID (if available), items found, execution time.
- Breakdown: New items, Duplicates, Errors.
- Retain and improve the existing preview table.

### 4. Error Feedback (Error State)
- Detailed error messages for common ingestion issues:
  - HTTP 403 Forbidden (Anti-scraping)
  - Timeout
  - Store unavailable
  - Unsupported source
  - Worker failure

### 5. Final Import Flow
- "Selecionar todos" checkbox.
- "Importar selecionados" button.
- Confirmation view: "X produtos importados para o Catálogo Master".

## Technical Implementation Details

- **File**: `src/pages/dashboard/suppliers/ingestion/CatalogIngestion.tsx`
- **State Management**:
  - `status`: idle | analyzing | preview | error | importing | completed
  - `progress`: current step in the analyzing phase.
  - `errorMessage`: detailed error string.
- **Validation**: Strict URL validation before triggering the server function.
- **Server Functions**:
  - `analyzeCatalogFn`: For discovery and normalization.
  - `importProductsFn`: For final persistence in the Master Catalog.
- **Design**: Emerald Dark (OKLCH) consistent with the PUB Ops Hub style.

## Verification Plan

### 1. Automated Checks
- `npm run build`: Ensure no regressions or type errors.

### 2. Operational Test
- Test with URL: `https://shopee.com.br/9r18ht6m88#product_list`
- Verify fragment removal.
- Test with an invalid URL to confirm error handling.
- Verify selection logic and final import confirmation message.

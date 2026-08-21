# Plan - FASE 2F.8 — RESOLUÇÃO DE SHOPID POR LINKS DE PRODUTO

Implementar uma estratégia de fallback robusta no `catalog-worker` para extrair o `shopId` diretamente dos links de produtos presentes no DOM da página da loja Shopee.

## Technical Details

### 1. Catalog Worker (`catalog-worker/src/index.ts`)
- **Novos Campos de Diagnóstico**: Adicionar `productLinkCount` e `productLinkShopIds` à interface `DiagnosticResult`.
- **Extração de Links**: 
  - Usar `document.querySelectorAll("a[href]")` para capturar todos os links.
  - Aplicar Regex `/i\.(\d{4,})\.(\d{4,})(?:[/?#]|$)/i` nos `href` para extrair `shopId` e `itemId`.
  - Contabilizar a frequência de cada `shopId` encontrado.
- **Lógica de Decisão**:
  - Priorizar o `shopId` mais frequente se múltiplos links forem encontrados.
  - Se houver apenas um `shopId` consistente, utilizá-lo.
- **Ordem de Execução**:
  1. `/shop/{numericId}` (URL original)
  2. **Product Link Extraction** (Nova)
  3. `shop-base-username` (API)
  4. `preloaded_state` / `json_ld` (DOM)

### 2. Frontend Dashboard (`src/routes/index.tsx`)
- Atualizar o título para "FASE 2F.8 — RESOLUÇÃO DE SHOPID POR LINKS DE PRODUTO".
- Atualizar a lista de funcionalidades para incluir a extração de links de produtos.
- Refletir o novo commit e status operacional.

### 3. Validação e Deploy
- Rodar `npm run typecheck` e `npm run build` no diretório `catalog-worker`.
- Executar `npx wrangler deploy --dry-run` para validar o manifesto do Worker.

## User Review Required

> [!IMPORTANT]
> A estratégia `product-link` depende de a página da Shopee carregar pelo menos um grid de produtos visível no DOM inicial ou após o carregamento básico. Em alguns casos, pode ser necessário um `scroll` ou `wait`, mas o Playwright no Cloudflare Workers já aguarda o `domcontentloaded`.

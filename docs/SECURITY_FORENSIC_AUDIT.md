# Relatório de Auditoria Forense de Segurança — PUB ECOM / PubecomHub

Este documento detalha a investigação forense, a causa raiz arquitetural, a localização exata no código-fonte, a correção estrutural implementada e a prova objetiva de eliminação de cada um dos **7 findings do Lovable Security Scan** e da dependência auditada no repositório `pubcoreagencia/pubecomhub`.

---

## Matriz Forense Consolidada dos 7 Findings

### Finding 1 (CRITICAL)
**Finding:** *Marketing event data can be read and modified by any authenticated user*
- **Caminho / Arquivo Responsável:** `supabase/migrations/20260821141909_799b9536-eddb-44c9-bbbb-a592c042077a.sql` (Linha 93) e `supabase/migrations/20260822140000_final_rls_hardening.sql`.
- **Causa Raiz:** A migration inicial definia `CREATE POLICY "Authenticated users can manage marketing events" ON public.marketing_events FOR ALL TO authenticated USING (true);`. O scanner do Lovable fazia a leitura estática das definições de RLS.
- **Correção Estrutural:**
  1. Substituída a policy na migration histórica e consolidado RLS restrito na migration final `20260822140000_final_rls_hardening.sql`.
  2. Modificação e exclusão restritas ao proprietário da loja (`stores.owner_id = auth.uid()`) e `MASTER`.
  3. Inserção anônima de tracking (pixel) protegida por função security definer `check_customer_store_match(customer_id, store_id)` exigindo que a loja esteja ativa e que o `customer_id` pertença à mesma loja.
- **Prova / Testes:** `tests/real_postgres_rls.test.ts` (Seção 5: `LOJISTA A reads only Store A marketing events`, `Cross-tenant INSERT by LOJISTA A into Store B is DENIED by PostgreSQL`, `ANON pixel tracking requires active store AND customer belonging to that same store`).

---

### Finding 2 (CRITICAL)
**Finding:** *An unauthenticated proxy lets anyone spend paid catalog-scraping credits*
- **Caminho / Arquivo Responsável:** `src/server/catalogProxy.ts` e `src/server.ts`.
- **Causa Raiz:** O proxy `/api/catalog/*`, `/api/ingestion/*`, `/v1/catalog/*` e `/ingestion/shopee` recebia requisições sem validar o JWT do Supabase do chamador, anexando incondicionalmente o `CATALOG_WORKER_TOKEN` e disparando operações pagas de scraping/ingestão no Cloudflare Worker.
- **Correção Estrutural:**
  1. Implementada a função `validateSupabaseCaller(request, envObj)` que extrai o Bearer token e valida `supabase.auth.getUser(token)`.
  2. Para rotas que consomem créditos de scraping (`/ingestion/*`, `/api/ingestion/*`, `/v1/catalog/stores/:id/refresh`), o proxy exige explicitamente que o perfil autenticado possua a role `MASTER`.
  3. Requisições anônimas retornam `401 Unauthorized`. Lojistas, influencers e fornecedores não autorizados retornam `403 Forbidden`.
- **Prova / Testes:** `tests/catalog_proxy_auth.test.ts` (8 testes HTTP provando `ANON -> 401`, `LOJISTA -> 403`, `FORNECEDOR -> 403`, `INFLUENCER -> 403` e `MASTER -> 200`).

---

### Finding 3 (CRITICAL)
**Finding:** *All customer contact information is exposed to any logged-in user*
- **Caminho / Arquivo Responsável:** `supabase/migrations/20260821133522_bd50e737-45a7-400c-b3e6-ee0865368a85.sql` (Linha 115) e `supabase/migrations/20260822140000_final_rls_hardening.sql`.
- **Causa Raiz:** A migration inicial definia `CREATE POLICY "Authenticated users can view customers" ON public.customers FOR SELECT TO authenticated USING (true);`.
- **Correção Estrutural:**
  1. Substituída a policy na migration histórica e consolidado RLS multi-tenant na migration final.
  2. Acesso à tabela `customers` restrito a `stores.owner_id = auth.uid()` e `MASTER`.
  3. Inserção cross-tenant autenticada bloqueada pelo PostgreSQL.
  4. Inserção anônima permitida exclusivamente no fluxo de checkout para lojas com `status = 'active'`.
- **Prova / Testes:** `tests/real_postgres_rls.test.ts` (Seção 4: `LOJISTA A reads only Store A customers, getting 0 rows for Store B`, `Cross-tenant INSERT by authenticated LOJISTA A into Store B is DENIED by PostgreSQL`).

---

### Finding 4 (WARNING)
**Finding:** *Product cost and profit margin data are publicly exposed*
- **Caminho / Arquivo Responsável:** `supabase/migrations/20260821133522_bd50e737-45a7-400c-b3e6-ee0865368a85.sql` (Linha 97), `src/lib/repositories/productRepository.ts` e `supabase/migrations/20260822140000_final_rls_hardening.sql`.
- **Causa Raiz:** A migration inicial definia `CREATE POLICY "Public can view products" ON public.products FOR SELECT TO anon, authenticated USING (true);`, expondo as colunas `cost` e `profit_margin` diretamente.
- **Correção Estrutural:**
  1. Tabela base `products` com `cost` e `profit_margin` restrita a `stores.owner_id = auth.uid()` e `MASTER`.
  2. Criada a view segura `public.public_store_products` (`WITH (security_invoker = false)`) que projeta unicamente `id, store_id, name, description, price, stock, image_url, status`, omitindo 100% dos dados de custo e margem.
  3. Métodos públicos do repositório (`getPublicByStore`) apontam exclusivamente para `public_store_products`.
- **Prova / Testes:** `tests/real_postgres_rls.test.ts` (Seção 3: `ANON gets 0 rows on base products table (DENY)`, `public_store_products view strictly excludes cost, profit_margin, and supplier_id`).

---

### Finding 5 (WARNING)
**Finding:** *Master product catalog including supplier cost is visible to all authenticated users*
- **Caminho / Arquivo Responsável:** `supabase/migrations/20260821141909_799b9536-eddb-44c9-bbbb-a592c042077a.sql` (Linha 23) e `supabase/migrations/20260822140000_final_rls_hardening.sql`.
- **Causa Raiz:** A migration continha `CREATE POLICY "Master products are viewable by all authenticated users" ON public.master_products FOR SELECT TO authenticated USING (true);`, expondo a coluna `supplier_cost` e metadados confidenciais do fornecedor.
- **Correção Estrutural:**
  1. Tabela base `master_products` restrita a `MASTER` e ao fornecedor proprietário (`suppliers.profile_id = auth.uid()`).
  2. Criada a view comercial `public.available_master_products` que omite `supplier_cost` e aplica sanitização estrita no JSONB via `jsonb_build_object('external_id', ..., 'brand', ..., 'attributes', ...)`, purgando notas secretas e margens privadas.
  3. Lojistas consomem exclusivamente `available_master_products`.
- **Prova / Testes:** `tests/real_postgres_rls.test.ts` (Seção 2: `LOJISTA gets 0 rows on base master_products table (direct supplier_cost access DENIED)`, `LOJISTA reads available_master_products view where supplier_cost is absent and private metadata is sanitized`).

---

### Finding 6 (WARNING)
**Finding:** *Supplier directory is fully visible to any authenticated account*
- **Caminho / Arquivo Responsável:** `supabase/migrations/20260821133522_bd50e737-45a7-400c-b3e6-ee0865368a85.sql` (Linha 70) e `supabase/migrations/20260822140000_final_rls_hardening.sql`.
- **Causa Raiz:** A migration inicial continha `CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers FOR SELECT TO authenticated USING (true);`.
- **Correção Estrutural:**
  1. Tabela base `suppliers` restrita a `MASTER` e ao fornecedor dono (`profile_id = auth.uid()`).
  2. Removida concessão anônima (`REVOKE ALL ON public.public_suppliers FROM anon, public`).
  3. View `public.public_suppliers` restrita a `authenticated` com filtro estrito `JOIN master_products mp WHERE mp.is_available = true AND mp.status = 'active'`, impedindo a enumeração do diretório institucional da holding.
- **Prova / Testes:** `tests/real_postgres_rls.test.ts` (Seção 1: `LOJISTA gets 0 rows from base suppliers table (DENY)`, `ANON gets 0 rows from base suppliers table (DENY)`).

---

### Finding 7 (WARNING)
**Finding:** *Order and catalog-import server functions never verify who is calling*
- **Caminho / Arquivo Responsável:** `src/lib/catalog.functions.ts` (`analyzeCatalogFn`, `importProductsFn`), `src/lib/order.functions.ts` (`createOrderFn`, `getOrdersFn`) e `src/lib/worker-factory.functions.ts` (`createCatalogWorkerFn`).
- **Causa Raiz:** As server functions criadas com `createServerFn` não possuíam o middleware `.middleware([requireSupabaseAuth])` e não realizavam checagem de autorização no backend, permitindo chamadas arbitrárias sem validação de sessão nem de tenant.
- **Correção Estrutural:**
  1. Todas as server functions foram equipadas com `.middleware([requireSupabaseAuth])`.
  2. `analyzeCatalogFn`: valida se a role do chamador é `MASTER` ou `FORNECEDOR`.
  3. `importProductsFn`: valida se a role é `MASTER` ou se o usuário é o proprietário do `supplierId`.
  4. `createOrderFn`: valida se o chamador é o proprietário da `storeId` ou `MASTER`.
  5. `getOrdersFn`: valida que consultas por `storeId` exigem propriedade da loja ou `MASTER`; consultas por `influencerId` exigem que `influencerId === context.userId` ou `MASTER`; e consultas globais sem filtro são exclusivas para `MASTER`.
  6. `createCatalogWorkerFn`: validação estrita da role `MASTER`.
- **Prova / Testes:** `tests/real_postgres_rls.test.ts` e `tests/catalog_proxy_auth.test.ts`.

---

### Auditoria de Dependência
**Item:** *@tanstack/react-start 1.168.48 — 1 known high vulnerability*
- **Investigação:** Verificado o histórico de segurança do ecossistema `@tanstack/*` (CVE-2026-45321 / GHSA-g7cv-rxg3-hmpx referente às versões comprometidas 1.167.68-71 corrigidas na 1.167.72).
- **Status Atual:** A versão instalada `1.168.48` é a versão oficial estável pós-incidente.
- **Execução do `npm audit`:** 0 vulnerabilidades reportadas no pacote atual.

---

## Validação e Verificação Completa

```text
 ✓ catalog-worker/src/index.test.ts (4 tests) 42ms
 ✓ tests/security_authorization.test.ts (6 tests) 31ms
 ✓ tests/catalog_proxy_auth.test.ts (8 tests) 46ms
 ✓ tests/real_postgres_rls.test.ts (30 tests) 1746ms

 Test Files  4 passed (4)
      Tests  48 passed (48)
   Duration  2.08s
```

- **Typecheck (`npx tsc --noEmit`):** `PASS` (0 erros).
- **Build de Produção (`npm run build`):** `PASS` (0 erros).
- **Auditoria de Secrets no Client Bundle (`.output/public`):** **0 ocorrências** de secrets ou tokens privados.

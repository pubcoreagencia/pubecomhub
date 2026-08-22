# Project Context — PUB ECOM / PubecomHub

## Arquitetura do Sistema
- **Frontend / Hub:** TanStack Start, React 19, TailwindCSS v4, Vite 8, Nitro (Cloudflare module preset).
- **Backend / Catalog Worker:** Cloudflare Worker com D1 Master Catalog persistido (`pub-ecom-catalog-worker`).
- **Scraper Authority:** `pub-shopee-scraper` (Apify / Browser Run).
- **Database:** Supabase PostgreSQL com Row Level Security (RLS) e isolamento multi-tenant.

## Baseline de Segurança e Autorização (Hardening Completo)
- **RLS Rigoroso & Multi-Tenant:**
  - `marketing_events` e `customers` isolados por `store_id` e validados contra `stores.owner_id = auth.uid()`.
  - Inserções cross-tenant autenticadas são bloqueadas mesmo para lojas com status ativo.
  - Tracking anônimo valida consistência relacional entre `customer_id` e `store_id`.
- **Isolamento de Custos e Margens:**
  - `cost` e `profit_margin` em `products` acessíveis somente pelo dono da loja e `MASTER`.
  - `supplier_cost` em `master_products` acessível somente por `MASTER` e fornecedor proprietário (`suppliers.profile_id = auth.uid()`).
  - Views seguras: `public_store_products`, `available_master_products` (com sanitização de metadata) e `public_suppliers`.
- **BFF / Proxy Server-Side:** Comunicação com o Catalog Worker através de proxy server-side autenticado com `CATALOG_WORKER_TOKEN`, sem exposição de tokens no browser.

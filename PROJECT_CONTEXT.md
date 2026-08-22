# Project Context — PUB ECOM / PubecomHub

## Arquitetura do Sistema
- **Frontend / Hub:** TanStack Start, React 19, TailwindCSS v4, Vite 8, Nitro (Cloudflare module preset).
- **Backend / Catalog Worker:** Cloudflare Worker com D1 Master Catalog persistido (`pub-ecom-catalog-worker`).
- **Scraper Authority:** `pub-shopee-scraper` (Apify / Browser Run).
- **Database:** Supabase PostgreSQL com Row Level Security (RLS) e isolamento multi-tenant.

## Baseline de Segurança e Autorização (Fase Atual)
- **RLS Rigoroso:** Todas as tabelas sensíveis (`marketing_events`, `customers`, `products`, `master_products`, `suppliers`, `orders`, `wallets`) possuem RLS habilitado e políticas específicas sem `USING (true)` para dados de negócio.
- **Isolamento de Custos e Margens:**
  - `cost` e `profit_margin` em `products` acessíveis somente pelo dono da loja e `MASTER`.
  - `supplier_cost` em `master_products` acessível somente por `MASTER` e fornecedor.
  - Visões públicas (`public_store_products` e `available_master_products`) para navegação comercial segura.
- **BFF / Proxy Server-Side:** Comunicação com o Catalog Worker através de proxy server-side autenticado com `CATALOG_WORKER_TOKEN`, sem exposição de tokens no browser.

# Project Context — PUB ECOM / PubecomHub

## Arquitetura do Sistema
- **Frontend / Hub:** TanStack Start, React 19, TailwindCSS v4, Vite 8, Nitro (Cloudflare module preset).
- **Backend / Catalog Worker:** Cloudflare Worker com D1 Master Catalog persistido (`pub-ecom-catalog-worker`).
- **Scraper Authority:** `pub-shopee-scraper` (Apify / Browser Run).
- **Database:** Supabase PostgreSQL com Row Level Security (RLS) e isolamento multi-tenant completo.

## Baseline de Segurança e Autorização (Hardening Validado)
- **RLS Rigoroso & Multi-Tenant (PostgreSQL Engine):**
  - Isolamento atômico em `marketing_events`, `customers`, `products`, `master_products`, `suppliers` e `orders`.
  - Inserções cross-tenant autenticadas são bloqueadas em nível de banco.
  - Tracking anônimo e checkout público validam a existência e consistência das lojas e clientes.
- **Hardening de Funções & Views:**
  - Funções `SECURITY DEFINER` (`is_master`, `has_role`, `prevent_role_escalation`) têm execução restrita a `service_role`.
  - Views públicas utilizam `security_invoker = true` (PostgreSQL 15+), garantindo que RLS seja aplicado corretamente durante o planejamento.
- **Isolamento de Custos e Margens:**
  - `cost` e `profit_margin` em `products` acessíveis somente pelo dono da loja e `MASTER`.
  - `supplier_cost` em `master_products` acessível somente por `MASTER` e fornecedor proprietário (`suppliers.profile_id = auth.uid()`).
  - Views seguras sanitizadas: `public_store_products`, `available_master_products`, `public_suppliers`.
- **BFF / Proxy Server-Side:** Comunicação com o Catalog Worker através de proxy server-side autenticado com `CATALOG_WORKER_TOKEN`.

## Recuperação de Acesso Master
- **Usuário:** `contato.pubcore@gmail.com`
- **Role:** `MASTER`
- **Procedimento:** O usuário MASTER pode alterar sua senha diretamente em `/dashboard/settings` após o login com a credencial temporária. Em caso de perda total, o reset deve ser feito via `supabaseAdmin` por um agente autorizado.
- **Segurança:** O acesso é protegido por RLS e exige a role `MASTER` na tabela `public.profiles`. Alterações de senha master são auditadas e protegidas por middleware de servidor.

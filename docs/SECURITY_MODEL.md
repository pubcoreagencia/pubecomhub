# Modelo de Segurança e Controle de Acesso — PUB ECOM / PubecomHub

Este documento define formalmente a arquitetura de segurança, o controle de acesso baseado em papéis (RBAC), o isolamento multi-tenant, o inventário de policies RLS no PostgreSQL e os procedimentos de proteção contra vazamento de dados do **PubecomHub**.

---

## 1. Grafo de Relacionamentos e Ownership Real

A integridade do isolamento multi-tenant é garantida pelo grafo relacional no PostgreSQL:

```text
auth.users (id)
    ↑
profiles (id, role)
    ↑
    ├── stores (id, owner_id)
    │       ├── products (id, store_id, supplier_id, cost, profit_margin)
    │       │       └── [VIEW] public_store_products (exclui cost, profit_margin, supplier_id)
    │       ├── customers (id, store_id, name, email, phone)
    │       ├── marketing_events (id, store_id, customer_id)
    │       └── orders (id, store_id, customer_id, influencer_id, cost, net_profit)
    │               └── [VIEW] influencer_orders (exclui cost, net_profit, financial_metadata)
    │
    └── suppliers (id, profile_id, name, category)
            ├── master_products (id, supplier_id, supplier_cost, base_price_pub)
            │       └── [VIEW] available_master_products (exclui supplier_cost / sanitiza metadata)
            └── [VIEW] public_suppliers (apenas id, name, category)
```

---

## 2. Inventário Completo de Tabelas e Políticas RLS (PostgreSQL)

| Tabela / View | RLS | Comando | Role | Regra SQL (`USING` / `WITH CHECK`) | Justificativa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`suppliers`** | `ON` | `ALL` | `authenticated` | `p.role = 'MASTER' OR profile_id = auth.uid()` | Tabela base contém dados confidenciais do fornecedor. Acesso direto restrito ao dono e MASTER. |
| **`public_suppliers`** *(View)* | - | `SELECT` | `anon, authenticated` | Projeção segura: `id, name, category, created_at` | Catálogo comercial público sem dados privados (telefone, email, dados fiscais). |
| **`master_products`** | `ON` | `ALL` | `authenticated` | `p.role = 'MASTER' OR (s.id = supplier_id AND s.profile_id = auth.uid())` | Tabela base contém `supplier_cost`. Acesso direto restrito ao fornecedor proprietário e MASTER. |
| **`available_master_products`** *(View)* | - | `SELECT` | `authenticated` | Exclui `supplier_cost`. Sanitiza `metadata` com `jsonb_build_object('external_id', metadata->>'external_id', 'brand', metadata->>'brand', 'attributes', metadata->'attributes')` | Catálogo master comercial para Lojistas sem custos ou notas secretas de fornecedores. |
| **`products`** | `ON` | `ALL` | `authenticated` | `s.owner_id = auth.uid() OR p.role = 'MASTER'` | Tabela base contém `cost`, `profit_margin`. Acesso restrito ao lojista dono da loja e MASTER. |
| **`public_store_products`** *(View)* | - | `SELECT` | `anon, authenticated` | Projeção segura: `id, store_id, name, description, price, stock, image_url, status` | Vitrine da loja pública para visitantes e compradores sem expor margens ou custos. |
| **`customers`** | `ON` | `SELECT, UPDATE, DELETE` | `authenticated` | `s.owner_id = auth.uid() OR (pedidos na loja) OR p.role = 'MASTER'` | Dados pessoais e de contato de clientes visíveis somente pelo dono da respectiva loja. |
| **`customers`** | `ON` | `INSERT` | `authenticated` | `s.owner_id = auth.uid() OR p.role = 'MASTER'` | Impede que Lojista A insira clientes em lojas de outros lojistas (Cross-Tenant INSERT). |
| **`customers`** | `ON` | `INSERT` | `anon` | `store_id IS NOT NULL AND s.status = 'active'` | Checkout público de visitantes em lojas ativas. |
| **`marketing_events`** | `ON` | `SELECT, UPDATE, DELETE` | `authenticated` | `s.owner_id = auth.uid() OR p.role = 'MASTER'` | Eventos e rastreamento de comportamento restritos exclusivamente ao dono da loja. |
| **`marketing_events`** | `ON` | `INSERT` | `authenticated` | `s.owner_id = auth.uid() OR p.role = 'MASTER'` | Impede inserções maliciosas em lojas de terceiros. |
| **`marketing_events`** | `ON` | `INSERT` | `anon` | `s.status = 'active' AND EXISTS (SELECT 1 FROM customers c WHERE c.id = customer_id AND c.store_id = marketing_events.store_id)` | Tracking de vitrine (pixel) com validação relacional estrita entre `customer_id` e `store_id`. |
| **`orders`** | `ON` | `ALL` | `authenticated` | `s.owner_id = auth.uid() OR p.role = 'MASTER'` | Tabela base contém `cost`, `net_profit`, `financial_metadata`. Restrita ao dono e MASTER. |
| **`influencer_orders`** *(View)* | - | `SELECT` | `authenticated` | Projeção: `id, external_id, store_id, customer_id, influencer_id, affiliate_id, amount, shipping, tax, discount, status, tracking_code` | Visão para Influencers/Afiliados sem expor o custo ou lucro líquido da loja. |

---

## 3. Matriz de Autorização Executada (PostgreSQL Real)

| Entidade | MASTER | LOJISTA A | LOJISTA B | FORNECEDOR A | FORNECEDOR B | INFLUENCER | ANON |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`marketing_events`** | `RW` | `RW` (Store A) | `DENY` | `DENY` | `DENY` | `DENY` | `INSERT` (pixel na Store A) |
| **`customers`** | `RW` | `RW` (Store A) | `DENY` | `DENY` | `DENY` | `DENY` | `INSERT` (checkout) |
| **`products` (Base)** | `RW` | `RW` (Store A) | `DENY` | `DENY` | `DENY` | `DENY` | `DENY` |
| **`public_store_products`** | `SELECT` | `SELECT` | `SELECT` | `SELECT` | `SELECT` | `SELECT` | `SELECT` (vitrine pública) |
| **`master_products` (Base)** | `RW` | `DENY` | `DENY` | `RW` (Produtos próprios) | `DENY` | `DENY` | `DENY` |
| **`available_master_products`** | `SELECT` | `SELECT` (comercial) | `SELECT` (comercial) | `SELECT` | `SELECT` | `SELECT` | `DENY` |
| **`suppliers` (Base)** | `RW` | `DENY` | `DENY` | `RW` (Fornecedor próprio) | `DENY` | `DENY` | `DENY` |
| **`public_suppliers`** | `SELECT` | `SELECT` | `SELECT` | `SELECT` | `SELECT` | `SELECT` | `SELECT` |
| **`orders` (Base)** | `RW` | `RW` (Store A) | `DENY` | `DENY` | `DENY` | `DENY` | `DENY` |
| **`influencer_orders`** | `SELECT` | `SELECT` | `SELECT` | `SELECT` | `SELECT` | `SELECT` (pedidos vinculados) | `DENY` |

---

## 4. Auditoria de Segurança: Backend, Secrets e Client Bundle

1. **Proxy Server-Side (BFF):**
   - Rotas de catálogo intermediadas por `src/server/catalogProxy.ts` e `src/server.ts`.
   - O segredo `CATALOG_WORKER_TOKEN` reside exclusivamente em variáveis de ambiente server-side.
2. **Auditoria de `service_role`:**
   - `SUPABASE_SERVICE_ROLE_KEY` é carregada somente em `src/integrations/supabase/client.server.ts`.
   - Nenhum bundle do cliente importa `client.server.ts`.
3. **Auditoria do Client Bundle (`.output/public`):**
   - Verificação estática com regex de tokens sensíveis (`SUPABASE_SERVICE_ROLE_KEY`, `CATALOG_WORKER_TOKEN`, `service_role`).
   - Resultado: **0 ocorrências no bundle estático do cliente**.

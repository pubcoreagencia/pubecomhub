# Modelo de Segurança e Controle de Acesso — PUB ECOM / PubecomHub

Este documento define formalmente a arquitetura de segurança, o controle de acesso baseado em papéis (RBAC), o isolamento multi-tenant e a proteção contra vazamento de dados sensíveis do ecossistema **PubecomHub**.

---

## 1. Relacionamento de Entidades e Ownership Real

A integridade do isolamento multi-tenant é garantida pelo grafo de relacionamentos relacional no PostgreSQL:

```text
auth.users (id)
    ↑
profiles (id, role)
    ↑
    ├── stores (id, owner_id)
    │       ├── products (id, store_id, supplier_id, cost, profit_margin)
    │       │       └── [VIEW] public_store_products (sem cost / profit_margin)
    │       ├── customers (id, store_id, name, email, phone)
    │       ├── marketing_events (id, store_id, customer_id)
    │       └── orders (id, store_id, customer_id, influencer_id, cost, net_profit)
    │
    └── suppliers (id, profile_id, name, category)
            ├── master_products (id, supplier_id, supplier_cost, base_price_pub)
            │       └── [VIEW] available_master_products (sem supplier_cost / sanitized metadata)
            └── [VIEW] public_suppliers (id, name, category)
```

---

## 2. Matriz de Autorização Multi-Tenant e RBAC

| Entidade | MASTER | LOJISTA A (Owner Store A) | LOJISTA B | FORNECEDOR A | FORNECEDOR B | Visitante Público / ANON |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Marketing Events** | `RW` (Global) | `RW` (Store A apenas) | `DENY` | `DENY` | `DENY` | `INSERT` (apenas pixel ativo na Store A com Customer A) |
| **Customers** | `RW` (Global) | `RW` (Store A apenas) | `DENY` | `DENY` | `DENY` | `INSERT` (apenas checkout na Store A ativa) |
| **Products (Base)** | `RW` (Global) | `RW` (Store A com custo/margem) | `DENY` | `DENY` | `DENY` | `DENY` |
| **public_store_products (View)** | `SELECT` | `SELECT` | `SELECT` | `SELECT` | `SELECT` | `SELECT` (apenas vitrine pública sem custo/margem) |
| **Master Products (Base)** | `RW` (Global) | `DENY` (bloqueado em base) | `DENY` | `RW` (Produtos próprios com custo) | `DENY` | `DENY` |
| **available_master_products (View)** | `SELECT` | `SELECT` (comercial sem supplier_cost) | `SELECT` | `SELECT` | `SELECT` | `DENY` |
| **Suppliers (Base)** | `RW` (Global) | `SELECT` (se possuir produtos daquele fornecedor) | `DENY` | `RW` (Fornecedor próprio) | `DENY` | `DENY` |
| **public_suppliers (View)** | `SELECT` | `SELECT` | `SELECT` | `SELECT` | `SELECT` | `SELECT` |
| **Orders** | `RW` (Global) | `RW` (Store A com net_profit) | `DENY` | `DENY` | `DENY` | `INSERT` (checkout da vitrine) |

---

## 3. Políticas de RLS Detalhadas por Tabela

### 3.1. `marketing_events`
- **SELECT / UPDATE / DELETE**:
  - `stores.owner_id = auth.uid()` OU `profiles.role = 'MASTER'`.
- **INSERT (Authenticated)**:
  - `stores.owner_id = auth.uid()` OU `profiles.role = 'MASTER'` *(Impede inserção maliciosa em Store B mesmo ativa)*.
- **INSERT (Anon)**:
  - `stores.status = 'active'` E `EXISTS (SELECT 1 FROM customers WHERE id = customer_id AND store_id = marketing_events.store_id)`.

### 3.2. `customers`
- **SELECT / UPDATE / DELETE**:
  - `stores.owner_id = auth.uid()` OU pedidos vinculados na loja do proprietário OU `profiles.role = 'MASTER'`.
- **INSERT (Authenticated)**:
  - `stores.owner_id = auth.uid()` OU `profiles.role = 'MASTER'`.
- **INSERT (Anon)**:
  - `stores.status = 'active'`.

### 3.3. `products` e `public_store_products`
- Tabela base `products` contém colunas confidenciais: `cost` e `profit_margin`.
- RLS em `products` bloqueia qualquer usuário exceto o dono da loja (`owner_id = auth.uid()`) e `MASTER`.
- View `public_store_products` projeta apenas: `id, store_id, master_product_id, name, description, price, stock, image_url, status, created_at, updated_at`.

### 3.4. `master_products` e `available_master_products`
- Tabela base `master_products` contém `supplier_cost`.
- RLS em `master_products` restringe leitura/escrita a `MASTER` e ao fornecedor dono (`suppliers.profile_id = auth.uid()`).
- View `available_master_products` exclui `supplier_cost` e sanitiza `metadata jsonb` com `jsonb_build_object('external_id', metadata->>'external_id', 'brand', metadata->>'brand', 'attributes', metadata->'attributes')`.

### 3.5. `suppliers` e `public_suppliers`
- Adicionada a coluna `profile_id uuid REFERENCES public.profiles(id)` para amarração real de fornecedor.
- Tabela base `suppliers` restrita a `MASTER`, `profile_id = auth.uid()` e lojistas com inventário ativo daquele fornecedor.

---

## 4. Camada Server-Side Proxy (BFF)
- O token `CATALOG_WORKER_TOKEN` nunca é entregue ao navegador.
- As chamadas passam por `/api/catalog/*` e `/api/ingestion/*` interceptadas em `src/server.ts` e `src/server/catalogProxy.ts`.
- Caso `CATALOG_WORKER_TOKEN` não esteja configurado no servidor, o proxy retorna `HTTP 401 Unauthorized` de forma controlada.

---

## 5. Diretrizes de Uso da `service_role`
- A chave `SUPABASE_SERVICE_ROLE_KEY` reside exclusivamente no ambiente server-side (`src/integrations/supabase/client.server.ts`).
- Nenhum endpoint ou componente frontend tem acesso à service role.
- Operações administrativas que necessitam de bypass do RLS devem obrigatoriamente validar a sessão e a autorização do usuário antes da execução.

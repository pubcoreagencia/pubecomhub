# Modelo de Segurança e Controle de Acesso — PUB ECOM / PubecomHub

Este documento define formalmente a arquitetura de segurança, controle de acesso baseado em papéis (RBAC), isolamento multi-tenant e proteção de dados sensíveis do **PubecomHub**.

---

## 1. Papéis de Acesso (RBAC)

O sistema define os seguintes papéis através do enum `public.app_role`:

| Papel | Descrição | Escopo de Acesso |
| :--- | :--- | :--- |
| **`MASTER`** | Administrador da holding PUB REC / PUB ECOM | Acesso irrestrito a todas as lojas, métricas globais, custos e configurações |
| **`LOJISTA`** | Proprietário de loja/vitrine e-commerce | Acesso exclusivo às suas próprias lojas, produtos, pedidos, clientes e eventos |
| **`FORNECEDOR`** | Parceiro e provedor de inventário | Gestão dos seus próprios produtos cadastrados e controle de custos de fornecimento |
| **`AFILIADO`** | Promotor e vendedor comissionado | Acesso exclusivo às suas vendas, links de afiliado e comissões |
| **`INFLUENCER`** | Criador de conteúdo parceiro | Acesso exclusivo aos pedidos e comissões atribuídos ao seu perfil |
| **`ANON`** | Visitante público da vitrine | Leitura de vitrines ativas e catálogo comercial público (sem custos/margens) |

---

## 2. Matriz de Autorização por Entidade

| Entidade | READ (SELECT) | CREATE (INSERT) | UPDATE | DELETE | Campos Sensíveis |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`profiles`** | Próprio perfil ou `MASTER` | `auth.uid() = id` | Próprio perfil ou `MASTER` | `MASTER` | `email`, `role` |
| **`stores`** | Proprietário (`owner_id`) ou `MASTER` (público lê apenas se `status = active`) | Proprietário autenticado | Proprietário ou `MASTER` | Proprietário ou `MASTER` | Configurações internas |
| **`products`** | Proprietário da loja ou `MASTER` | Proprietário da loja ou `MASTER` | Proprietário da loja ou `MASTER` | Proprietário da loja ou `MASTER` | `cost`, `profit_margin`, `supplier_id` |
| **`public_store_products`** *(View)* | `ANON`, `AUTHENTICATED` (vitrine pública) | N/A | N/A | N/A | *Não contém campos sensíveis* |
| **`master_products`** | `MASTER` ou Fornecedor proprietário | `MASTER` ou Fornecedor proprietário | `MASTER` ou Fornecedor proprietário | `MASTER` ou Fornecedor proprietário | `supplier_cost`, `metadata.supplier_info` |
| **`available_master_products`** *(View)* | `AUTHENTICATED` (Lojistas) | N/A | N/A | N/A | *Não contém supplier_cost* |
| **`customers`** | Dono da loja associada (`store_id`) ou `MASTER` | Dono da loja ou Checkout da vitrine | Dono da loja ou `MASTER` | Dono da loja ou `MASTER` | `name`, `email`, `phone`, documentos |
| **`marketing_events`** | Dono da loja associada (`store_id`) ou `MASTER` | Dono da loja ou Vitrine ativa | Dono da loja ou `MASTER` | Dono da loja ou `MASTER` | `metadata`, rastreamento de usuário |
| **`suppliers`** | `MASTER`, próprio fornecedor ou Lojista com relação ativa | `MASTER` ou Fornecedor | `MASTER` ou Fornecedor | `MASTER` | Contatos, dados fiscais, custos |
| **`orders`** | Dono da loja, Influencer/Afiliado vinculado ou `MASTER` | Checkout de loja ativa ou `MASTER` | Dono da loja ou `MASTER` | `MASTER` | `cost`, `net_profit`, metadados financeiros |
| **`commissions`** | Próprio beneficiário (`profile_id`) ou `MASTER` | Sistema (triggers/service role) | `MASTER` | `MASTER` | Valores, splits |
| **`wallets` / `wallet_transactions`** | Próprio titular (`profile_id`) ou `MASTER` | Sistema | `MASTER` | `MASTER` | Saldos, extratos |

---

## 3. Isolamento Multi-Tenant

Para todas as entidades de negócio:
1. A vinculação de posse é efetuada por `store_id` (loja) ou `profile_id` (usuário).
2. O Row Level Security (RLS) valida estritamente a relação entre `auth.uid()`, a loja pertencente (`stores.owner_id = auth.uid()`) ou a role administrativa (`profiles.role = 'MASTER'`).
3. O frontend nunca define autorização por filtros de tela; a proteção é aplicada diretamente no PostgreSQL via RLS e no backend via API Proxy.

---

## 4. Camada de Proxy Server-Side (Catalog Worker BFF)

1. A integração com o Cloudflare Worker (`pub-ecom-catalog-worker`) é intermediada por rotas proxy server-side (`src/server/catalogProxy.ts`).
2. O token `CATALOG_WORKER_TOKEN` reside **exclusivamente nas variáveis de ambiente do servidor** e nunca é enviado ao browser.
3. Se `CATALOG_WORKER_TOKEN` estiver ausente, o proxy rejeita a requisição com `HTTP 401 Unauthorized` de forma segura.

---

## 5. Regras para Uso de `service_role`

1. A chave `SUPABASE_SERVICE_ROLE_KEY` é estritamente restrita a módulos `.server.ts` e server handlers.
2. Nunca importar `client.server.ts` no código do client bundle (React components ou rotas públicas).
3. Todas as operações com `service_role` no servidor devem validar a sessão do requisitante e aplicar os filtros de tenant correspondentes.

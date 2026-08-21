# Plano de Modelagem de Domínio e Eventos - FASE 2A

O objetivo desta fase é alinhar o backend do PUB ECOM HUB com a realidade operacional do negócio, introduzindo conceitos como Catálogo Master vs Loja, precificação em camadas, orquestração de fulfillment e motor de eventos.

## 1. Ajuste do Schema (Database)
Aprimorar o banco de dados para suportar a separação entre produtos globais e da loja, e registrar eventos de tracking.

- **Novas Tabelas:**
  - `master_products`: Catálogo central da plataforma.
  - `wallets`: Saldo por usuário.
  - `wallet_transactions`: Histórico de movimentações.
  - `order_tracking`: Linha do tempo do pedido.
  - `marketing_events`: Log de eventos para CRM/Audience.
- **Alterações em Tabelas Existentes:**
  - `products` -> `store_products`: Adicionar `master_product_id` e campos de customização.
  - `orders`: Adicionar campos para fulfillment e origem completa.

## 2. Refatoração de Types
Atualizar `src/types/index.ts` para refletir a nova estrutura.
- Interface `MasterProduct`.
- Interface `StoreProduct`.
- Estados de pedido: `pending_payment`, `paid`, `processing`, `supplier_ordered`, etc.
- Tipos de eventos: `PAGE_VIEW`, `ORDER_CREATED`, etc.

## 3. Arquitetura de Repositórios e Services
- **Novos Repositórios:** `MasterProductRepository`, `WalletRepository`, `EventRepository`.
- **Services:** Implementar `FulfillmentService` e `PricingService` para encapsular regras de cálculo e orquestração.

## 4. Mock Compatibility
- Atualizar `src/data/mock.ts` para incluir os novos modelos, garantindo que o frontend continue funcionando sem erros.

## 5. Documentação e Auditoria
- Atualizar `PROJECT_CONTEXT.md` com o novo modelo de domínio.
- Registrar mudanças no `CHANGELOG.md`.

## Detalhes Técnicos
- Utilizar colunas geradas no PostgreSQL para cálculos de lucro quando possível.
- Implementar triggers para `net_profit` caso a lógica envolva múltiplas tabelas.
- Manter o padrão `useMock` nos repositórios para transição segura.

# Plano: Fundação de Dados Real do PUB ECOM HUB

Este plano descreve a transição da aplicação de dados mockados para persistência real usando Lovable Cloud (Supabase), mantendo a integridade visual e funcional atual.

## Objetivos
- Configurar a estrutura de banco de dados (tabelas, RLS, relacionamentos).
- Implementar repositórios reais que abstraiam a fonte de dados (Mock vs. DB).
- Garantir que as regras financeiras (50% do lucro líquido para influencers) sejam processadas no servidor.
- Manter o frontend Emerald Dark intacto e funcional.

## Etapas de Implementação

### 1. Modelagem do Banco de Dados (Supabase Migration)
Criar as tabelas no schema `public` com as permissões corretas (GRANTs) e políticas RLS:
- `profiles` (estende auth.users)
- `stores` (vínculo com profiles/owner)
- `suppliers`
- `products` (vínculo com stores e suppliers)
- `inventory`
- `customers`
- `orders` (vínculo com stores, customers, suppliers)
- `order_items`
- `influencers` / `affiliates`
- `commissions` (registros de repasses calculados)
- `financial_transactions`

### 2. Camada de Repositórios e Abstração
- Criar interfaces de Repositório em `src/types/index.ts`.
- Implementar `SupabaseUserRepository`, `SupabaseStoreRepository`, etc.
- Atualizar `orderRepository.ts` para suportar toggle entre mock e real via variável de ambiente ou configuração.

### 3. Server Functions (TanStack Start)
- Criar funções de servidor para operações sensíveis:
  - `createOrder`: Processa venda, calcula impostos, frete e lucros.
  - `calculateCommissions`: Aplica a regra de 50% do lucro líquido no servidor.
  - `updateInventory`: Garante atomicidade no estoque.

### 4. Integração e Fallback
- Configurar os loaders das rotas para usar a camada de Repositórios.
- Garantir que se o banco não retornar dados (ou em ambiente de desenvolvimento inicial), o `src/data/mock.ts` seja utilizado.

## Detalhes Técnicos

### Esquema SQL (Resumo)
```sql
-- Exemplo de relacionamento e regra financeira
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES public.stores(id),
  amount decimal(12,2),
  cost decimal(12,2),
  shipping decimal(12,2),
  tax decimal(12,2),
  influencer_id uuid REFERENCES public.profiles(id),
  net_profit decimal(12,2) GENERATED ALWAYS AS (amount - cost - shipping - tax) STORED
);
```

### Segurança
- RLS habilitado em todas as tabelas.
- Acesso autenticado via `auth.uid()`.
- GRANTs explícitos para as roles `authenticated` e `service_role`.

## Critérios de Aceite
- [ ] Build e Typecheck sem erros.
- [ ] Dashboard e Storefront visualmente idênticos.
- [ ] Persistência real funcionando para Pedidos e Produtos.
- [ ] Mocks mantidos como fallback funcional.
- [ ] Documentação (`PROJECT_CONTEXT.md` e `CHANGELOG.md`) atualizada.

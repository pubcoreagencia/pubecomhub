# Plano de Reconstrução do Prototype B — Base Real PUB Ops Hub

Reconstrução total do **Prototype B** para ser uma aplicação independente do Prototype A, utilizando a arquitetura e estética do repositório **PUB Ops Hub** (dark theme, bento grids, layout premium).

## Etapa 1: Base de Design e Estrutura
- [ ] Refinar `theme-b.css` com as cores exatas do Hub (OKLCH).
- [ ] Atualizar `ShellB.tsx` para ser o layout principal de todas as rotas `/prototype-b/dashboard/*`.
- [ ] Criar componentes de UI padronizados em `ui-b.tsx` baseados no Hub (Cards, Tabelas, Funis).

## Etapa 2: Módulos Operacionais e Lógica de Negócio
- [ ] **Dashboard Master**: Bento Grid com métricas reais do mock (Faturamento, Pedidos, Lucro).
- [ ] **Live Shop**: Monitor de eventos em tempo real e funil visual (L1 -> L4).
- [ ] **Financeiro**: Cálculos de margem, repasse de 50% para influencers e ranking de lojas.
- [ ] **Audience Engine**: Gestão de públicos personalizados (Page View, Add to Cart, etc.).
- [ ] **Logística**: Reconstruir Pedidos, Fornecedores e Estoque com o novo visual.

## Etapa 3: Storefront B
- [ ] Criar uma Storefront completamente nova em `/prototype-b/store/`.
- [ ] Estética dark premium (Apple/Shopify style).
- [ ] Fluxo completo: Home -> Produto -> Carrinho -> Checkout -> Confirmação.
- [ ] Persistência do carrinho em `localStorage` específica para o B.

## Etapa 4: Integração e Validação
- [ ] Garantir isolamento total das rotas do Prototype A.
- [ ] Validar build, TypeScript e navegação responsiva.
- [ ] Redirecionar preview para `/prototype-b/dashboard`.

## Detalhes Técnicos
- Utilizar `src/prototype-b/` para toda a lógica e componentes do B.
- Manter `src/prototype-b/data/mock.ts` como fonte única de verdade para os dados simulados.
- Arquitetura segregada: `UI -> Services -> Repositories -> Mock`.

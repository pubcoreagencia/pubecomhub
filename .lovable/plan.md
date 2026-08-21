# Plano de Implementação: PUB ECOM — PROTOTYPE B

Este plano detalha a criação do **PROTOTYPE B** do PUB ECOM, uma versão independente e evoluída baseada nos requisitos premium e na arquitetura de referência (PUB Ops Hub).

## 1. Arquitetura e Estrutura de Dados
O Prototype B será isolado no diretório `src/prototype-b/` para evitar qualquer interferência no Prototype A.

- **Camada de Dados**: Implementação de Mock Data centralizado em `src/prototype-b/data/mock.ts`.
- **Repositórios**: Abstração de acesso a dados em `src/prototype-b/repositories/`.
- **Serviços**: Lógica de negócio (cálculos financeiros, regras de influencers e afiliados) em `src/prototype-b/services/`.
- **Tipagem**: Definições estritas de interfaces em `src/prototype-b/types/index.ts`.

## 2. Dashboard Master & Módulos
Implementação de uma interface administrativa premium com os seguintes módulos:
- **Live Shop**: Funil em tempo real (Page View -> Add to Cart -> Payment -> Purchase) com visualização de conversão.
- **Audience Engine**: Segmentação de públicos em 4 níveis (L1-L4) para estratégias de marketing.
- **Central Financeira**: Visão detalhada de faturamento, custos, frete, taxas e distribuição de lucros.
- **Gestão de Pedidos**: Fluxo completo integrando Lojista, PUB ECOM e Fornecedor.

## 3. Regras de Negócio Específicas
- **Influencers**: Automação do cálculo de repasse de 50% sobre o lucro líquido.
- **Afiliados**: Sistema de comissionamento percentual configurável.
- **Fornecedores**: Integração lógica no fluxo de pedidos e estoque.

## 4. Storefront Premium
Criação de uma experiência de compra moderna (estilo Apple/Shopify):
- Home, Categorias, Página de Produto.
- Carrinho persistente e Checkout transparente simulado.
- Confirmação de pedido com rastreamento visual.

## 5. Roteamento
As rotas do Prototype B serão integradas ao TanStack Router sob o prefixo `/prototype-b/` (ex: `/prototype-b/dashboard`), mantendo a coexistência com o Prototype A.

## Detalhes Técnicos
- **Framework**: TanStack Start v1 (React 19).
- **Estilização**: Tailwind CSS v4 com sistema de cores OKLCH e design "Bento Grid".
- **Ícones**: Lucide React para alta fidelidade visual.
- **Animações**: Framer Motion (quando aplicável) para transições fluidas.

---
**Atenção**: O Prototype A permanecerá intocado. Todas as novas implementações serão exclusivas do diretório `src/prototype-b/`.

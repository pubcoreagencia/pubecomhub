# PUB ECOM HUB - Project Context

## Objetivo
Transformar o PUB ECOM em uma plataforma central de operação de e-commerce premium, baseada na estrutura do PUB Ops Hub.

## Arquitetura Atual
- **Framework**: TanStack Start v1 (React 19, Vite 7, SSR).
- **Estilização**: Tailwind CSS v4 com design system "Emerald Dark" (OKLCH).
- **Roteamento**: TanStack Router com arquivos em `src/routes/`.
- **Componentização**: Páginas extraídas das rotas para `src/pages/dashboard/` e `src/pages/store/`.
- **Estado**: TanStack Query para gerenciamento de dados.

## Estrutura de Diretórios
- `src/components/`: Componentes UI reutilizáveis (Shadcn).
- `src/pages/dashboard/`: Componentes de página do painel administrativo.
- `src/pages/store/`: Componentes de página da loja.
- `src/routes/`: Definição de rotas e loaders.
- `src/data/`: Dados mockados centralizados (`mock.ts`).
- `src/lib/services/`: Lógica de negócio (ex: cálculo de repasse de 50%).
- `src/lib/repositories/`: Repositórios de dados.
- `src/types/`: Definições de tipos unificadas.

## Módulos Implementados
- **Dashboard**: Visão geral com Bento Grid e métricas em tempo real.
- **Live Shop**: Monitoramento de eventos e vendas ao vivo.
- **Audience Engine**: Gestão de clientes e leads.
- **Financeiro**: Controle de vendas, lucros e repasses.
- **Operação**: Gestão de pedidos, estoque, produtos e fornecedores.
- **Crescimento**: Marketing, SEO, Afiliados e Influenciadores.

## Regras de Negócio
- **Influenciadores**: Recebem 50% do lucro líquido das vendas.
- **Storefront**: Checkout funcional com persistência em localStorage e limpeza pós-venda.

## Próximos Passos
- Integração com APIs reais (Gateways, Ads, etc.).
- Migração de dados mock para banco de dados real (Lovable Cloud).

## Histórico de Decisões
- Unificação das experiências Prototype A e B em uma única aplicação.
- Extração de lógica das rotas para componentes de página (`src/pages/`) para melhor organização.
- Adoção do Emerald Dark como padrão visual.

## Instruções para IA
- O projeto usa TanStack Router. Nunca use react-router-dom.
- Adicione novas páginas em `src/pages/dashboard/` e vincule em `src/routes/dashboard/`.
- Mantenha a tipagem em `src/types/index.ts`.
- Use `src/data/mock.ts` para novos dados simulados.

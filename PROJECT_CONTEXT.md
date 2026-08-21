# PUB ECOM HUB - Project Context

## Objetivo
Transformar o PUB ECOM em uma plataforma central de operação de e-commerce premium, independente e consolidada.

## Arquitetura Atual
- **Framework**: TanStack Start v1 (React 19, Vite 7, SSR).
- **Estilização**: Tailwind CSS v4 com design system "Emerald Dark" (OKLCH).
- **Roteamento**: TanStack Router com arquivos em `src/routes/`.
- **Componentização**: Páginas centralizadas em `src/pages/dashboard/` e `src/pages/store/`.
- **Layout**: Shell principal unificado em `src/components/layout/Shell.tsx`.
- **Estado**: TanStack Query para gerenciamento de dados.

## Estrutura de Diretórios
- `src/components/`: Componentes UI reutilizáveis (Shadcn).
- `src/components/ui/`: Contém apenas componentes efetivamente necessários após a limpeza estrutural.
- `src/components/ui-b.tsx`: Componente ativo que contém elementos em uso; não deve ser removido até refatoração planejada.
- `src/pages/dashboard/`: Componentes de página do painel administrativo.
- `src/pages/store/`: Componentes de página da loja.
- `src/routes/`: Definição de rotas e loaders.
- `src/data/`: Dados mockados centralizados (`mock.ts`).
- `src/lib/services/`: Lógica de negócio (ex: cálculo de repasse de 50%).
- `src/lib/repositories/`: Repositórios de dados. `orderRepository.ts` é o repositório ativo de pedidos.
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
- Refatoração de `ui-b.tsx` para componentes individuais em `src/components/ui/`.

## Histórico de Decisões
- **Independência**: O projeto é um produto independente (PUB ECOM HUB). Não existem diretórios `src/prototype-a/` ou `src/prototype-b/`.
- **Limpeza Estrutural**: Removidos arquivos órfãos (32 componentes UI e `orderService.ts`) para manter o projeto estável e enxuto.
- **Unificação**: Consolidação total da arquitetura baseada no design premium Emerald Dark.
- **Organização**: Extração de lógica das rotas para componentes de página (`src/pages/`).

## Instruções para IA
- O projeto usa TanStack Router. Nunca use react-router-dom.
- Adicione novas páginas em `src/pages/dashboard/` e vincule em `src/routes/dashboard/`.
- Mantenha a tipagem em `src/types/index.ts`.
- Use `src/data/mock.ts` para novos dados simulados.
- Siga as regras de continuidade em `AGENTS.md`.

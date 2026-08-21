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
- **Persistência**: Lovable Cloud (Supabase) integrada via Repository Pattern.

## Estrutura de Diretórios
- `src/components/`: Componentes UI reutilizáveis (Shadcn).
- `src/components/ui-b.tsx`: Componente ativo com elementos Emerald Dark.
- `src/pages/dashboard/`: Componentes de página do painel administrativo.
- `src/pages/store/`: Componentes de página da loja.
- `src/routes/`: Definição de rotas e loaders.
- `src/data/`: Dados mockados centralizados (`mock.ts`) usados como fallback.
- `src/lib/services/`: Lógica de negócio (ex: cálculo de repasse de 50%).
- `src/lib/repositories/`: Repositórios de dados com abstração Mock/Real.
  - `orderRepository.ts`: Repositório de pedidos.
  - `storeRepository.ts`: Repositório de lojas.
  - `productRepository.ts`: Repositório de produtos da loja.
  - `masterProductRepository.ts`: Repositório do catálogo master global.
- `src/types/`: Definições de tipos unificadas e interfaces de repositórios.

## Módulos Implementados
- **Dashboard**: Visão geral com Bento Grid e métricas em tempo real.
- **Live Shop**: Monitoramento de eventos e vendas ao vivo.
- **Audience Engine**: Gestão de clientes e leads.
- **Financeiro**: Controle de vendas, lucros e repasses.
- **Operação**: Gestão de pedidos, estoque, produtos e fornecedores.
- **Ingestion Engine**: Motor de importação automática de catálogos via adapters (Shopee/Mock) com interface operacional completa, preview e confirmação de importação.
- **Crescimento**: Marketing, SEO, Afiliados e Influenciadores.

## Regras de Negócio e Domínio
- **Master vs Store Product**: Separação entre o catálogo global e as customizações por loja.
- **Pricing em Camadas**: Custo Fornecedor -> Preço Base PUB -> Preço de Venda Lojista.
- **Influenciadores**: Recebem 50% do lucro líquido das vendas (Venda - Custo - Frete - Taxas - Descontos).
- **Event Engine**: Captura de eventos de marketing (PAGE_VIEW, etc.) para CRM e Audience.
- **Catalog Ingestion**: Workflow de Descoberta -> Normalização -> Preview -> Importação para Catálogo Master.
- **Storefront**: Checkout funcional preparado para fulfillment e tracking real.

## Catalog Ingestion Infrastructure
- **Worker Externo**: Projeto `pub-ecom-catalog-worker` hospedado na Cloudflare.
- **Provider Principal**: `Cloudflare Browser Run` via Playwright/CDP.
- **Segurança**: Autenticação Server-to-Server via `Authorization: Bearer`.
- **Arquitetura**: ShopeeExecutionProvider -> CloudflareExecutionProvider -> Cloudflare Worker.
- **Custos/Limites**: 
  - Workers Free: 10 min/dia.
  - Workers Paid: 10h/mês base.
  - Limite Operacional: 100 produtos por importação.

## Histórico de Decisões
- **Fundação de Dados**: Criada camada de persistência real sem quebrar o frontend.
- **Independência**: Produto independente PUB ECOM HUB (pubcoreagencia/pubecomhub).
- **Ingestion Engine**: Arquitetura baseada em Adapters e Services para expansão multi-fonte.
- **Fase 2E - Worker Externo**: Implementação de ponte para Cloudflare Browser Run para superar bloqueios de scraping (403) no ambiente local.
- **Fase 2F - PUB ECOM Catalog Worker**: Criação do projeto independente `catalog-worker/` com suporte nativo a Browser Run.
- **Fase 2F.3 - Deploy e Prova Real**: Build e bundling do worker validados via esbuild e wrangler dry-run. Deploy pendente de credenciais Cloudflare.
- **Integração Planejada**: 

  - **URL**: `https://pub-ecom-catalog-worker.<your-subdomain>.workers.dev`
  - **Auth**: Bearer Token seguro (Server-side only).
- **Prova Operacional (Fase 2D)**:
  - **URL Testada**: `https://shopee.com.br/shop/286044738`
  - **ShopID Detectado**: `286044738`
  - **Status**: Arquitetura de infraestrutura externa concluída.


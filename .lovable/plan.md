# Plano de Refinamento Premium: PUB ECOM V2 (Estilo PUB Ops Hub)

Este plano visa elevar o nível visual e de UX do projeto PUB ECOM atual, utilizando como referência o projeto premium "PUB Ops Hub". O foco é transformar o protótipo funcional em uma aplicação SaaS de alta fidelidade, mantendo toda a lógica de negócio e dados mockados já implementados.

## Alterações Visuais e UX

### 1. Sistema de Design e Estilização
- Refinar a paleta de cores em `src/styles.css` usando OKLCH para cores vibrantes e modernas (Indigo/Slate).
- Implementar gradientes sutis e efeitos de "Glassmorphism" em cabeçalhos e elementos flutuantes.
- Adicionar sombras semânticas e transições suaves (`duration-300`) em todos os cards e botões.

### 2. Layout do Dashboard (`src/layouts/DashboardLayout.tsx`)
- Redesenhar a Sidebar com categorias claras (Operacional, Gestão, Crescimento, Sistema).
- Implementar ícones Lucide com "background tints" (tinteiros de fundo) suaves e estados ativos destacados.
- Melhorar o Header com barra de busca estilizada, notificações e atalho rápido para a "Loja Pública".

### 3. Dashboard Master (`src/routes/dashboard/index.tsx`)
- Implementar um layout "Bento Grid" para as métricas principais.
- Adicionar indicadores de tendência (`ArrowUpRight`) e micro-interações nos gráficos diários.
- Melhorar a legibilidade financeira com tipografia pesada (`font-black`) para resultados líquidos.

### 4. Módulos Específicos (Live Shop, Audience, Financeiro)
- **Live Shop**: Adicionar animações de pulso no status "Ao Vivo" e refinar o visual do funil de conversão.
- **Audience Engine**: Melhorar o visual dos níveis L1-L4 com cores distintas e cards de configuração premium.
- **Financeiro**: Padronizar as tabelas com badges de status de alta fidelidade e filtros rápidos.

### 5. Storefront (`src/routes/store/`)
- Elevar a estética da loja para um nível "Apple/Shopify premium".
- Melhorar a página de produto com galerias limpas e CTAs destacados.
- Refinar o fluxo de checkout para transmitir máxima segurança e fluidez.

## Detalhes Técnicos
- **Tailwind v4**: Utilizar as novas capacidades do compilador para variáveis e utilitários de design.
- **TanStack Start**: Preservar o roteamento e o carregamento de dados via loaders/suspense.
- **Mock Data**: Manter `src/data/mock.ts` como fonte única de verdade.
- **Persistence**: Garantir que o `useCart` com `localStorage` continue funcionando perfeitamente.

## Considerações de Segurança
- Manter o uso de `React.createElement` para renderização dinâmica de ícones, evitando regressões visuais.
- Assegurar que as rotas públicas da loja permaneçam acessíveis sem necessidade de autenticação no protótipo.

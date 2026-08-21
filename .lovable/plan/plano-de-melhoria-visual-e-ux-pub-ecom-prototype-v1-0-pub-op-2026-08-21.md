# Plano de Melhoria Visual e UX: PUB ECOM Prototype V1.0 + PUB Ops Hub

Este plano descreve a evolução do protótipo atual para uma versão visualmente superior, inspirada no **PUB Ops Hub**, mantendo todas as funcionalidades e lógica de negócio já implementadas no **PUB ECOM**.

## Objetivos
- Elevar o design para um padrão SaaS Premium.
- Melhorar a hierarquia visual e a navegação do Dashboard.
- Refinar a experiência do Storefront.
- Garantir a consistência visual entre todos os módulos.

## Alterações Propostas

### 1. Design System & Global Styles
- **Cores**: Adotar uma paleta mais refinada (Indigo/Slate) baseada no padrão premium.
- **Tipografia**: Ajustar pesos e tamanhos para melhor legibilidade e hierarquia.
- **Componentes Shadcn**: Estilizar cards, tabelas e badges para um visual mais "limpo" e moderno.

### 2. Dashboard Layout (`src/layouts/DashboardLayout.tsx`)
- **Sidebar**: Tornar a sidebar mais elegante, com ícones refinados e estados ativos mais sutis. Adicionar agrupamento de módulos (Operacional, Gestão, Marketing).
- **Header**: Adicionar breadcrumbs, busca global (visual) e notificações.
- **Navegação**: Refinar a transição entre rotas.

### 3. Dashboard Master (`src/routes/dashboard/index.tsx`)
- **Cards de Métricas**: Usar o estilo "Bento Grid" ou cards com gradientes sutis/bordas refinadas.
- **Gráficos**: Melhorar a visualização de dados com cores mais harmônicas.
- **Hierarquia**: Priorizar métricas de faturamento e lucro líquido (PUB).

### 4. Live Shop (`src/routes/dashboard/live.tsx`)
- **Experiência Real-time**: Melhorar a visualização do funil com ícones e cores que indiquem "calor" (conversão).
- **Feed de Eventos**: Tornar o feed mais dinâmico visualmente, com badges de status claros.

### 5. Financeiro (`src/routes/dashboard/finance.tsx`)
- **Visão Geral**: Organizar melhor os repasses (Influencers/Afiliados) vs Resultado PUB ECOM.
- **Tabelas**: Implementar tabelas com estados de hover e tipografia otimizada para números.

### 6. Lojas e Pedidos (`src/routes/dashboard/stores.tsx`, `src/routes/dashboard/orders.tsx`)
- **Status Badges**: Refinar o design dos badges de status (Pago, Enviado, Entregue).
- **Filtros**: Adicionar barra de filtros visualmente integrada.

### 7. Storefront (`src/routes/store/index.tsx`, etc.)
- **Hero Section**: Tornar a seção inicial mais impactante com melhor uso de tipografia e imagens.
- **Cards de Produto**: Refinar o design dos cards, adicionando efeitos de hover e badges de oferta/destaque.
- **Checkout**: Melhorar o fluxo visual do checkout simulado.

## Detalhes Técnicos
- **Tailwind v4**: Uso intensivo de utilitários nativos e variáveis de tema.
- **Lucide React**: Padronização de ícones.
- **Framer Motion** (opcional): Pequenas transições para um feeling de app nativo.
- **Preservação**: O arquivo `src/data/mock.ts` e o hook `src/hooks/useCart.ts` **não** serão alterados em sua lógica, apenas consumidos por componentes visualmente renovados.

## Verificação e Qualidade
- Validar build (`bun run build:dev`).
- Testar fluxo completo da Store (Add to cart -> Checkout -> Confirmation).
- Verificar responsividade em mobile/desktop.
- Garantir que todas as rotas do Dashboard permanecem acessíveis e funcionais.

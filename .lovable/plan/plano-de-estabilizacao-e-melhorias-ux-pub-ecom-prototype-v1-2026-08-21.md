# Plano de Estabilizacao e Melhorias UX — PUB ECOM PROTOTYPE V1

Este plano foca em pequenas melhorias de UX (loading states, persistencia de carrinho) e estabilidade, mantendo a arquitetura TanStack Start e o status de "Congelado" do Protótipo V1.

## Melhorias de UX

### 1. Estados de Loading e Skeletons
Adicionar feedback visual de carregamento em rotas chave do Dashboard e Storefront para simular processamento de dados.
- Implementar hooks de simulação de carregamento (`isLoading`) em componentes de página.
- Utilizar o componente `Skeleton` para placeholders de tabelas e cards.

### 2. Persistencia do Carrinho na Store
Garantir que os itens do carrinho permaneçam salvos durante a navegação entre Home, Produto e Checkout usando `localStorage`.
- Criar um hook customizado `useCart` ou utilizar uma store simples para gerenciar o estado global do carrinho.
- Sincronizar o estado com o `localStorage`.
- Atualizar o contador da Navbar e o resumo do Checkout para ler deste estado.

### 3. Ajustes de Navegação e UX
- Corrigir o redirecionamento da rota raiz (`/`) para garantir transição suave para o Dashboard.
- Garantir que links de "Voltar" e navegação entre a Loja e o Dashboard funcionem conforme esperado.

## Detalhes Técnicos
- **TanStack Start**: Utilizar loaders e `useSuspenseQuery` (onde aplicável com mock) para simular carregamentos reais.
- **LocalStorage**: Implementar `useEffect` para hidratar o carrinho no cliente, evitando problemas de SSR.
- **Mock Data**: Manter `src/data/mock.ts` como fonte de verdade.

O projeto continuará utilizando a arquitetura atual sem migrações para Next.js nesta fase.

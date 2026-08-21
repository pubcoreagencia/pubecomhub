# Auditoria e Estabilização do PUB ECOM Prototype V1.0

Este plano visa realizar uma auditoria técnica profunda e corrigir bugs, inconsistências de UX e problemas de estabilidade identificados no protótipo atual.

## Alterações Propostas

### 1. Estabilização de Dados (Mock Data)
- **Problema**: Uso de `new Date()` em dados de mock causa erros de hidratação (mismatch entre servidor e cliente).
- **Solução**: Substituir datas dinâmicas por strings de data estáticas em `src/data/mock.ts`.
- **Melhoria**: Adicionar mais ordens de mock para preencher melhor os dashboards.

### 2. Refinamento de UX no Dashboard
- **Problema**: Conflito de nomes (shadowing) do componente `Badge` em `src/routes/dashboard/index.tsx`.
- **Problema**: Formatação de moeda inconsistente entre cartões e tabelas.
- **Solução**: Remover a função local `Badge` e usar o componente da UI padrão. Padronizar a formatação de moeda para `pt-BR`.

### 3. Melhoria na Persistência do Carrinho
- **Problema**: Limpeza do carrinho via `onClick` no checkout pode falhar ou ser inconsistente.
- **Solução**: Mover a lógica de `clearCart` para o `useEffect` da página de confirmação (`src/routes/store/confirmation.tsx`), garantindo que o carrinho só seja limpo após a conclusão bem-sucedida do pedido.

### 4. Responsividade e Estilo no Storefront
- **Problema**: Título Hero (`text-6xl md:text-8xl`) pode quebrar em telas muito pequenas.
- **Solução**: Ajustar escalas de texto responsivo para maior fluidez em dispositivos móveis.

### 5. Auditoria de Roteamento
- **Verificação**: Garantir que todos os links da sidebar e navegação apontem para rotas existentes e funcionais.

## Detalhes Técnicos
- **Framework**: Manter TanStack Start v1.
- **Tipagem**: Verificar se os tipos em `src/types/index.ts` estão 100% alinhados com o mock data.
- **Build**: Validar o build final com `bun run build:dev`.

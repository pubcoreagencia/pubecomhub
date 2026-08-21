# Plano de Implementação: PUB ECOM — PROTOTYPE B (Base Visual PUB Ops Hub)

O objetivo é reconstruir o **Prototype B** utilizando o projeto **PUB Ops Hub** como base visual e estrutural absoluta, adaptando-o para o domínio PUB ECOM com as regras de negócio definidas (Master, Lojistas, Fornecedores, Afiliados e Influencers).

## 🎨 Design System (Base PUB Ops Hub)
- **Tema**: Dark Mode por padrão (`oklch(0.145 0.004 285.8)`).
- **Cores**: Acento Esmeralda/Verde (`oklch(69.6% .17 162.5)`).
- **Tipografia**: Inter (ui-sans-serif).
- **Layout**: Sidebar lateral fixa com grupos categorizados, Header com filtros temporais, e Dashboard baseado em Grid de Cards com bordas sutis e fundo escuro elevado.

## 🏗️ Arquitetura e Estrutura
- **Isolamento**: Todo o código visual do B será mantido em `src/prototype-b/`.
- **Componentes B**: Reconstrução dos componentes baseados no Ops Hub (Shell, Sidebar, Header, Cards, Tabelas, Funis).
- **Navegação B**: Árvore de rotas em `src/routes/prototype-b/` apontando para a nova interface.
- **Storefront B**: Nova loja independente com estética premium alinhada ao design system dark.

## 🛠️ Etapas de Implementação

### 1. Base Visual e Estilos
- Criar `src/prototype-b/styles/theme-b.css` com as variáveis de cor e tokens do Ops Hub.
- Desenvolver o `ShellB.tsx` (Layout Principal) com a Sidebar e Header idênticos à referência.

### 2. Dashboard Master B
- Reconstruir o Dashboard com:
    - Cards de métricas superiores (Faturamento, Pedidos, Conversão, Lucro).
    - Gráficos de linha e barras (Faturamento/Pedidos por hora).
    - Tabelas de performance (Vendas por Loja).
    - Funil de Aquisição lateral (L1-L4).
    - Eventos em tempo real.

### 3. Módulos Operacionais
- Adaptar as telas de Pedidos, Produtos, Lojas e Fornecedores para o novo layout.
- Implementar a visualização de Influencers (50% lucro líquido) e Afiliados com o estilo de tabelas do Ops Hub.

### 4. Live Shop e Tracking
- Recriar o monitor ao vivo com o log de eventos e indicadores de tempo real.

### 5. Storefront B
- Desenvolver uma loja dark com fluxo simplificado: Home -> Produto -> Checkout -> Confirmação.

### 6. Roteamento e Acesso
- Garantir que `/prototype-b/dashboard` seja o ponto de entrada.
- Manter o Prototype A intacto em suas rotas originais.

## 📐 Critério de Sucesso
Ao abrir o Prototype B, o usuário deve sentir que entrou em um produto completamente diferente do A, com o nível de fidelidade e estética observados no PUB Ops Hub.

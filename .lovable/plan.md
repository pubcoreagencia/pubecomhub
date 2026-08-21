# Plano de Desenvolvimento: Protótipo PUB ECOM

O objetivo é criar um protótipo frontend completo, navegável e visualmente premium para a plataforma **PUB ECOM**, seguindo as referências do repositório oficial e as necessidades de gestão (Master), operacional (Lojistas) e promocional (Afiliados/Influenciadores).

## Arquitetura e Design
- **Estética:** Design SaaS moderno, limpo e profissional, utilizando a paleta de cores e componentes do Shadcn UI.
- **Navegação:** Implementar um Dashboard Master centralizado com menus laterais para acesso aos diversos módulos.
- **Responsividade:** Interface adaptada para desktop e mobile.

## Módulos do Protótipo (Prioridade)

### 1. Painel Master e Live Shop
- Dashboard consolidado com métricas de faturamento, pedidos e visitantes online.
- **Live Shop:** Visualização em tempo real do funil de vendas (Visitantes -> Carrinhos -> Checkout -> Vendas).

### 2. Gestão de Lojas e Pedidos
- Listagem de lojas ativas e mentoria.
- Fluxo de pedidos: rastreamento desde a compra na loja até o envio pelo fornecedor (Dropshipping centralizado).

### 3. Financeiro e Comissões
- Cálculo automático de lucro líquido (venda - custos - taxas).
- Módulo de repasses para Lojistas e Influenciadores (50% do lucro líquido).

### 4. Audience Engine e Marketing
- Simulador de criação de públicos personalizados (Audience Engine).
- Visualização de campanhas Meta/Google Ads e rastreamento UTM.

### 5. Storefront e Checkout
- Template de loja pública moderna com foco em conversão.
- Checkout transparente simulado.

## Detalhes Técnicos
- **Frontend:** TanStack Start com roteamento dinâmico.
- **Dados:** Utilização de dados mockados (fakes) que se comunicam entre as telas para simular uma aplicação real.
- **Integração:** Preparação da estrutura de tipos e componentes para futura conexão com a API Supabase/PostgREST.

## Próximos Passos
1. Configuração do layout principal (Dashboard Layout).
2. Implementação das telas de Dashboard Master e Live Shop.
3. Criação da listagem de Lojas e Pedidos.
4. Desenvolvimento dos módulos financeiros e de marketing.
5. Criação da Store pública de exemplo.

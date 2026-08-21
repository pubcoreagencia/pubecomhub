# Plano de Desenvolvimento: Protótipo PUB ECOM

O objetivo é criar um protótipo frontend completo, navegável e visualmente premium para a plataforma **PUB ECOM**, seguindo as referências do repositório oficial e as necessidades de gestão (Master), operacional (Lojistas) e promocional (Afiliados/Influenciadores).

## Arquitetura e Design
- **Estética:** Design SaaS moderno, limpo e profissional, utilizando a paleta de cores e componentes do Shadcn UI.
- **Navegação:** Implementar um Dashboard Master centralizado com menus laterais para acesso aos diversos módulos.
- **Responsividade:** Interface adaptada para desktop e mobile.

## Módulos do Protótipo (Prioridade)

### 1. Dashboard Master e Live Shop
- Visão centralizada da PUB ECOM como Operador Central.
- **Live Shop:** Funil em tempo real (Visitantes -> Carrinhos -> Checkout -> Vendas) com identificação da loja de origem.

### 2. Lojas e Pedidos (Dropshipping Centralizado)
- Fluxo simulado: Compra na Loja -> PUB ECOM compra do Fornecedor -> Fornecedor envia ao Cliente.
- Listagem e gestão de Lojas/Mentoria.

### 3. Financeiro e Comissões
- Cálculo detalhado: Faturamento Bruto, Custos (Produto, Frete, Taxas, Descontos), Lucro Líquido e Margem.
- **Influenciadores:** Repasse de 50% do lucro líquido.
- **Afiliados:** Comissões configuráveis.
- Resultado líquido final da PUB ECOM.

### 4. Audience Engine e Marketing
- Públicos por níveis (L1: Page View a L4: Purchase).
- Janelas temporais (1D a 30D) e exclusão automática de compradores.
- Rastreamento UTM e dashboards de Ads.

### 5. Storefront Pública
- Experiência completa de compra: Home -> Produto -> Checkout Transparente -> Confirmação.

## Detalhes Técnicos e Qualidade
- **Mock Data Centralizado:** Uma venda simulada reflete em todos os módulos (Financeiro, Ranking, Live Shop, etc.).
- **Interatividade:** Menus navegáveis, filtros em tabelas, estados realistas e uso de modais/drawers.
- **Arquitetura:** Camada frontend sobre a estrutura do repositório oficial, sem alterações no backend ou banco.

## Prioridade de Execução
MASTER → LIVE SHOP → LOJAS → PEDIDOS → FINANCEIRO → TRACKING/AUDIENCE → ADS → AFILIADOS/INFLUENCERS → STORE → CHECKOUT.


## Próximos Passos
1. Configuração do layout principal (Dashboard Layout).
2. Implementação das telas de Dashboard Master e Live Shop.
3. Criação da listagem de Lojas e Pedidos.
4. Desenvolvimento dos módulos financeiros e de marketing.
5. Criação da Store pública de exemplo.

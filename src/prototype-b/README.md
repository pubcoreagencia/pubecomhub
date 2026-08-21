# PUB ECOM — PROTOTYPE B

Este é o novo protótipo do PUB ECOM, projetado para ser uma evolução independente do Prototype A.

## Arquitetura Proposta

A arquitetura segue o padrão solicitado pelo usuário para garantir escalabilidade e separação de preocupações:

```text
UI (React Components / Routes)
↓
Services (Business Logic / Orchestration)
↓
Repositories (Data Access Abstraction)
↓
Mock/API (Data Source)
```

## Estrutura de Pastas

- `src/pub-ecom/types/`: Definições de interfaces e tipos.
- `src/pub-ecom/data/`: Mock data e fontes de dados.
- `src/pub-ecom/repositories/`: Classes/Funções de acesso a dados.
- `src/pub-ecom/services/`: Lógica de negócio (cálculos de comissões, financeiro, etc).
- `src/pub-ecom/components/`: Componentes UI reutilizáveis específicos do Prototype B.
- `src/pub-ecom/routes/`: Definições de rotas (serão mapeadas no TanStack Router).

## Regras de Negócio Implementadas

1. **Influencers**: Recebem 50% do lucro líquido das vendas atribuídas.
2. **Afiliados**: Recebem um percentual configurável sobre a venda.
3. **Audience Engine**: Funil de 4 níveis (L1 a L4).
4. **Financeiro**: Detalhamento de faturamento, custos, frete, taxas e resultados.

# Plano de Implementação — FASE 2C: Execução Real do Shopee Ingestion

Este plano descreve a transformação do pipeline de ingestão de catálogo em um sistema funcional utilizando automação de browser (Playwright) via abstração de Workers.

## 1. Arquitetura de Execução
Criar uma camada de abstração para separar a lógica do Adapter (negócio/mapeamento) da execução técnica (scraping/automacao).

- **ExecutionProvider**: Interface genérica para busca de dados brutos.
- **ShopeeExecutionProvider**: Implementação específica que orquestra o Worker.
- **MockExecutionProvider**: Para testes e desenvolvimento sem dependência externa.

## 2. Worker de Ingestão (Playwright)
Implementar um Worker isolado (`ShopeeWorker.server.ts`) que utilize Playwright para contornar as proteções da Shopee.

- O Worker será chamado via Server Function em ambiente Node.
- Utilizará interceptação de rede para capturar os JSONs da API interna da Shopee (`search_items`).
- Suportará paginação (até 100 produtos por importação).
- Implementará SSRF protection e validação de domínio.

## 3. Integração com ShopeeAdapter
Refatorar o `ShopeeAdapter` para delegar a descoberta ao `ShopeeExecutionProvider`.

- Manter o mapeamento de `RawProduct`.
- Tratar erros de execução (timeout, bloqueio) sem quebrar o pipeline.

## 4. Detalhes Técnicos
- **Configuração**: 100 produtos máx, 30 por página, 30s timeout.
- **Segurança**: Bloqueio de IPs privados e esquemas não-HTTP.
- **Persistência**: O pipeline continuará alimentando o `MasterProductRepository`.

## 5. Validação e Teste Real
- Testar com a URL: `https://shopee.com.br/shop/286044738` (Lilicababy - Loja verificada nos testes anteriores).
- Relatório de sucesso: total encontrado vs válidos.

## Arquivos a serem modificados/criados:
- `src/lib/ingestion/execution/ExecutionProvider.ts` (Novo)
- `src/lib/ingestion/execution/ShopeeExecutionProvider.ts` (Novo)
- `src/lib/ingestion/execution/MockExecutionProvider.ts` (Novo)
- `src/lib/ingestion/workers/ShopeeWorker.server.ts` (Novo)
- `src/lib/ingestion/adapters/ShopeeAdapter.ts` (Refatoração)
- `PROJECT_CONTEXT.md` & `CHANGELOG.md` (Atualização)

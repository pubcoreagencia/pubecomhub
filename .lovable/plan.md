# Plano de Implementação: Fase 2E - Worker Externo de Catalog Ingestion

Implementação de uma infraestrutura de execução externa via Cloudflare Browser Run para resolver bloqueios de scraping na Shopee e centralizar a automação de browser.

## Ações Imediatas
- Criar `src/lib/ingestion/execution/CloudflareExecutionProvider.ts` para integração server-to-server.
- Refatorar `src/lib/ingestion/execution/ShopeeExecutionProvider.ts` para alternar entre Worker local e Externo.
- Adicionar suporte a tokens de autenticação via secrets.

## Detalhes Técnicos

### 1. Novo Provider: CloudflareExecutionProvider
Responsável por realizar a chamada HTTP POST para o Worker externo.
- **Endpoint**: Configurado via env `CATALOG_WORKER_URL`.
- **Auth**: Header `Authorization: Bearer <TOKEN>`.
- **Payload**: `{ url, limit, pageSize }`.

### 2. Refatoração ShopeeExecutionProvider
- Lógica de decisão: Se `CATALOG_WORKER_URL` estiver presente, usa `CloudflareExecutionProvider`.
- Fallback: Mantém `runShopeeWorker` local para desenvolvimento, mas registra o erro real se falhar em produção.

### 3. Integração e Segurança
- Adição de segredos via `add_secret`: `CATALOG_WORKER_URL` e `CATALOG_WORKER_TOKEN`.
- Validação estrita de URL no lado servidor do PUB ECOM antes do repasse ao Worker.

### 4. Interface e Feedback
- Atualização do `CatalogIngestion.tsx` para exibir metadados originados do Worker Cloudflare (ex: "Provider: Cloudflare Browser Run").
- Registro de logs de auditoria de execução.

## Próximos Passos
1. Configuração do ambiente externo (Worker Cloudflare - fora deste escopo direto de código, mas preparado para consumo).
2. Teste de integração com URL real da Shopee.
3. Documentação no `PROJECT_CONTEXT.md` e `CHANGELOG.md`.

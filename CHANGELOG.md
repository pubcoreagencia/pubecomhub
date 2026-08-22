# Changelog - PUB ECOM HUB

## [1.7.1] - 2026-08-22
### Segurança
- **Correção de Vulnerabilidade CVE-2026-59870**: Atualizado `@tanstack/react-start` de `1.168.32` para `1.168.48` e dependências relacionadas (`react-router`, `router-plugin`) para mitigar vulnerabilidade de DoS no `js-yaml`.
- **Lockfile**: Gerado `bun.lock` em formato texto para melhor auditabilidade de segurança.

## [1.7.0] - 2026-08-22
### Adicionado
- **Melhoria UX de Diagnóstico**: Adicionada exibição literal das variáveis de ambiente necessárias (`VITE_CATALOG_API_URL`, `VITE_CATALOG_API_TOKEN`) no toast de erro 401 da `CatalogIngestion`.
- **Fase 2G - Resolução de CORS e Preflight**:
  - Implementação de camada CORS centralizada no `catalog-worker` (`cors.ts`).
  - Suporte a requisições `OPTIONS` (Preflight) retornando status 204.
  - Headers `Access-Control-Allow-Origin` configurados para `localhost`, `lovable.app` e domínio de produção.
  - Garantia de headers CORS em todas as respostas (401 Unauthorized, 404 Not Found, etc).
  - Suporte explícito aos headers `Authorization` e `Content-Type`.
  - Suite de testes unitários para validação de fluxos CORS.

## [1.6.5] - 2026-08-21
### Adicionado
- **Fase 2F.9 - Diagnóstico de Limites do Cloudflare Browser Run**:
  - Implementação do endpoint `GET /debug/browser` no `catalog-worker` para expor `playwright.limits()`, `sessions()` e `history()`.
  - Proteção do endpoint de debug via `CATALOG_WORKER_TOKEN`.
  - Atualização da interface principal (`/`) com o dashboard de diagnóstico de HTTP 429.
  - Validação de build e empacotamento (`esbuild`) com sucesso no worker.

## [1.6.4] - 2026-08-21
### Adicionado
- **Fase 2F.4 - Health Check do PUB ECOM Catalog Worker**:
  - Formalização do endpoint `/health` público (sem token) para monitoramento.
  - Validação técnica completa em `catalog-worker/`: `npm install`, `npm run typecheck`, `npm run build` e `wrangler deploy --dry-run`.
  - Atualização da página inicial `/` refletindo o novo status da infraestrutura.

...

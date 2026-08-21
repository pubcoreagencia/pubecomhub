# Changelog - PUB ECOM HUB

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

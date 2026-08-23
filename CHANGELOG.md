# Changelog - PUB ECOM HUB

## [1.7.2] - 2026-08-22
### Segurança
- **Correção de 10 findings de segurança selecionados**:
  - **Escalonamento de papel (profiles)**: Triggers `prevent_role_escalation` e `enforce_profile_insert_role` + helper `is_master()` impedem que usuários comuns se promovam a MASTER.
  - **RLS endurecido**: Policies permissivas removidas de `customers`, `marketing_events`, `master_products`, `products` e `suppliers`; acesso agora restrito a MASTER, donos de loja/fornecedor e relacionamentos via pedidos.
  - **Views seguras**: `public_store_products`, `available_master_products` e `public_suppliers` expõem apenas colunas seguras para browsing público/autenticado.
  - **SSRF no Catalog Worker**: Validação estrita de hostname (allow-list Shopee) no `ShopeeAdapter` e dentro do worker antes de qualquer navegação do browser headless.
  - **Verificado**: Proxy de catálogo autenticado via JWT, server functions com `requireSupabaseAuth`, e rotas de API sem import privilegiado em top-level.
  - Suite de testes de segurança: 69/69 passando.

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

## [2026-08-23] - Segurança e Acesso Administrativo
- **Fix**: Impedido que usuários alterem a própria role via RLS na tabela `profiles`.
- **Hardening**: Restrita permissão de execução da função `has_role` para `service_role`.
- **Fix**: Configurada `security_invoker = true` em views sensíveis para evitar vazamento de dados via planejador de consulta.
- **UI**: Atualizado e-mail padrão de login para `contato.pubcore@gmail.com`.
- **Docs**: Atualizado `PROJECT_CONTEXT.md` com as novas credenciais e baseline de segurança.

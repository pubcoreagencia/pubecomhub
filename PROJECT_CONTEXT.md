# Project Context — PUB ECOM / PubecomHub

## Arquitetura do Sistema

- **Frontend / Hub:** TanStack Start, React 19, TailwindCSS v4, Vite 8, Nitro (Cloudflare module preset).
- **Backend / Catalog Worker:** Cloudflare Worker com D1 Master Catalog persistido (`pub-ecom-catalog-worker`).
- **Scraper Authority:** `pub-shopee-scraper` (Apify / Browser Run).
- **Database:** Supabase PostgreSQL com Row Level Security (RLS) e isolamento multi-tenant completo.

## Baseline de Segurança e Autorização (Hardening Validado)

- **RLS Rigoroso & Multi-Tenant (PostgreSQL Engine):**
  - Isolamento atômico em `marketing_events`, `customers`, `products`, `master_products`, `suppliers` e `orders`.
  - Inserções cross-tenant autenticadas são bloqueadas em nível de banco.
  - Tracking anônimo e checkout público validam a existência e consistência das lojas e clientes.
- **Hardening de Funções & Views:**
  - Funções `SECURITY DEFINER` (`is_master`, `has_role`, `prevent_role_escalation`) têm execução restrita a `service_role`.
  - Views públicas utilizam `security_invoker = true` (PostgreSQL 15+), garantindo que RLS seja aplicado corretamente durante o planejamento.
- **Isolamento de Custos e Margens:**
  - `cost` e `profit_margin` em `products` acessíveis somente pelo dono da loja e `MASTER`.
  - `supplier_cost` em `master_products` acessível somente por `MASTER` e fornecedor proprietário (`suppliers.profile_id = auth.uid()`).
  - Views seguras sanitizadas: `public_store_products`, `available_master_products`, `public_suppliers`.
- **BFF / Proxy Server-Side:** Comunicação com o Catalog Worker através de proxy server-side autenticado com `CATALOG_WORKER_TOKEN`.

## Recuperação de Acesso Master

- **Usuário:** `contato.pubcore@gmail.com`
- **Role:** `MASTER`
- **Procedimento:** O usuário MASTER pode alterar sua senha diretamente em `/dashboard/settings` após o login com a credencial temporária. Em caso de perda total, o reset deve ser feito via `supabaseAdmin` por um agente autorizado.
- **Segurança:** O acesso é protegido por RLS e exige a role `MASTER` na tabela `public.profiles`. Alterações de senha master são auditadas e protegidas por middleware de servidor.

## Investigação do Fluxo de Importação de Catálogo

### 1. Componentes e Rotas Envolvidos
- **Frontend / Cliente:** A página de importação `UrlProductImportPage.tsx` ([`UrlProductImportPage.tsx`](file:///C:/Users/Matheus Paes/pubecomhub/src/components/import/UrlProductImportPage.tsx)) envia requisições usando a classe utilitária `UrlImportClient` ([`urlImport.ts`](file:///C:/Users/Matheus Paes/pubecomhub/src/lib/api/urlImport.ts)).
  - **Rota no browser:** `POST /api/catalog/import/analyze`
- **Hub Proxy (BFF):** O proxy no servidor em `catalogProxy.ts` ([`catalogProxy.ts`](file:///C:/Users/Matheus Paes/pubecomhub/src/server/catalogProxy.ts)) autentica o usuário via sessão Supabase. Se autenticado, traduz o caminho e repassa a requisição para o Catalog Worker com o cabeçalho `Authorization: Bearer <CATALOG_WORKER_TOKEN>`.
  - **Mapeamento de Rotas:** `/api/catalog/import/analyze` -> `/v1/catalog/import/analyze`
- **Backend (Catalog Worker):** A implementação em `catalog-worker/src/index.ts` ([`index.ts`](file:///C:/Users/Matheus Paes/pubecomhub/catalog-worker/src/index.ts)) gerencia as requisições de importação estruturada (Analyze & Commit).
  - **Rotas Internas:**
    - `POST /v1/catalog/import/analyze`: Valida URL, verifica SSRF via `isAllowedTargetUrl()`, resolve o provedor e analisa a página do produto retornando uma resposta JSON estruturada (status 200).
    - `POST /v1/catalog/import/commit`: Persiste o produto importado no banco D1 associado (`env.DB`).

### 2. Autenticação e Credenciais
- **Hub (PubecomHub):** Valida a sessão Supabase do usuário (JWT Bearer Token do frontend).
- **Catalog Worker:** Exige autenticação baseada em token Bearer. O token interno `CATALOG_WORKER_TOKEN` está configurado nas variáveis de ambiente dos Workers e o BFF anexa-o de forma transparente às requisições autenticadas de upstream.

### 3. Comportamento Esperado e Status Codes
- **401 Unauthorized:** Retornado pelo Hub se o usuário do browser não estiver autenticado com uma sessão Supabase válida, ou pelo Catalog Worker se a chamada direta não contiver o `CATALOG_WORKER_TOKEN`.
- **404 Not Found:** O Catalog Worker possui uma resposta de fallback genérica ao final de seu loop de rotas: `return new Response("Not Found", { status: 404 })`. Se a URL pathname não casar perfeitamente com os manipuladores registrados (incluindo barras adicionais ou formatos incorretos), o worker retorna 404.
- **200 OK:** Sucesso no fluxo de análise, retornando o objeto de visualização do produto.

### 4. Causa Raiz Identificada & Deploy Correto
- **Problema de dist desatualizado:** O arquivo `dist/index.js` compilado e implantado anteriormente no Catalog Worker estava desatualizado e não continha as rotas de importação, fazendo com que qualquer chamada a `/v1/catalog/import/analyze` caísse no fallback de 404, embora a lógica estivesse correta no código-fonte `src/index.ts`.
- **Wrangler / Deploy Issues:** Houve conflitos onde o Wrangler tentava ler configurações de escopos e diretórios incorretos sem flags adequadas.
- **Solução Aplicada:**
  - Build explícito e deploy do Catalog Worker a partir de seu diretório usando a configuração correta (`--config wrangler.toml` / `npm run build` & `npm run deploy`).
  - Verificação de que o novo `dist/index.js` de fato possui as rotas e os fluxos `/v1/catalog/import/analyze` e `/v1/catalog/import/commit`.
  - Deployment bem sucedido do Catalog Worker (Versão/ID: `2509582e-7c96-4769-b6e6-9a8feec0ed76`) com bindings de D1 e do browser.
  - Deployment limpo do Hub Worker (Versão/ID: `8cedc3bd-12e3-4de3-9b85-e42f1c442c1a`) após a remoção de todos os logs temporários de depuração (ex.: `IMPORT_DEBUG` e `IMPORT_TRACE`).

### 5. Estado Atual do Problema
- **Problema Não Resolvido:** Apesar de o Catalog Worker e Hub estarem rodando as versões corretas e compiladas com as rotas, **o console do navegador do usuário final ainda exibe HTTP 404 Not Found** ao enviar o formulário para analisar produtos.
- **Diretrizes para Próxima Investigação:** A investigação seguinte deve identificar em qual camada ou sob quais circunstâncias o 404 atual é gerado (ex.: presença de uma barra inclinada no final `/api/catalog/import/analyze/`, manipulações de caminhos por parte de frameworks frontend, ou roteamento interno do Cloudflare).


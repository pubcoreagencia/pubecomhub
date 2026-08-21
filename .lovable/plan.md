# Plano de Implementação: Fase 2F - PUB ECOM CATALOG WORKER

Criação da estrutura base para o worker independente que utilizará Cloudflare Browser Run.

## Ações Imediatas
- Criar diretório `external-worker/` (simulação de repositório independente).
- Configurar `wrangler.toml` base para Cloudflare Workers com browser binding.
- Implementar `src/index.ts` no worker com suporte a Playwright Cloudflare.

## Detalhes Técnicos

### 1. Configuração do Worker
- **Runtime**: Cloudflare Workers com `nodejs_compat`.
- **Binding**: `browser` para acesso ao Chromium.
- **Dependencies**: `@cloudflare/playwright`.

### 2. Endpoints do Worker
- `POST /ingestion/shopee`: Recebe URL, valida domínio e executa o browser.
- **Auth**: Bearer Token validation.

### 3. Lógica de Extração
- Uso de `page.goto` e `page.evaluate` para captura de `shopid` e itens.
- Retorno de `RawProduct[]` estruturado.

### 4. Segurança e Observabilidade
- Validação de hostname (SSRF protection).
- Logs de execução (Time, Pages, Items).

## Próximos Passos
1. Setup do boilerplate do worker.
2. Implementação do handler `/ingestion/shopee`.
3. Documentação e README do worker.

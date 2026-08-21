import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="p-8 font-mono text-sm whitespace-pre-wrap bg-background text-foreground">
      {`FASE 2F.4 — HEALTH CHECK DO PUB ECOM CATALOG WORKER

REPOSITÓRIO:

https://github.com/pubcoreagencia/pub-ecom-catalog-worker

OBJETIVO

Adicionar somente um health check ao Worker já deployado.

NÃO alterar:

* lógica de ingestão Shopee;
* Playwright;
* Browser Run;
* endpoint \`/ingestion/shopee\`;
* autenticação existente;
* contratos de \`RawProduct\`;
* arquitetura.

## IMPLEMENTAÇÃO

Adicionar:

\`GET /health\`

Resposta HTTP 200:

\`\`\`json
{
  "ok": true,
  "service": "pub-ecom-catalog-worker"
}
\`\`\`

Content-Type:

\`application/json\`

O endpoint \`/health\` deve funcionar sem Bearer Token.

Manter:

\`POST /ingestion/shopee\`

protegido por:

\`Authorization: Bearer <CATALOG_WORKER_TOKEN>\`

## TESTES

Executar localmente:

* typecheck;
* build;
* wrangler dry-run.

Depois atualizar o repositório.

NÃO alterar secrets.

NÃO criar novos secrets.

## GIT

Commit:

\`fix: add catalog worker health endpoint\`

Push para:

\`pubcoreagencia/pub-ecom-catalog-worker\`

## RESULTADO

Ao terminar, informar somente:

* arquivo alterado;
* typecheck;
* build;
* commit;
* branch.

Não fazer o teste real Shopee nesta etapa.
`}
    </div>
  ),
});

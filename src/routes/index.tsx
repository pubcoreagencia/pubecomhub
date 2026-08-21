import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="p-8 font-mono text-sm whitespace-pre-wrap bg-background text-foreground">
{`FASE 2F.7 — DIAGNÓSTICO REAL DA RESOLUÇÃO DE SHOPID

REPOSITÓRIO:

https://github.com/pubcoreagencia/pub-ecom-catalog-worker

NÃO adicionar novas heurísticas nesta etapa.

O Worker já executa Browser Run corretamente, mas:

\`https://shopee.com.br/9r18ht6m88\`

continua retornando:

\`shopIdStrategy: resolution-exhausted\`

OBJETIVO:

Descobrir exatamente o que a chamada \`get_shop_base_v2\` está retornando.

## 1. INSTRUMENTAR A SHOP-BASE API

Manter:

\`POST /api/v4/shop/get_shop_base_v2\`

Payload:

\`\`\`json
{
  "request_source": "mobile_shop_home_page",
  "livestream_params": {},
  "username": "<friendly-username>"
}
\`\`\`

Após a chamada, capturar internamente:

* username;
* HTTP status;
* content-type;
* tamanho aproximado da resposta;
* JSON válido ou não;
* chaves de primeiro nível;
* se existe \`data\`;
* se existe \`data.shopid\`;
* mensagem de erro, quando houver.

NÃO registrar:

* cookies;
* authorization;
* CATALOG_WORKER_TOKEN;
* conteúdo sensível de headers.

## 2. METADATA DE DIAGNÓSTICO

Adicionar ao response metadata:

\`\`\`json
{
  "shopIdStrategy": "shop-base-username",
  "shopBaseStatus": 200,
  "shopBaseHasData": true,
  "shopBaseHasShopId": false
}
\`\`\`

Em caso de erro:

\`\`\`json
{
  "shopIdStrategy": "shop-base-username-error",
  "shopBaseStatus": 403,
  "shopBaseHasData": false,
  "shopBaseHasShopId": false
}
\`\`\`

Não retornar o corpo completo da resposta da Shopee ao cliente.

## 3. URL DE DIAGNÓSTICO

Também registrar:

* \`page.url()\`
* URL original;
* username extraído.

Isso é importante para descobrir se a Shopee redireciona a loja.

## 4. FALLBACK DOCUMENTADO

Depois da chamada POST, NÃO implementar outra estratégia nova.

Somente testar, se necessário, a variante GET documentada:

\`/api/v4/shop/get_shop_base?username=<username>\`

Registrar:

* HTTP status;
* se retornou \`data.shopid\`.

Não usar proxy.
Não usar stealth.
Não usar CAPTCHA bypass.

## 5. TESTE

Executar em produção com:

\`\`\`json
{
  "url": "https://shopee.com.br/9r18ht6m88",
  "limit": 1,
  "pageSize": 1
}
\`\`\`

## 6. RESULTADO

O relatório deve informar:

\`\`\`text
Original URL:
Final page URL:
Username:
POST status:
POST data:
POST shopid:
GET status:
GET shopid:
Final strategy:
Products:
Errors:
\`\`\`

## 7. GIT

Executar:

* typecheck;
* build;
* deploy.

Commit:

\`debug: inspect shopee shop base resolution\`

Não alterar o restante da arquitetura.
`}
    </div>
  ),
});
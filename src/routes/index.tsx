import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="p-8 font-mono text-sm whitespace-pre-wrap bg-background text-foreground">
{`FASE 2F.6 — RESOLUÇÃO DE SHOPID POR USERNAME VIA API PÚBLICA DA SHOPEE

REPOSITÓRIO:

https://github.com/pubcoreagencia/pub-ecom-catalog-worker

ESTADO ATUAL

Cloudflare Worker está operacional.

Confirmado:

* \`/health\` → 200
* Browser Run executa
* autenticação Bearer funciona
* \`provider = cloudflare-browser-run\`

O blocker atual é:

\`https://shopee.com.br/9r18ht6m88\`

retorna:

\`resolution-exhausted\`

OBJETIVO

Resolver o \`ShopID\` de URLs amigáveis usando o identificador amigável como \`username\`, antes de tentar análise do HTML.

REFERÊNCIA TÉCNICA

Há referências atuais de integração com Shopee v4 que documentam o endpoint:

\`/api/v4/shop/get_shop_base_v2\`

com suporte a \`username\` ou \`shopid\`.

Também há projetos GitHub que utilizam endpoints da API v4 da Shopee, incluindo \`search_items\`.

## 1. EXTRAIR USERNAME

Para:

\`https://shopee.com.br/9r18ht6m88\`

extrair:

\`9r18ht6m88\`

Para:

\`https://shopee.com.br/9r18ht6m88#product_list\`

primeiro remover o fragmento e extrair:

\`9r18ht6m88\`

Não confundir username com ShopID.

## 2. RESOLVER SHOPID

Depois de abrir a página com Browser Run, executar uma chamada pública no contexto da própria página para:

\`https://shopee.com.br/api/v4/shop/get_shop_base_v2\`

Usar \`POST\` con JSON contendo o \`username\`.

Payload inicial:

\`\`\`json
{
  "username": "9r18ht6m88",
  "request_source": "mobile_shop_home_page",
  "livestream_params": {}
}
\`\`\`

Aceitar variações de envelope da resposta.

Procurar:

\`data.shopid\`

ou:

\`shopid\`

ou estrutura equivalente.

## 3. VALIDAR O SHOPID

Não aceitar qualquer número arbitrário encontrado no HTML.

O ShopID somente deve ser aceito se vier de uma resposta coerente do endpoint de shop base.

Registrar internamente:

\`shopIdStrategy = "shop-base-username"\`

## 4. FALLBACKS

Ordem:

\`\`\`text
1. /shop/{numericId}
2. API /api/v4/shop/get_shop_base_v2 usando username
3. canonical / og:url
4. JSON runtime
5. data-shopid / scripts
6. falha explícita
\`\`\`

## 5. DEPOIS DO SHOPID

Somente depois de obter o ShopID real:

chamar:

\`/api/v4/search/search_items\`

com o ShopID resolvido.

Teste inicial:

\`\`\`json
{
  "url": "https://shopee.com.br/9r18ht6m88",
  "limit": 1,
  "pageSize": 1
}
\`\`\`

## 6. DIAGNÓSTICO

Adicionar metadata:

\`\`\`json
{
  "shopIdStrategy": "shop-base-username"
}
\`\`\`

Em caso de erro, informar:

* HTTP da shop-base API;
* username;
* ShopID encontrado;
* estratégia usada;
* erro real.

Não registrar cookies, tokens ou headers sensíveis.

## 7. SEGURANÇA

Manter:

* SSRF protection;
* domínio exclusivamente \`shopee.com.br\`;
* Bearer Token do Worker;
* nenhuma credencial pessoal da Shopee;
* nenhum CAPTCHA bypass;
* nenhum stealth;
* nenhum fingerprint spoofing;
* nenhuma rotação de proxy para evasão.

## 8. TESTES

Testar:

### URL amigável

\`https://shopee.com.br/9r18ht6m88\`

### URL numérica

\`https://shopee.com.br/shop/286044738\`

Critério de aceite:

\`\`\`text
URL
↓
username
↓
shop/get_shop_base_v2
↓
ShopID real
↓
search_items
↓
1 produto real
\`\`\`

Não declarar sucesso se apenas o ShopID for encontrado.

## 9. GITHUB-FIRST

Antes de concluir, consultar os projetos GitHub encontrados sobre Shopee v4 e registrar no README ou PROJECT_CONTEXT:

* projeto consultado;
* endpoint aproveitado;
* licença;
* o que foi usado como referência.

Não copiar código sem análise de licença.

## 10. VALIDAÇÃO

Executar:

\`\`\`text
npm run typecheck
npm run build
npx wrangler deploy
\`\`\`

Depois testar produção.

## 11. GIT

Commit:

\`fix: resolve shopee shop id by username\`

Push para:

\`pubcoreagencia/pub-ecom-catalog-worker\`

## RESULTADO FINAL

Informar:

\`\`\`text
URL:
Username:
ShopID:
ShopID Strategy:
HTTP shop-base:
HTTP search_items:
Products:
Pages:
Execution time:
Status:
\`\`\`

O objetivo não é apenas descobrir o ShopID.

O objetivo é:

\`URL amigável → ShopID real → produto real\`.
`}
    </div>
  ),
});

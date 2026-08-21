import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="p-8 font-mono text-sm whitespace-pre-wrap bg-background text-foreground">
{`FASE 2F.5 — RESOLUÇÃO REAL DE SHOPID PARA URL AMIGÁVEL DA SHOPEE

REPOSITÓRIO:

https://github.com/pubcoreagencia/pub-ecom-catalog-worker

ESTADO ATUAL

O Worker Cloudflare está funcionando.

Teste real já comprovou:

* Worker público acessível;
* autenticação funcionando;
* Browser Run executando;
* execução real ~5 segundos;
* provider \`cloudflare-browser-run\`.

O teste:

\`https://shopee.com.br/9r18ht6m88\`

falhou com:

\`unable to resolve Shopee ShopID from the supplied store URL\`

OBJETIVO

Corrigir SOMENTE a resolução de \`ShopID\` para URLs amigáveis da Shopee.

NÃO alterar:

* contrato \`/ingestion/shopee\`;
* autenticação;
* Browser Run;
* pricing;
* PUB ECOM;
* pubecomhub;
* estrutura de RawProduct.

## 1. URLS SUPORTADAS

Manter suporte para:

\`\`\`text
https://shopee.com.br/shop/286044738
\`\`\`

e adicionar suporte para:

\`\`\`text
https://shopee.com.br/9r18ht6m88
\`\`\`

## 2. RESOLUÇÃO DE SHOPID

Para URL amigável:

1. abrir a página com Browser Run;
2. inspecionar o HTML/DOM e dados públicos disponíveis;
3. procurar ShopID em estruturas de dados carregadas pela página;
4. procurar IDs em scripts JSON embutidos;
5. procurar atributos/data layers;
6. se necessário, observar respostas de rede da própria página;
7. identificar o ShopID real;
8. só então chamar \`search_items\`.

Não depender exclusivamente de:

\`\`\`text
regex /shopid/ no HTML
\`\`\`

## 3. NÃO USAR BYPASS

Não implementar:

* CAPTCHA bypass;
* stealth;
* fingerprint spoofing;
* anti-detection;
* proxy rotation;
* contorno de autenticação.

Usar apenas dados acessíveis pela navegação normal.

## 4. DIAGNÓSTICO

Adicionar logs server-side temporários e seguros para:

* URL limpa;
* método de resolução usado;
* ShopID encontrado ou não;
* quantidade de respostas de rede relevantes;
* status HTTP da página.

NÃO registrar cookies ou tokens.

## 5. FALLBACK

Criar estratégia ordenada:

\`\`\`text
1. /shop/{numericId}
2. dados estruturados da página
3. scripts JSON
4. respostas de rede públicas
5. falha explícita
\`\`\`

Se não conseguir resolver:

retornar:

\`\`\`json
{
  "success": false,
  "source": "shopee",
  "shopId": null,
  "items": [],
  "metadata": {
    "provider": "cloudflare-browser-run"
  },
  "errors": [
    "unable to resolve Shopee ShopID"
  ]
}
\`\`\`

## 6. TESTES

Testar obrigatoriamente:

### URL numérica

\`https://shopee.com.br/shop/286044738\`

### URL amigável real

\`https://shopee.com.br/9r18ht6m88\`

Não usar mock.

Para cada uma registrar:

* ShopID;
* páginas;
* produtos;
* duração;
* erro.

## 7. CRITÉRIO DE ACEITE

A etapa só é concluída se a URL amigável:

\`https://shopee.com.br/9r18ht6m88\`

for convertida para um ShopID real e o worker conseguir avançar para a chamada de catálogo.

NÃO declarar sucesso caso apenas a URL seja aceita.

O objetivo é:

\`\`\`text
URL amigável
↓
ShopID REAL
↓
search_items
↓
produtos REAIS
\`\`\`

## 8. GIT

Commit:

\`fix: resolve friendly shopee shop urls\`

Push para:

\`pubcoreagencia/pub-ecom-catalog-worker\`

Executar:

* typecheck;
* build;
* deploy.

No relatório final informar:

\`\`\`text
Friendly URL:
ShopID:
Products:
Pages:
Execution time:
Status:
\`\`\`
`}
    </div>
  ),
});

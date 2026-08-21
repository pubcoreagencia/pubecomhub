# Plano de Implementação - Fase 2F.5: Resolução de ShopID Shopee

Objetivo: Corrigir a resolução de ShopID para URLs amigáveis (friendly URLs) no `catalog-worker` usando Cloudflare Browser Run.

## 1. Melhoria do Shopee Worker (catalog-worker)

- **Extração de ShopID**: Implementar lógica no `catalog-worker/src/index.ts` para identificar o ShopID em URLs amigáveis.
- **Estratégia de Resolução**:
  1. Verificar se o ShopID já está na URL (`/shop/{id}`).
  2. Caso contrário, navegar até a página usando Browser Run.
  3. Extrair ShopID do DOM (procurar em `window.__PRELOADED_STATE__`, scripts JSON ou metadados).
  4. Implementar logs de diagnóstico para rastrear o sucesso/falha da resolução.
- **Fallback**: Retornar erro padronizado caso a resolução falhe.

## 2. Validação Técnica

- **Typecheck & Build**: Garantir que o worker compila corretamente após as alterações.
- **Dry-run Deploy**: Validar o pacote final via Wrangler.

## Detalhes Técnicos

- Alteração no arquivo `catalog-worker/src/index.ts`.
- Manutenção da segurança SSRF e autenticação Bearer.
- Uso exclusivo de dados públicos acessíveis via navegação normal.

## Critérios de Aceite

- URL numérica `https://shopee.com.br/shop/286044738` continua funcionando.
- URL amigável `https://shopee.com.br/9r18ht6m88` é resolvida para um ShopID real.
- O worker retorna produtos reais após a resolução do ID.

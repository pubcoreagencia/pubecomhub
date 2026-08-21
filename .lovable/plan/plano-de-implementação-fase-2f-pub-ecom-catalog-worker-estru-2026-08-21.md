# Plano de Implementação: Fase 2F - PUB ECOM CATALOG WORKER (Estrutura e Contrato)

Este plano foca na preparação da estrutura do Worker independente e na atualização da documentação de integração no PUB ECOM HUB, sem alterar o código funcional do sistema principal nesta etapa.

## Ações
1. **Scaffolding do Worker**: Criar diretório `catalog-worker/` com a estrutura base de um Cloudflare Worker.
2. **Contrato de API**: Definir `catalog-worker/src/index.ts` com o esqueleto do endpoint `/ingestion/shopee` e validação de token.
3. **Configuração Wrangler**: Criar `catalog-worker/wrangler.toml` com as configurações de browser binding e compatibilidade necessárias.
4. **Documentação de Integração**: Atualizar `PROJECT_CONTEXT.md` com a URL planejada do worker e o contrato da API.

## Detalhes Técnicos
- **Worker Environment**: Configuração para `nodejs_compat` e `browser` binding.
- **Segurança**: Lógica de validação de hostname para Shopee BR.
- **Observabilidade**: Estrutura de resposta JSON padronizada com metadados de execução.

## Próximos Passos
1. Gerar os arquivos do boilerplate do worker.
2. Validar o contrato de API via documentação.
3. Preparar o README do worker com instruções de deploy.

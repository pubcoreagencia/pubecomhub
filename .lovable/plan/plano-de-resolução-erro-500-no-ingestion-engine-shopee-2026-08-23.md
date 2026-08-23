
# Plano de Resolução: Erro 500 no Ingestion Engine (Shopee)

O erro 500 reportado ocorre porque o `CATALOG_WORKER_TOKEN` não está presente no ambiente de execução do servidor (Vite/Nitro), impedindo que o Hub se autentique com o Worker de Catálogo externo.

## Diagnóstico
- O endpoint `/api/ingestion/shopee` utiliza o `handleCatalogProxy`.
- O proxy exige o `CATALOG_WORKER_TOKEN` para encaminhar a requisição ao Worker.
- A verificação de ambiente confirmou que `CATALOG_WORKER_TOKEN` e `VITE_CATALOG_API_TOKEN` estão ausentes.
- O `CATALOG_WORKER_URL` está usando o fallback padrão (contato-pubcore).

## Ações de Correção

1.  **Configuração de Segredos**:
    - Adicionar o segredo `CATALOG_WORKER_TOKEN` via ferramenta `add_secret` para garantir persistência no backend.
    
2.  **Robustez no Proxy (`src/server/catalogProxy.ts`)**:
    - Ajustar a lógica para fornecer um erro mais descritivo e amigável quando o token estiver ausente, em vez de um 500 genérico.
    - Implementar um log de aviso no console do servidor para facilitar o rastreamento em produção.

3.  **Validação de Ingestão (`src/routes/api/ingestion/shopee.ts`)**:
    - Integrar o `validateTargetUrl` do `urlValidator.ts` diretamente no handler da rota para falhar rápido em caso de tentativa de SSRF, antes mesmo de chamar o proxy.

4.  **Verificação Final**:
    - Executar teste Playwright autenticado para confirmar que o erro 500 foi substituído por uma resposta válida do Worker (ou erro de autenticação real se o token for inválido, mas não 500 por variável ausente).

---
*Nota: Este plano foca na estabilidade da infraestrutura de integração Shopee sem alterar a interface visual.*

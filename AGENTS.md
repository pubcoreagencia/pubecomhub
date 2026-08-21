# PUB ECOM HUB - AI Guidelines

## Regra Permanente de Continuidade
O repositório oficial deste projeto é:
https://github.com/pubcoreagencia/pubecomhub

Todo avanço relevante realizado neste projeto deve ser materializado no Git. O estado necessário para outra IA ou desenvolvedor continuar o projeto não pode depender do histórico desta conversa ou de memória implícita.

## Regra Permanente — Pesquisa Técnica Antes de Construir
Antes de implementar do zero qualquer solução técnica relevante no PUB ECOM HUB, a IA/desenvolvedor deve pesquisar primeiro projetos, bibliotecas, referências e implementações existentes no GitHub.

Essa regra é especialmente obrigatória para problemas como:
- ingestão e importação de catálogos;
- scraping e browser automation;
- integração com marketplaces;
- sincronização de produtos e estoque;
- fulfillment;
- tracking;
- gateways e pagamentos;
- CRM e automações;
- WhatsApp, SMS e e-mail;
- event engines;
- pricing engines;
- wallets e ledger financeiro;
- multi-store / multi-tenant;
- marketplace e supplier management;
- integrações com APIs;
- filas, jobs e workflows;
- observabilidade e infraestrutura.

### Processo obrigatório
1. Pesquisar o GitHub.
2. Encontrar projetos relevantes.
3. Avaliar atividade, arquitetura, licença, compatibilidade, segurança e maturidade.
4. Comparar as alternativas relevantes.
5. Registrar a decisão no contexto/ADR quando for uma decisão técnica relevante.
6. Só então decidir entre usar, adaptar, integrar ou construir do zero.

### Proibição de Reinvenção Desnecessária
Não implementar do zero uma solução madura existente sem registrar por que as alternativas pesquisadas não atendem ao PUB ECOM HUB.

### Licença e Segurança
Encontrar um projeto no GitHub não autoriza copiar código automaticamente. Antes de incorporar qualquer código existente, verificar licença, compatibilidade com o projeto, dependências, histórico de segurança, origem dos dados e termos da plataforma integrada.

Quando a licença ou compatibilidade não estiver clara, não incorporar código.

### Regra de Continuidade da Pesquisa
A pesquisa e a decisão técnica não podem permanecer apenas na conversa da IA. O conhecimento necessário para reproduzir a decisão deve ser materializado no Git.

## Regras de Git
1. **Memória no Repositório**: Mantenha `PROJECT_CONTEXT.md` e `CHANGELOG.md` atualizados.
2. **Push Obrigatório**: Sempre que uma alteração funcional, arquitetural ou visual for validada, crie um commit descritivo e faça push para `pubcoreagencia/pubecomhub`.
3. **Segurança**: Nunca faça force push ou reset destrutivo. Preserve o histórico existente.
4. **Handoff**: Uma nova IA deve conseguir clonar o repositório e entender o estado atual lendo a documentação.

## Configuração de Repositório
O repositório `pubcoreagencia/pub-ecom` é legado e deve permanecer intocado.

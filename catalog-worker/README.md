# PUB ECOM Catalog Worker

Infraestrutura de automação de browser para o PUB ECOM HUB utilizando Cloudflare Browser Run.

## Arquitetura
Este worker é um projeto independente responsável exclusivamente pela execução de browser automation para extração de catálogos (Shopee, etc.).

## Setup
1. Instale as dependências: `npm install`
2. Configure o secret: `wrangler secret put CATALOG_WORKER_TOKEN`
3. Deploy: `wrangler deploy`

## API Contract
`POST /ingestion/shopee`
- **Auth**: `Authorization: Bearer <TOKEN>`
- **Body**: `{ "url": "...", "limit": 100 }`

## Limites
- Sujeito aos limites do Cloudflare Browser Run (Workers Free vs Paid).

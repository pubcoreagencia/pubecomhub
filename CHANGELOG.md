# Changelog - PUB ECOM HUB

## [1.0.1] - 2026-08-21
### Added
- Validação de TypeScript concluída sem erros.
- Build de produção concluído com sucesso.

### Changed
- Manutenção de `src/components/ui-b.tsx` porque seus componentes ainda estão em uso.
- Manutenção de `src/pages/`, `src/routes/`, `Shell.tsx`, `services`, `repositories`, `data` e `types`.

### Removed
- `src/lib/services/orderService.ts` por estar vazio e sem uso.
- 32 componentes UI órfãos de `src/components/ui/` identificados na auditoria estrutural.

## [1.0.0] - 2026-08-21
### Added
- Estrutura base unificada do PUB ECOM HUB.
- Design system Emerald Dark completo.
- Módulos de Dashboard, Live Shop, Financeiro e Operação.
- Storefront funcional com TanStack Start.
- Persistência de carrinho no localStorage.

### Changed
- Refatoração estrutural: extração de páginas das rotas para `src/pages/`.
- Unificação de Prototype A e Prototype B.
- Padronização de tipos e serviços financeiros.

### Fixed
- Bugs de navegação e redirecionamento.
- Cálculos de margem financeira para influencers.
- UX do carrinho e checkout.

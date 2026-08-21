import { createFileRoute } from '@tanstack/react-router';
import { ShellB } from '@/prototype-b/components/ShellB';
import { HubTable } from '@/prototype-b/components/ui-b';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/prototype-b/dashboard/stores')({
  component: () => <StoresB />,
});

function StoresB() {
  return (
    <ShellB>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="bg-black/40 px-4 py-2 rounded border border-[var(--hub-border)] flex items-center gap-3 w-80">
                 <Search className="h-4 w-4 text-[var(--hub-muted)]" />
                 <input type="text" placeholder="Buscar lojas..." className="bg-transparent border-none text-[11px] text-white focus:outline-none w-full" />
              </div>
              <Button variant="ghost" className="h-9 text-[10px] font-bold uppercase tracking-widest text-[var(--hub-muted)] hover:text-white">
                 <Filter className="h-4 w-4 mr-2" /> Filtrar
              </Button>
           </div>
           <Button className="h-9 bg-[var(--hub-primary)] hover:bg-[var(--hub-primary)]/80 text-[var(--hub-primary-foreground)] text-[10px] font-black uppercase tracking-wider px-6">
              <Plus className="h-4 w-4 mr-2" /> Criar Nova Vitrine
           </Button>
        </div>

        <HubTable headers={['Status', 'Loja', 'Domínio', 'Vendas', 'Faturamento', 'Último Evento', 'Ações']}>
          {[
            { status: 'Ativa', nome: 'Elite Dropshipping', dominio: 'elite.pubecom.com', vendas: '1.240', fat: 'R$ 840k', event: 'Venda há 2s' },
            { status: 'Ativa', nome: 'Glow Up Store', dominio: 'glow.pubecom.com', vendas: '890', fat: 'R$ 320k', event: 'Checkout há 14s' },
            { status: 'Ativa', nome: 'Alpha Tech Hub', dominio: 'alpha.pubecom.com', vendas: '2.100', fat: 'R$ 1.2M', event: 'Venda há 5m' },
            { status: 'Pausada', nome: 'Urban Fit', dominio: 'urban.pubecom.com', vendas: '450', fat: 'R$ 180k', event: 'Inativa' },
          ].map((loja, i) => (
            <tr key={i}>
              <td className="px-5 py-4">
                 <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase ${loja.status === 'Ativa' ? 'bg-[var(--hub-primary)]/20 text-[var(--hub-primary)]' : 'bg-slate-500/20 text-slate-400'}`}>
                    {loja.status}
                 </span>
              </td>
              <td className="px-5 py-4 font-bold text-white">{loja.nome}</td>
              <td className="px-5 py-4 text-[var(--hub-muted)]">{loja.dominio}</td>
              <td className="px-5 py-4 text-white">{loja.vendas}</td>
              <td className="px-5 py-4 font-black text-white">{loja.fat}</td>
              <td className="px-5 py-4 text-[var(--hub-muted)]">{loja.event}</td>
              <td className="px-5 py-4 text-right">
                 <Button variant="ghost" size="sm" className="text-[var(--hub-primary)] hover:bg-[var(--hub-primary)]/10 text-[9px] font-black uppercase tracking-widest">Gerenciar</Button>
              </td>
            </tr>
          ))}
        </HubTable>
      </div>
    </ShellB>
  );
}

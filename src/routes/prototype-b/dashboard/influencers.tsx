import { createFileRoute } from '@tanstack/react-router';
import { ShellB } from '@/prototype-b/components/ShellB';
import { HubTable } from '@/prototype-b/components/ui-b';
import { Users, TrendingUp, Award, DollarSign } from 'lucide-react';

export const Route = createFileRoute('/prototype-b/dashboard/influencers')({
  component: () => <InfluencersB />,
});

function InfluencersB() {
  return (
    <ShellB>
      <div className="space-y-6">
        <div className="hub-card p-8 bg-gradient-to-br from-[var(--hub-primary)]/10 to-transparent border-[var(--hub-primary)]/20">
           <div className="flex items-center gap-6">
              <div className="h-16 w-16 hub-bg-primary rounded-full flex items-center justify-center shadow-lg shadow-[var(--hub-primary)]/20">
                 <Users className="h-8 w-8 text-black" />
              </div>
              <div className="space-y-1">
                 <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Programa de Influencers</h2>
                 <p className="text-[var(--hub-muted)] text-xs font-medium uppercase tracking-widest max-w-lg">
                    Repasse de <span className="text-[var(--hub-primary)] font-black">50% do lucro líquido</span> das vendas atribuídas via Tracking ID ou Cupom.
                 </p>
              </div>
           </div>
        </div>

        <HubTable headers={['Rank', 'Influencer', 'Vendas Atribuídas', 'Lucro Gerado', 'Repasse (50%)', 'Status']}>
          {[
            { rank: '#01', nome: '@carlos_tech', vendas: '482', lucro: 'R$ 124.000', repasse: 'R$ 62.000', status: 'Top Performer' },
            { rank: '#02', nome: '@amanda_fit', vendas: '320', lucro: 'R$ 82.000', repasse: 'R$ 41.000', status: 'Ativo' },
            { rank: '#03', nome: '@julia_vlog', vendas: '156', lucro: 'R$ 38.000', repasse: 'R$ 19.000', status: 'Ativo' },
            { rank: '#04', nome: '@pedro_games', vendas: '89', lucro: 'R$ 22.000', repasse: 'R$ 11.000', status: 'Ativo' },
          ].map(inf => (
            <tr key={inf.rank}>
              <td className="px-5 py-4 font-black">{inf.rank}</td>
              <td className="px-5 py-4 font-bold text-white">{inf.nome}</td>
              <td className="px-5 py-4 text-white">{inf.vendas}</td>
              <td className="px-5 py-4 text-[var(--hub-muted)]">{inf.lucro}</td>
              <td className="px-5 py-4 font-black text-[var(--hub-primary)]">{inf.repasse}</td>
              <td className="px-5 py-4">
                 <span className="px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase bg-white/10 text-white">
                    {inf.status}
                 </span>
              </td>
            </tr>
          ))}
        </HubTable>
      </div>
    </ShellB>
  );
}

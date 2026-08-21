import * as React from 'react';
import { ShellB } from '@/prototype-b/components/ShellB';
import { CardMetric, HubTable } from '@/prototype-b/components/ui-b';
import { 
  CircleDollarSign, TrendingUp, ArrowDownToLine, 
  Percent, Wallet, Receipt, ArrowUpRight 
} from 'lucide-react';
import { mockFinancialSummary } from '@/prototype-b/services/financialService';

export default function FinancePageB() {
  return (
    <ShellB>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-1">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Central Financeira</h2>
              <p className="text-[var(--hub-muted)] text-[9px] font-bold uppercase tracking-[0.3em]">Consolidação de Resultados & Repasses</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <CardMetric 
             label="Receita Bruta" 
             value={`R$ ${mockFinancialSummary.total_revenue.toLocaleString('pt-BR')}`} 
             trend="+12.4%" 
             trendType="up" 
             icon={CircleDollarSign} 
           />
           <CardMetric 
             label="Lucro Líquido" 
             value={`R$ ${mockFinancialSummary.total_net_profit.toLocaleString('pt-BR')}`} 
             trend={mockFinancialSummary.profit_margin} 
             trendType="neutral" 
             icon={TrendingUp} 
           />
           <CardMetric 
             label="Repasse Influencers" 
             value={`R$ ${mockFinancialSummary.total_influencer_payout.toLocaleString('pt-BR')}`} 
             subtext="50% do lucro total" 
             icon={Wallet} 
           />
           <CardMetric 
             label="Margem de Operação" 
             value="14.5%" 
             trend="Estável" 
             trendType="neutral" 
             icon={Percent} 
           />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
           <div className="xl:col-span-2 space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white px-2">Detalhamento por Loja</h3>
              <HubTable headers={['Loja', 'Receita Bruta', 'Custo Prods', 'Taxas/Frete', 'Lucro Lq.', 'Margem']}>
                {mockFinancialSummary.top_stores.map((store, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5 font-black text-white italic">{store.name}</td>
                    <td className="px-6 py-5 text-white font-bold">R$ {store.revenue.toLocaleString('pt-BR')}</td>
                    <td className="px-6 py-5 text-red-400/80 italic">R$ {(store.revenue * 0.45).toLocaleString('pt-BR')}</td>
                    <td className="px-6 py-5 text-red-400/60 italic">R$ {(store.revenue * 0.15).toLocaleString('pt-BR')}</td>
                    <td className="px-6 py-5 font-black text-[var(--hub-primary)]">R$ {store.profit.toLocaleString('pt-BR')}</td>
                    <td className="px-6 py-5 text-[var(--hub-muted)] font-black italic">
                       {((store.profit / store.revenue) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </HubTable>
           </div>

           <div className="space-y-6">
              <div className="hub-card hub-gradient-border p-6 space-y-6">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Saques Pendentes</h4>
                 <div className="space-y-4">
                    {[
                      { user: 'Marcus Silva (Master)', amount: 'R$ 42.000', date: 'Hoje' },
                      { user: 'Amanda Rebouças (Mentor)', amount: 'R$ 12.450', date: 'Ontem' },
                      { user: '@carlos_tech (Influencer)', amount: 'R$ 8.900', date: 'Há 2 dias' }
                    ].map((w, i) => (
                      <div key={i} className="p-4 bg-black/20 border border-[var(--hub-border)] rounded-xl flex items-center justify-between">
                         <div>
                            <p className="text-[10px] font-black text-white uppercase italic">{w.user}</p>
                            <p className="text-[9px] text-[var(--hub-muted)] font-bold uppercase tracking-widest">{w.date}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-black text-[var(--hub-primary)] italic">{w.amount}</p>
                            <button className="text-[8px] font-black text-white/40 uppercase tracking-widest hover:text-white">Detalhes</button>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full py-4 bg-[var(--hub-primary)] text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-xl shadow-lg shadow-[var(--hub-primary)]/20">
                    Processar Lote de Pagamentos
                 </button>
              </div>

              <div className="hub-card hub-gradient-border p-6 space-y-4 bg-[var(--hub-primary)]/5 border-[var(--hub-primary)]/20">
                 <div className="flex items-center gap-3">
                    <Receipt className="h-5 w-5 text-[var(--hub-primary)]" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Próximo Fechamento</h4>
                 </div>
                 <p className="text-[10px] text-[var(--hub-muted)] font-bold uppercase tracking-wider leading-relaxed">
                    O próximo ciclo de repasses será encerrado em <span className="text-white italic">05 de Junho de 2026</span>. Certifique-se de que todos os pedidos entregues foram conciliados.
                 </p>
                 <div className="pt-4 border-t border-[var(--hub-border)]">
                    <div className="flex justify-between text-[10px] font-black mb-2">
                       <span className="text-white uppercase tracking-widest">Meta de Lucro</span>
                       <span className="text-[var(--hub-primary)]">84%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-[var(--hub-border)]">
                       <div className="h-full bg-[var(--hub-primary)] w-[84%] transition-all" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </ShellB>
  );
}

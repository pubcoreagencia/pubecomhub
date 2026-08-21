import * as React from 'react';
import { ShellB } from '@/prototype-b/components/ShellB';
import { CardMetric, AcquisitionFunnel, HubTable } from '@/prototype-b/components/ui-b';
import { 
  TrendingUp, CircleDollarSign, Package, Store, 
  Users, Activity, MousePointer2, Zap 
} from 'lucide-react';

export default function DashboardPageB() {
  return (
    <ShellB>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Metric Cards - Official Hub Style */}
        <CardMetric 
          label="Faturamento Total" 
          value="R$ 1.842.900" 
          trend="+15.2%" 
          trendType="up" 
          subtext="vs mês anterior"
          icon={CircleDollarSign}
        />
        <CardMetric 
          label="Lucro Líquido" 
          value="R$ 536.800" 
          trend="29.1% margem" 
          trendType="neutral"
          icon={TrendingUp}
        />
        <CardMetric 
          label="Pedidos Aprovados" 
          value="15.120" 
          trend="+842 hoje" 
          trendType="up"
          icon={Package}
        />
        <CardMetric 
          label="Comissão Influencers" 
          value="R$ 268.400" 
          subtext="Repasse 50% do lucro"
          icon={Users}
        />

        {/* Chart Area - Placeholder for Hub Graphics */}
        <div className="xl:col-span-3 space-y-8">
           <div className="hub-card hub-gradient-border p-8 h-[400px] flex flex-col">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-white">Performance de Faturamento</h3>
                  <p className="text-[10px] text-[var(--hub-muted)] uppercase font-bold tracking-widest mt-1">Dados consolidados de todas as lojas</p>
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[var(--hub-primary)]" />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Faturamento</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-slate-600" />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Projeção</span>
                   </div>
                </div>
             </div>
             <div className="flex-1 flex items-center justify-center border-t border-[var(--hub-border)] border-dashed mt-auto">
               <span className="text-[11px] text-[var(--hub-muted)] uppercase tracking-[0.4em] font-black italic opacity-20">Hub Analytics Engine Active</span>
             </div>
           </div>
           
           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Ranking de Lojas (Performance)</h3>
                <button className="text-[10px] font-black text-[var(--hub-primary)] uppercase tracking-widest hover:underline">Ver Ranking Global</button>
              </div>
              <HubTable headers={['Rank', 'Loja', 'Mentor', 'Pedidos', 'Conv.', 'Lucro Lq.']}>
                {[
                  { rank: '#01', loja: 'Titanium Dropshipping', mentor: 'Marcus Silva', pedidos: '1.242', conv: '4,21%', lucro: 'R$ 42.890' },
                  { rank: '#02', loja: 'Glow Tech Hub', mentor: 'Amanda Rebouças', pedidos: '984', conv: '3,84%', lucro: 'R$ 31.120' },
                  { rank: '#03', loja: 'Urban Style', mentor: 'Ricardo Costa', pedidos: '856', conv: '3,12%', lucro: 'R$ 28.450' },
                  { rank: '#04', loja: 'Home Elite', mentor: 'Sarah Lins', pedidos: '742', conv: '2,98%', lucro: 'R$ 24.900' },
                ].map(row => (
                  <tr key={row.rank} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5 font-black text-[var(--hub-muted)] group-hover:text-white">{row.rank}</td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-black/40 border border-[var(--hub-border)] flex items-center justify-center">
                             <Store className="h-4 w-4 text-[var(--hub-muted)]" />
                          </div>
                          <span className="font-black text-white italic">{row.loja}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-[var(--hub-muted)] font-bold">{row.mentor}</td>
                    <td className="px-6 py-5 text-white font-black">{row.pedidos}</td>
                    <td className="px-6 py-5">
                       <span className="text-emerald-500 font-black">{row.conv}</span>
                    </td>
                    <td className="px-6 py-5">
                       <span className="font-black text-[var(--hub-primary)] italic">{row.lucro}</span>
                    </td>
                  </tr>
                ))}
              </HubTable>
           </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <AcquisitionFunnel />
          
          <div className="hub-card hub-gradient-border p-6 flex flex-col min-h-[400px]">
             <div className="flex items-center justify-between mb-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Live Event Stream</h4>
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                   <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">LIVE</span>
                </div>
             </div>
             <div className="space-y-4">
               {[
                 { msg: 'Venda Aprovada #10942', type: 'SALE', time: '2s', meta: 'Titanium Hub · Influencer @carlos' },
                 { msg: 'Checkout Iniciado', type: 'EVENT', time: '14s', meta: 'Glow Tech · R$ 899,90' },
                 { msg: 'Carrinho Criado', type: 'EVENT', time: '26s', meta: 'Urban Style · Smartwatch Pro' },
                 { msg: 'Pagamento PIX Gerado', type: 'PENDING', time: '45s', meta: 'Home Elite · R$ 450,00' }
               ].map((evt, i) => (
                 <div key={i} className="hub-glass p-4 rounded-xl border border-[var(--hub-border)] space-y-2 hover:border-[var(--hub-primary)]/40 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                       <span className={cn(
                         "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                         evt.type === 'SALE' ? "bg-[var(--hub-primary)] text-black" : "bg-black/60 text-white"
                       )}>
                         {evt.type}
                       </span>
                       <span className="text-[9px] text-[var(--hub-muted)] font-bold italic">{evt.time}</span>
                    </div>
                    <p className="text-[11px] font-black text-white italic leading-tight">{evt.msg}</p>
                    <p className="text-[9px] text-[var(--hub-muted)] font-bold uppercase tracking-widest opacity-60">{evt.meta}</p>
                 </div>
               ))}
             </div>
             <button className="w-full mt-auto pt-6 text-[9px] font-black uppercase tracking-[0.3em] text-[var(--hub-muted)] hover:text-white transition-colors">Ver todos os eventos</button>
          </div>
        </div>
      </div>
    </ShellB>
  );
}

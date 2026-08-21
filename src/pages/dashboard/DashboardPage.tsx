import * as React from 'react';
import { Shell } from '@/components/layout/Shell';
import { CardMetric, AcquisitionFunnel, HubTable } from '@/components/ui-b';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, CircleDollarSign, Package, Store, 
  Users, Activity, MousePointer2, Zap, LayoutDashboard, Clock
} from 'lucide-react';

export default function DashboardPageB() {
  return (
    <Shell>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Metric Cards */}
        <CardMetric 
          label="Faturamento Total" 
          value="R$ 1.842.900" 
          trend="+15.2%" 
          trendType="up" 
          subtext="Simulação 24h"
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
          label="Repasse Influencers" 
          value="R$ 268.400" 
          subtext="50% do lucro total"
          icon={Users}
        />

        <div className="xl:col-span-3 space-y-8">
           {/* Main Charts Section */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Chart 1: Sales by Channel */}
              <div className="hub-card hub-gradient-border p-6 h-[300px] flex flex-col">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Vendas por Canal</h3>
                    <div className="h-6 w-6 rounded-lg bg-black/40 border border-[var(--hub-border)] flex items-center justify-center">
                       <LayoutDashboard className="h-3 w-3 text-[var(--hub-muted)]" />
                    </div>
                 </div>
                 <div className="flex-1 space-y-4">
                    {[
                       { label: 'Dropshipping', val: 'R$ 842.000', w: '85%' },
                       { label: 'Afiliados', val: 'R$ 520.000', w: '60%' },
                       { label: 'Social Live', val: 'R$ 480.900', w: '55%' }
                    ].map(c => (
                       <div key={c.label} className="space-y-1">
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest italic">
                             <span className="text-[var(--hub-muted)]">{c.label}</span>
                             <span className="text-white">{c.val}</span>
                          </div>
                          <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
                             <div className="h-full bg-[var(--hub-primary)]" style={{ width: c.w }} />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Chart 2: Visitors by Hour */}
              <div className="hub-card hub-gradient-border p-6 h-[300px] flex flex-col">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Visitantes por Hora</h3>
                    <Clock className="h-3 w-3 text-[var(--hub-muted)]" />
                 </div>
                 <div className="flex-1 flex items-end gap-1 pb-2">
                    {[30, 45, 60, 40, 70, 90, 100, 80, 60, 85, 95, 120].map((h, i) => (
                       <div key={i} className="flex-1 bg-[var(--hub-primary)]/20 hover:bg-[var(--hub-primary)] transition-all rounded-t-sm" style={{ height: `${h/1.2}%` }} />
                    ))}
                 </div>
                 <div className="flex justify-between text-[8px] font-black text-[var(--hub-muted)] uppercase tracking-widest mt-2">
                    <span>00:00</span>
                    <span>12:00</span>
                    <span>23:59</span>
                 </div>
              </div>
           </div>

           {/* Ranking Tables */}
           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Ranking de Lojas (Performance)</h3>
                <button className="text-[10px] font-black text-[var(--hub-primary)] uppercase tracking-widest hover:underline italic">Live Hub Statistics</button>
              </div>
              <HubTable headers={['Rank', 'Loja', 'Pedidos', 'Conv.', 'Lucro Lq.']}>
                {[
                  { rank: '#01', loja: 'Titanium Store', pedidos: '1.242', conv: '4,21%', lucro: 'R$ 42.890' },
                  { rank: '#02', loja: 'Glow Tech', pedidos: '984', conv: '3,84%', lucro: 'R$ 31.120' },
                  { rank: '#03', loja: 'Urban Style', pedidos: '856', conv: '3,12%', lucro: 'R$ 28.450' },
                  { rank: '#04', loja: 'Home Elite', pedidos: '742', conv: '2,98%', lucro: 'R$ 24.900' },
                ].map(row => (
                  <tr key={row.rank} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5 font-black text-[var(--hub-muted)]">{row.rank}</td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-3">
                          <Store className="h-4 w-4 text-[var(--hub-muted)] opacity-50" />
                          <span className="font-black text-white italic">{row.loja}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-white font-black">{row.pedidos}</td>
                    <td className="px-6 py-5">
                       <span className="text-emerald-500 font-black italic">{row.conv}</span>
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
          
          {/* Live Event Stream */}
          <div className="hub-card hub-gradient-border p-6 flex flex-col min-h-[450px]">
             <div className="flex items-center justify-between mb-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Live Event Stream</h4>
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                   <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">LIVE</span>
                </div>
             </div>
             <div className="space-y-4">
                {[
                  { msg: 'Venda Aprovada #10942', type: 'SALE', time: '2s', meta: 'Titanium · R$ 899,90' },
                  { msg: 'Checkout Iniciado', type: 'EVENT', time: '14s', meta: 'Glow Tech · iPhone 16' },
                  { msg: 'Pagamento Gerado', type: 'PENDING', time: '26s', meta: 'Urban Style · R$ 450' },
                  { msg: 'Carrinho Criado', type: 'EVENT', time: '45s', meta: 'Home Elite · Kit Gourmet' }
                ].map((evt, i) => (
                  <div key={i} className="hub-glass p-4 rounded-xl border border-[var(--hub-border)] space-y-2 hover:border-[var(--hub-primary)] transition-all cursor-pointer">
                     <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-[8px] font-black px-1.5 py-0.5 rounded uppercase",
                          evt.type === 'SALE' ? "bg-[var(--hub-primary)] text-black" : "bg-white/10 text-white"
                        )}>
                          {evt.type}
                        </span>
                        <span className="text-[9px] text-[var(--hub-muted)] font-bold italic">{evt.time}</span>
                     </div>
                     <p className="text-[11px] font-black text-white italic leading-tight">{evt.msg}</p>
                     <p className="text-[9px] text-[var(--hub-muted)] font-bold uppercase tracking-widest opacity-40">{evt.meta}</p>
                  </div>
                ))}
             </div>
             <button className="w-full mt-auto pt-6 text-[9px] font-black uppercase tracking-[0.3em] text-[var(--hub-muted)] hover:text-white transition-colors">Audit Full Stream</button>
          </div>
        </div>
      </div>
    </Shell>
  );
}

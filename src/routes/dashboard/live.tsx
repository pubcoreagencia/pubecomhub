import { createFileRoute } from '@tanstack/react-router';
import { ShellB } from '@/prototype-b/components/ShellB';
import { CardMetric, AcquisitionFunnel, HubTable } from '@/prototype-b/components/ui-b';
import { 
  Users, 
  ShoppingCart, 
  CreditCard, 
  CheckCircle2,
  TrendingUp,
  Activity,
  Zap,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/dashboard/live')({
  component: () => <LiveShopB />,
});

function LiveShopB() {
  return (
    <ShellB>
      <div className="space-y-6">
        {/* Real-time Header Metrics */}
        <div className="grid grid-cols-4 gap-6">
          <CardMetric label="Visitantes Online" value="1.284" icon={Users} trend="+12%" trendType="up" />
          <CardMetric label="Carrinhos Abertos" value="187" icon={ShoppingCart} subtext="Volume 5 min" />
          <CardMetric label="Checkouts Ativos" value="42" icon={CreditCard} trendType="neutral" />
          <CardMetric label="Vendas Aprovadas" value="13" icon={CheckCircle2} trend="+4 hoje" trendType="up" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Visual Funnel */}
          <div className="col-span-2 space-y-6">
            <div className="hub-card hub-gradient-border p-8 h-[500px] flex flex-col">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Monitor de Performance Real-time</h3>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--hub-primary)] animate-pulse" />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Global Stream</span>
                     </div>
                  </div>
               </div>
               
               <div className="flex-1 flex flex-col justify-center space-y-6">
                  {[
                    { label: 'Page Views', val: '184.2k', w: '100%', color: 'bg-white/5' },
                    { label: 'Add to Cart', val: '33.9k', w: '65%', color: 'bg-[var(--hub-primary)]/10' },
                    { label: 'Checkouts', val: '15.1k', w: '40%', color: 'bg-[var(--hub-primary)]/20' },
                    { label: 'Purchases', val: '7.0k', w: '20%', color: 'bg-[var(--hub-primary)]' }
                  ].map((step, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest italic">
                            <span className="text-[var(--hub-muted)]">{step.label}</span>
                            <span className="text-white">{step.val}</span>
                        </div>
                        <div className="h-4 w-full bg-black/40 rounded border border-[var(--hub-border)] overflow-hidden">
                            <div className={cn("h-full transition-all duration-1000", step.color)} style={{ width: step.w }} />
                        </div>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="hub-card hub-gradient-border p-6 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--hub-muted)]">Ticket Médio</p>
                        <h4 className="text-2xl font-black text-white italic mt-1">R$ 189,40</h4>
                    </div>
                    <Activity className="h-8 w-8 text-[var(--hub-primary)] opacity-20" />
                </div>
                <div className="hub-card hub-gradient-border p-6 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--hub-muted)]">Conversão Global</p>
                        <h4 className="text-2xl font-black text-white italic mt-1">3.8%</h4>
                    </div>
                    <Zap className="h-8 w-8 text-[var(--hub-primary)] opacity-20" />
                </div>
            </div>
          </div>

          {/* Real-time Event Log */}
          <div className="col-span-1">
             <div className="hub-card hub-gradient-border p-6 h-[660px] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Event Stream Feed</h3>
                    <Globe className="h-4 w-4 text-[var(--hub-muted)] animate-spin-slow" />
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto pr-2 no-scrollbar">
                   {[
                     { type: 'SALE', msg: 'Venda Aprovada #10942', time: '2s', meta: 'Trend Store · @carlos_ads' },
                     { type: 'CHECKOUT', msg: 'Checkout Iniciado', time: '14s', meta: 'Electro Hub · Smartwatch X' },
                     { type: 'CART', msg: 'Item no Carrinho', time: '26s', meta: 'Trend Store · Headphones Pro' },
                     { type: 'SALE', msg: 'Venda Aprovada #10941', time: '45s', meta: 'Electro Hub · Charger MagSafe' },
                     { type: 'PENDING', msg: 'PIX Aguardando', time: '1m', meta: 'Trend Store · Case Leather' },
                     { type: 'SALE', msg: 'Venda Aprovada #10940', time: '2m', meta: 'Trend Store · Wireless Mouse' }
                   ].map((evt, i) => (
                     <div key={i} className="hub-glass p-4 rounded-xl border border-[var(--hub-border)] hover:border-[var(--hub-primary)]/40 transition-all">
                        <div className="flex items-center justify-between mb-2">
                           <span className={cn(
                             "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter",
                             evt.type === 'SALE' ? "bg-[var(--hub-primary)] text-black" : "bg-black/60 text-white"
                           )}>
                             {evt.type}
                           </span>
                           <span className="text-[9px] text-[var(--hub-muted)] font-black italic">{evt.time}</span>
                        </div>
                        <p className="text-[11px] font-black text-white italic leading-tight">{evt.msg}</p>
                        <p className="text-[9px] text-[var(--hub-muted)] font-bold uppercase tracking-widest mt-1 opacity-50">{evt.meta}</p>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-6 pt-6 border-t border-[var(--hub-border)] text-[9px] font-black uppercase tracking-[0.3em] text-[var(--hub-muted)] hover:text-white transition-colors italic">
                    Open Advanced Log Console
                </button>
             </div>
          </div>
        </div>
      </div>
    </ShellB>
  );
}

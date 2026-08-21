import { createFileRoute } from '@tanstack/react-router';
import { ShellB } from '@/prototype-b/components/ShellB';
import { CardMetric, AcquisitionFunnel, HubTable } from '@/prototype-b/components/ui-b';
import { 
  Users, 
  ShoppingCart, 
  CreditCard, 
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export const Route = createFileRoute('/prototype-b/dashboard/live')({
  component: () => <LiveShopB />,
});

function LiveShopB() {
  return (
    <ShellB>
      <div className="space-y-6">
        {/* Real-time Header Metrics */}
        <div className="grid grid-cols-4 gap-6">
          <div className="hub-card p-5 bg-black/40 border-[var(--hub-primary)]/30">
             <div className="flex items-center gap-3 mb-2">
                <Users className="h-4 w-4 text-[var(--hub-primary)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Visitantes Online</span>
             </div>
             <div className="text-3xl font-black text-white">1.284</div>
             <div className="text-[9px] text-[var(--hub-primary)] font-bold mt-1">+12% vs última hora</div>
          </div>
          <div className="hub-card p-5">
             <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="h-4 w-4 text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Carrinhos Abertos</span>
             </div>
             <div className="text-3xl font-black text-white">187</div>
          </div>
          <div className="hub-card p-5">
             <div className="flex items-center gap-3 mb-2">
                <CreditCard className="h-4 w-4 text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Checkouts Ativos</span>
             </div>
             <div className="text-3xl font-black text-white">42</div>
          </div>
          <div className="hub-card p-5">
             <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--hub-primary)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Vendas (5 min)</span>
             </div>
             <div className="text-3xl font-black text-white">13</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Visual Funnel */}
          <div className="col-span-2">
            <div className="hub-card p-6 h-[500px] flex flex-col">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Monitor de Funil ao Vivo</h3>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[var(--hub-primary)]" />
                        <span className="text-[9px] font-bold text-white uppercase">Checkout</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-slate-600" />
                        <span className="text-[9px] font-bold text-white uppercase">Navegação</span>
                     </div>
                  </div>
               </div>
               
               <div className="flex-1 flex items-center justify-center relative">
                  {/* Visual Funnel Representation */}
                  <div className="w-full max-w-lg space-y-4">
                     {[
                       { label: 'Page View', val: '184.2k', w: '100%' },
                       { label: 'Add to Cart', val: '33.9k', w: '65%' },
                       { label: 'Initiate Checkout', val: '15.1k', w: '40%' },
                       { label: 'Purchase', val: '7.0k', w: '25%' }
                     ].map((step, i) => (
                       <div key={i} className="relative h-16 flex items-center justify-center">
                          <div 
                            className="absolute inset-y-0 bg-[var(--hub-primary)]/10 border border-[var(--hub-primary)]/20 rounded flex items-center px-6"
                            style={{ width: step.w }}
                          >
                             <span className="text-[10px] font-black text-white uppercase tracking-widest">{step.label}</span>
                          </div>
                          <span className="relative z-10 text-[11px] font-black text-[var(--hub-primary)]">{step.val}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Real-time Event Log */}
          <div className="col-span-1">
             <div className="hub-card p-6 h-[500px] flex flex-col">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-6">Fluxo de Eventos</h3>
                <div className="flex-1 space-y-4 overflow-y-auto pr-2 no-scrollbar">
                   {[
                     { type: 'SALE', msg: 'Pedido #10942 aprovado', time: 'há 2s', meta: 'Elite Dropshipping · Influencer @carlos_tech' },
                     { type: 'CHECKOUT', msg: 'Cliente iniciou checkout', time: 'há 14s', meta: 'Glow Up Store · Smartwatch Pro X' },
                     { type: 'CART', msg: 'Adicionado ao carrinho', time: 'há 26s', meta: 'Alpha Tech Hub · Fone Noise Cancelling' },
                     { type: 'PAYMENT', msg: 'PIX gerado', time: 'há 45s', meta: 'Urban Fit · Kit Musculação' },
                     { type: 'SALE', msg: 'Pedido #10941 aprovado', time: 'há 1m', meta: 'Casa Prime · Air Fryer Gold' }
                   ].map((evt, i) => (
                     <div key={i} className="p-4 rounded bg-black/20 border border-[var(--hub-border)] hover:border-[var(--hub-primary)]/40 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                           <span className={cn(
                             "text-[8px] font-black px-1.5 py-0.5 rounded",
                             evt.type === 'SALE' ? "bg-[var(--hub-primary)] text-black" : "bg-white/10 text-white"
                           )}>
                             {evt.type}
                           </span>
                           <span className="text-[9px] text-[var(--hub-muted)]">{evt.time}</span>
                        </div>
                        <p className="text-[11px] font-bold text-white leading-tight">{evt.msg}</p>
                        <p className="text-[9px] text-[var(--hub-muted)] mt-1">{evt.meta}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </ShellB>
  );
}

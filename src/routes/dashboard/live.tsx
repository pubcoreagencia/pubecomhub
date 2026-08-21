import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockOrders } from '@/data/mock';
import { Activity, ShoppingCart, UserCheck, CreditCard, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/dashboard/live')({
  component: LiveShopPage,
});

function LiveShopPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const funnelSteps = [
    { label: 'Sessões', value: 12450, icon: UserCheck, color: 'bg-slate-50 text-slate-600' },
    { label: 'Carrinhos', value: 2840, icon: ShoppingCart, color: 'bg-amber-50 text-amber-600' },
    { label: 'Checkouts', value: 950, icon: CreditCard, color: 'bg-blue-50 text-blue-600' },
    { label: 'Vendas', value: 480, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Conversão', value: '3.8%', icon: Zap, color: 'bg-indigo-50 text-indigo-600' },
  ];

  const events = [
    { type: 'sale', label: 'Venda Confirmada', store: 'Loja Tech', time: 'Agora mesmo', amount: 'R$ 2.999,00', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { type: 'checkout', label: 'Iniciou Checkout', store: 'Moda Fashion', time: '2 min atrás', amount: 'R$ 499,00', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
    { type: 'cart', label: 'Adicionou ao Carrinho', store: 'Loja Tech', time: '5 min atrás', amount: 'R$ 2.999,00', icon: ShoppingCart, color: 'text-amber-500', bg: 'bg-amber-50' },
    { type: 'visitor', label: 'Nova Sessão', store: 'Moda Fashion', time: '8 min atrás', amount: null, icon: UserCheck, color: 'text-slate-500', bg: 'bg-slate-100' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Live Shop</h2>
          <p className="text-slate-500 text-sm">Monitoramento em tempo real da jornada de compra.</p>
        </div>
        {!loading && (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 animate-pulse shadow-sm">
            <Activity className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Transmissão Ao Vivo</span>
          </div>
        )}
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {funnelSteps.map((step, i) => (
          <Card key={i} className="shadow-sm border-slate-100 overflow-hidden relative">
            <CardHeader className="pb-2 pt-4 px-4">
               <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center mb-2", step.color)}>
                  <step.icon className="h-4 w-4" />
               </div>
               <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                 {loading ? <Skeleton className="h-3 w-16" /> : step.label}
               </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {loading ? <Skeleton className="h-8 w-12" /> : <div className="text-xl font-bold text-slate-900">{step.value.toLocaleString()}</div>}
            </CardContent>
            {i < funnelSteps.length - 1 && (
               <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 hidden lg:block">
                  <div className="h-6 w-6 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300">
                     <ArrowRight className="h-3 w-3" />
                  </div>
               </div>
            )}
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm border-slate-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold">Eventos em Tempo Real</CardTitle>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px]">Atualizado agora</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 py-4">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))
              ) : (
                events.map((event, i) => (
                  <div key={i} className="flex items-center gap-4 py-4 border-b last:border-0 border-slate-50 group hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", event.bg, event.color)}>
                      <event.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-slate-900 truncate">{event.label}</p>
                        {event.amount && <span className="font-bold text-slate-900 text-xs shrink-0">{event.amount}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-primary uppercase">{event.store}</span>
                        <span className="text-[10px] text-slate-400 font-medium">• {event.time}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                       <ArrowRight className="h-4 w-4 text-slate-300" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-100">
           <CardHeader>
              <CardTitle className="text-base font-bold">Resumo do Funil</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
              <div className="relative h-[240px] w-full flex flex-col gap-2 pt-4">
                 {[80, 60, 40, 25].map((w, i) => (
                    <div key={i} className="relative h-full w-full flex items-center justify-center">
                       <div 
                        className={cn(
                          "h-full rounded-xl transition-all duration-1000",
                          i === 0 ? "bg-slate-100" : i === 1 ? "bg-amber-100" : i === 2 ? "bg-blue-100" : "bg-emerald-100"
                        )} 
                        style={{ width: `${w}%` }} 
                       />
                       <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                          {['Sessões', 'Carrinhos', 'Checkouts', 'Vendas'][i]}
                       </span>
                    </div>
                 ))}
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 space-y-1">
                 <p className="text-[10px] font-bold text-indigo-400 uppercase">Destaque de hoje</p>
                 <p className="text-sm font-bold text-indigo-900">Aumento de 15% na taxa de checkout para carrinho.</p>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

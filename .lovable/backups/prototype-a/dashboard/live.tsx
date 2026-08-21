import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockOrders } from '@/data/mock';
import { Activity, ShoppingCart, UserCheck, CreditCard, CheckCircle2, Zap, ArrowRight, MousePointer2 } from 'lucide-react';
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
    { label: 'Carrinhos', value: 2840, icon: MousePointer2, color: 'bg-amber-50 text-amber-600' },
    { label: 'Checkouts', value: 950, icon: CreditCard, color: 'bg-blue-50 text-blue-600' },
    { label: 'Vendas', value: 480, icon: ShoppingCart, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Conversão', value: '3.8%', icon: Activity, color: 'bg-indigo-50 text-indigo-600' },
  ];

  const events = [
    { type: 'sale', label: 'Venda Confirmada', store: 'Loja Tech', time: 'Agora mesmo', amount: 'R$ 2.999,00', icon: ShoppingCart, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { type: 'checkout', label: 'Iniciou Checkout', store: 'Moda Fashion', time: '2 min atrás', amount: 'R$ 499,00', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
    { type: 'cart', label: 'Adicionou ao Carrinho', store: 'Loja Tech', time: '5 min atrás', amount: 'R$ 2.999,00', icon: MousePointer2, color: 'text-amber-500', bg: 'bg-amber-50' },
    { type: 'visitor', label: 'Nova Sessão', store: 'Moda Fashion', time: '8 min atrás', amount: null, icon: UserCheck, color: 'text-slate-500', bg: 'bg-slate-100' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 leading-none">Live Shop</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Monitoramento em tempo real da jornada de compra.</p>
        </div>
        {!loading && (
          <div className="flex items-center gap-3 px-5 py-2 bg-red-50 text-red-600 rounded-full border border-red-100 animate-pulse shadow-sm ring-4 ring-red-50/50">
            <div className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
            <Activity className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Transmissão Ao Vivo</span>
          </div>
        )}
      </div>

      <div className="grid gap-6 grid-cols-2 lg:grid-cols-5">
        {funnelSteps.map((step, i) => (
          <Card key={i} className="shadow-sm border-slate-100 rounded-3xl overflow-hidden relative group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white">
            <CardHeader className="pb-2 pt-6 px-6">
               <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500", step.color)}>
                  {React.createElement(step.icon, { className: "h-5 w-5" })}
               </div>
               <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                 {loading ? <Skeleton className="h-3 w-16" /> : step.label}
               </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {loading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-black text-slate-900 tracking-tighter">{step.value.toLocaleString()}</div>}
            </CardContent>
            {i < funnelSteps.length - 1 && (
               <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 hidden lg:block">
                  <div className="h-8 w-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 shadow-sm">
                     <ArrowRight className="h-4 w-4" />
                  </div>
               </div>
            )}
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm border-slate-100 rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between px-8 py-6 border-b border-slate-50">
            <CardTitle className="text-lg font-black tracking-tight text-slate-900">Eventos em Tempo Real</CardTitle>
            <Badge variant="secondary" className="bg-slate-50 text-slate-400 border-none text-[9px] font-black uppercase tracking-widest px-3 py-1">Atualizado Agora</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 py-4 px-4">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))
              ) : (
                events.map((event, i) => (
                  <div key={i} className="flex items-center gap-5 py-4 px-4 rounded-3xl transition-all duration-300 group hover:bg-slate-50">
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border border-transparent transition-all group-hover:shadow-md group-hover:scale-105", event.bg, event.color)}>
                      {React.createElement(event.icon, { className: "h-6 w-6" })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-black text-slate-900 truncate tracking-tight text-base">{event.label}</p>
                        {event.amount && <span className="font-black text-slate-900 text-sm shrink-0 bg-slate-100 px-3 py-1 rounded-full">{event.amount}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.1em]">{event.store}</span>
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{event.time}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-sm">
                       <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-100 rounded-[2.5rem] bg-white overflow-hidden p-2">
           <CardHeader className="px-6 py-6 pb-0">
              <CardTitle className="text-lg font-black tracking-tight text-slate-900">Resumo do Funil</CardTitle>
           </CardHeader>
           <CardContent className="space-y-10 p-6 pt-4">
              <div className="relative h-[280px] w-full flex flex-col gap-3 pt-4">
                 {[85, 65, 45, 30].map((w, i) => (
                    <div key={i} className="relative h-full w-full flex items-center group cursor-pointer">
                       <div 
                        className={cn(
                          "h-full rounded-2xl transition-all duration-1000 ease-out shadow-sm border border-white/50",
                          i === 0 ? "bg-slate-50" : i === 1 ? "bg-amber-50" : i === 2 ? "bg-blue-50" : "bg-emerald-50"
                        )} 
                        style={{ width: `${w}%` }} 
                       />
                       <div className="absolute left-6 flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-slate-600 transition-colors">
                             {['Visitas', 'Carrinhos', 'Checkouts', 'Vendas'][i]}
                          </span>
                          <span className="text-sm font-black text-slate-900 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                             {w * 100}
                          </span>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="p-6 bg-indigo-600 rounded-3xl text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 shadow-xl shadow-indigo-200">
                 <div className="absolute -right-4 -top-4 h-24 w-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                 <div className="relative z-10 space-y-2">
                    <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Audience Insight</p>
                    <p className="text-base font-bold leading-tight tracking-tight">Campanha com Influenciador aumentou retenção em 22% nas últimas 2h.</p>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>

  );
}

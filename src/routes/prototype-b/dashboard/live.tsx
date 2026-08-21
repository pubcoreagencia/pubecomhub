import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Activity, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  TrendingUp, 
  Eye, 
  MousePointerClick,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/live')({
  component: LiveShopB
});

function LiveShopB() {
  const stats = [
    { label: "Visitantes", value: "1,284", icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Carrinhos", value: "156", icon: ShoppingCart, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Checkouts", value: "42", icon: CreditCard, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Vendas", value: "18", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" }
  ];

  const funnelSteps = [
    { label: "Page View", count: 1284, percentage: 100, color: "bg-blue-500" },
    { label: "Add to Cart", count: 156, percentage: 12.1, color: "bg-orange-500" },
    { label: "Add Payment Info", count: 42, percentage: 3.2, color: "bg-indigo-500" },
    { label: "Purchase", count: 18, percentage: 1.4, color: "bg-emerald-500" }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">Live Shop</h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Ao Vivo</span>
            </div>
          </div>
          <p className="text-slate-500 font-bold">Monitoramento de eventos em tempo real.</p>
        </div>
        <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 shadow-xl shadow-primary/20">
          Configurar Campanha <Zap className="ml-2 h-4 w-4 fill-current" />
        </Button>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Card key={i} className="group shadow-sm border-none ring-1 ring-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 bg-white rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{s.label}</CardTitle>
              <div className={cn("p-2 rounded-xl transition-all duration-300 group-hover:scale-110", s.bg)}>
                {React.createElement(s.icon, { className: cn("h-4 w-4", s.color) })}
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Funnel */}
        <Card className="lg:col-span-2 rounded-3xl border-none ring-1 ring-slate-100 shadow-sm overflow-hidden bg-white p-8">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black tracking-tighter text-slate-900">Funil de Conversão</h3>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taxa de Conversão</p>
                <p className="text-xl font-black text-emerald-600">1.4%</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {funnelSteps.map((step, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{step.label}</span>
                    <span className="text-[10px] font-bold text-slate-400 ml-2 italic">({step.count} eventos)</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{step.percentage}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000", step.color)} 
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Real-time Events Log */}
        <Card className="rounded-3xl border-none ring-1 ring-slate-100 shadow-sm overflow-hidden bg-white">
          <CardHeader className="px-8 py-6 border-b border-slate-50">
            <CardTitle className="text-lg font-black tracking-tighter text-slate-900">Eventos em Tempo Real</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="px-8 py-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <ShoppingCart className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate">Nova Venda!</p>
                    <p className="text-xs font-bold text-slate-500">Smartphone Pro • Loja Tech</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">há 2 minutos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">R$ 2.999</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full h-14 rounded-none border-t border-slate-50 font-black text-[10px] uppercase tracking-widest text-primary hover:bg-primary/5">
              Ver Log Completo <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

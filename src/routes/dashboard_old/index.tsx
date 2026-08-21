import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockOrders, calculateFinance } from '@/data/mock';
import { DollarSign, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Package, LayoutDashboard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/dashboard_old/')({
  head: () => ({
    meta: [
      { title: "Dashboard Master | PUB ECOM" },
      { name: "description", content: "Visão geral da sua operação de e-commerce em tempo real." },
      { property: "og:title", content: "Dashboard Master | PUB ECOM" },
      { property: "og:description", content: "Visão geral da sua operação de e-commerce em tempo real." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const finance = calculateFinance(mockOrders);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    { label: 'Faturamento Bruto', value: finance.grossRevenue, icon: DollarSign, trend: '+12.5%', color: 'text-emerald-600', description: 'Total de vendas brutas' },
    { label: 'Pedidos Ativos', value: mockOrders.length, icon: ShoppingCart, trend: '+4', color: 'text-blue-600', description: 'Pedidos em processamento' },
    { label: 'Lucro Líquido PUB', value: finance.pubEcomNetResult, icon: TrendingUp, trend: '+8.2%', color: 'text-indigo-600', description: 'Resultado final da plataforma' },
    { label: 'Visitantes Online', value: 42, icon: Users, trend: 'Tempo real', color: 'text-amber-600', description: 'Usuários ativos agora' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shadow-sm border-slate-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[120px] mb-2" />
                <Skeleton className="h-3 w-[150px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Visão Geral da Operação</h2>
        <div className="flex gap-2">
           <Badge variant="outline" className="bg-white">Últimos 30 dias</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <Card key={i} className="group shadow-sm border-slate-100 transition-all hover:shadow-xl hover:border-primary/10 hover:-translate-y-1 bg-white rounded-3xl overflow-hidden relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-6 px-6">
              <div className="flex items-center gap-3">
                <div className={cn("p-3 rounded-2xl transition-all duration-300 group-hover:scale-110", m.color.replace('text-', 'bg-').replace('600', '100'))}>
                  {React.createElement(m.icon, {
                    className: cn("h-5 w-5", m.color)
                  })}
                </div>
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{m.label}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-3xl font-black text-slate-900 tracking-tighter">R$ {m.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 font-bold uppercase tracking-wide">
                {m.trend.includes('+') ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" /> : null}
                {m.trend}
                <span className="text-slate-400 font-medium"> vs. 30d</span>
              </p>
            </CardContent>
            {/* Hover Indicator */}
            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-slate-50">
               <div className={cn("h-full w-1/3 transition-all duration-500", m.color.replace('text-', 'bg-'))} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-slate-100 rounded-3xl p-6">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-lg font-black tracking-tight text-slate-900">Desempenho de Vendas (Diário)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[280px] flex items-end justify-between gap-4">
              {[40, 60, 45, 90, 65, 80, 50].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-3 group w-full">
                  <div className="bg-slate-50 flex-1 w-full rounded-2xl relative overflow-hidden transition-all hover:bg-slate-100 cursor-pointer">
                     <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary to-indigo-500 rounded-2xl transition-all duration-700 ease-out group-hover:brightness-110" style={{ height: `${h}%` }} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors">
                     {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 shadow-sm border-slate-100 rounded-3xl p-6">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-lg font-black tracking-tight text-slate-900">Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4">
              {mockOrders.map(order => (
                <div key={order.id} className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                     <Package className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-black text-slate-900">Pedido #{order.id}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loja Tech • Smartphone Pro</p>
                  </div>
                  <div className="text-sm font-black text-slate-900">+R$ {order.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">
                 Ver todos os pedidos <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockOrders, calculateFinance } from '@/data/mock';
import { DollarSign, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/dashboard/')({
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
    { label: 'Faturamento Bruto', value: finance.grossRevenue, icon: DollarSign, trend: '+12.5%', color: 'text-emerald-600' },
    { label: 'Pedidos Ativos', value: mockOrders.length, icon: ShoppingCart, trend: '+4', color: 'text-blue-600' },
    { label: 'Lucro Líquido PUB', value: finance.pubEcomNetResult, icon: TrendingUp, trend: '+8.2%', color: 'text-indigo-600' },
    { label: 'Visitantes Online', value: 42, icon: Users, trend: 'Tempo real', color: 'text-amber-600' },
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <Card key={i} className="shadow-sm border-slate-100 transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase text-slate-500">{m.label}</CardTitle>
              <m.icon className={cn("h-4 w-4", m.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">R$ {m.value.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                {m.trend.includes('+') ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : null}
                {m.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle className="text-base">Desempenho de Vendas (Diário)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-end justify-between gap-3 px-4 pt-4">
              {[40, 60, 45, 90, 65, 80, 50].map((h, i) => (
                <div key={i} className="bg-indigo-100 w-full rounded-t-lg hover:bg-primary/20 transition-all cursor-pointer relative group">
                   <div className="absolute inset-x-0 bottom-0 bg-primary/80 rounded-t-lg transition-all" style={{ height: `${h}%` }} />
                   <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {h * 10}
                   </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle className="text-base">Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockOrders.map(order => (
                <div key={order.id} className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                     <Package className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-bold text-slate-900">Pedido #{order.id}</p>
                    <p className="text-xs text-slate-500">Loja Tech • Smartphone Pro</p>
                  </div>
                  <div className="text-sm font-bold text-slate-900">+R$ {order.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Badge({ children, variant = 'default', className }: { children: React.ReactNode; variant?: 'default' | 'outline', className?: string }) {
  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
      variant === 'outline' ? "border text-slate-600" : "bg-primary text-white",
      className
    )}>
      {children}
    </span>
  );
}

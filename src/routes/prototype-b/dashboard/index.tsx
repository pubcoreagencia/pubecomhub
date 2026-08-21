import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  Package,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { financialService } from '../../../prototype-b/services/financialService';
import { mockOrders } from '../../../prototype-b/data/mock';

export const Route = createFileRoute('/prototype-b/dashboard/')({
  component: DashboardIndexB
});

function DashboardIndexB() {
  const [summary, setSummary] = React.useState<any>(null);

  React.useEffect(() => {
    financialService.calculateSummary(mockOrders).then(setSummary);
  }, []);

  if (!summary) return null;

  const metrics = [
    { 
      label: "Faturamento Total", 
      value: `R$ ${summary.totalRevenue.toLocaleString('pt-BR')}`, 
      trend: "+12.5%", 
      positive: true,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    { 
      label: "Lucro Líquido", 
      value: `R$ ${summary.netProfit.toLocaleString('pt-BR')}`, 
      trend: "+8.2%", 
      positive: true,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      label: "Resultado PUB", 
      value: `R$ ${summary.pubResult.toLocaleString('pt-BR')}`, 
      trend: "+15.3%", 
      positive: true,
      icon: Activity,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    { 
      label: "Pedidos", 
      value: mockOrders.length.toString(), 
      trend: "+5.4%", 
      positive: true,
      icon: Package,
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900">Dashboard Master</h1>
        <p className="text-slate-500 font-bold">Visão geral da operação Prototype B.</p>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <Card key={i} className="group shadow-sm border-slate-100 transition-all hover:shadow-xl hover:border-primary/10 hover:-translate-y-1 bg-white rounded-3xl overflow-hidden relative border-none ring-1 ring-slate-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-6 px-6">
              <div className="flex items-center gap-3">
                <div className={cn("p-3 rounded-2xl transition-all duration-300 group-hover:scale-110", m.bg)}>
                  {React.createElement(m.icon, { className: cn("h-5 w-5", m.color) })}
                </div>
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{m.label}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-3xl font-black text-slate-900 tracking-tighter">{m.value}</div>
              <div className="flex items-center mt-2">
                <div className={cn(
                  "flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full",
                  m.positive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                )}>
                  {m.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {m.trend}
                </div>
                <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-wider">vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <Card className="lg:col-span-2 rounded-3xl border-none ring-1 ring-slate-100 shadow-sm overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between px-8 py-6 border-b border-slate-50">
            <CardTitle className="text-lg font-black tracking-tighter text-slate-900">Pedidos Recentes</CardTitle>
            <Button variant="ghost" size="sm" className="rounded-xl font-black text-[10px] uppercase tracking-widest text-primary hover:bg-primary/5">
              Ver todos <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID</th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data</th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5 text-sm font-black text-slate-900">#{order.id}</td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          order.status === 'delivered' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right text-sm font-black text-slate-900">
                        R$ {order.amount.toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Stats */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-none ring-1 ring-slate-100 shadow-sm overflow-hidden bg-primary text-white p-8 relative">
            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-black tracking-tighter">Live Shop Ativo</h3>
              <p className="text-white/80 text-sm font-bold">124 pessoas visualizando seus produtos agora.</p>
              <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 shadow-xl shadow-black/10">
                Ver Monitor Ao Vivo
              </Button>
            </div>
            <Activity className="absolute bottom-[-20px] right-[-20px] h-40 w-40 text-white/10" />
          </Card>
        </div>
      </div>
    </div>
  );
}

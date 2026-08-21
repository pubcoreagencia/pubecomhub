import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileText,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { financialService } from '../../../prototype-b/services/financialService';
import { mockOrders } from '../../../prototype-b/data/mock';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/finance')({
  component: FinanceDashboardB
});

function FinanceDashboardB() {
  const [summary, setSummary] = React.useState<any>(null);

  React.useEffect(() => {
    financialService.calculateSummary(mockOrders).then(setSummary);
  }, []);

  if (!summary) return null;

  const cards = [
    { label: "Faturamento Bruto", value: `R$ ${summary.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-emerald-600" },
    { label: "Custos Totais", value: `R$ ${summary.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-rose-600" },
    { label: "Lucro Líquido", value: `R$ ${summary.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-blue-600" },
    { label: "Comissões Influencers", value: `R$ ${summary.commissions.influencers.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: FileText, color: "text-indigo-600" }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Financeiro</h1>
          <p className="text-slate-500 font-bold">Gestão de margens e comissionamentos.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl font-black text-xs uppercase tracking-widest px-6 h-12 border-slate-200">
            Exportar Relatório <Download className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="rounded-2xl font-black text-xs uppercase tracking-widest px-6 h-12 border-slate-200">
            Filtros <Filter className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <Card key={i} className="shadow-sm border-none ring-1 ring-slate-100 bg-white rounded-3xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-slate-50">
                {React.createElement(c.icon, { className: cn("h-5 w-5", c.color) })}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{c.label}</p>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tighter">{c.value}</div>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border-none ring-1 ring-slate-100 shadow-sm overflow-hidden bg-white">
        <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-black tracking-tighter text-slate-900">Relatório Detalhado</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pedido</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Venda</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Custo</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Lucro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 text-sm font-bold text-slate-500">{new Date(o.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900">#{o.id}</td>
                  <td className="px-8 py-5 text-right text-sm font-black text-slate-900">R$ {o.amount.toLocaleString('pt-BR')}</td>
                  <td className="px-8 py-5 text-right text-sm font-bold text-slate-500">R$ {o.cost.toLocaleString('pt-BR')}</td>
                  <td className="px-8 py-5 text-right text-sm font-black text-emerald-600">
                    R$ {(o.amount - o.cost).toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

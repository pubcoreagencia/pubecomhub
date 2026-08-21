import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockOrders, calculateFinance } from '@/data/mock';
import { Wallet, ArrowDownRight, ArrowUpRight, TrendingUp, Percent, Download, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/dashboard/finance')({
  component: FinancePage,
});

function FinancePage() {
  const [loading, setLoading] = useState(true);
  const finance = calculateFinance(mockOrders);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    { label: 'Faturamento Bruto', value: finance.grossRevenue, icon: Wallet, color: 'text-slate-900', bg: 'bg-slate-50' },
    { label: 'Custo Prod. + Frete', value: finance.productCost + finance.shipping, icon: ArrowDownRight, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Taxas & Descontos', value: finance.paymentFees + finance.discounts, icon: ArrowDownRight, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Lucro Líquido Geral', value: finance.netProfit, icon: ArrowUpRight, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Repasse Influencers', value: finance.influencerPayout, icon: Percent, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Resultado PUB ECOM', value: finance.pubEcomNetResult, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', highlight: true },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 leading-none">Central Financeira</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Gestão de margens, custos e repasses da operação centralizada.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 rounded-full border-slate-200 font-bold text-[10px] uppercase tracking-widest px-6 h-11 bg-white">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>Mês Atual</span>
          </Button>
          <Button size="sm" className="gap-2 rounded-full px-8 h-11 shadow-xl shadow-primary/10 font-bold text-[10px] uppercase tracking-widest">
            <Download className="h-4 w-4" />
            <span>Exportar CSV</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="shadow-sm border-slate-100 rounded-3xl h-32">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-5 rounded-lg" />
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <Skeleton className="h-10 w-32" />
              </CardContent>
            </Card>
          ))
        ) : (
          metrics.map((m, i) => (
            <Card key={i} className={cn(
              "group shadow-sm border-slate-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 rounded-3xl bg-white relative overflow-hidden",
              m.highlight && "border-indigo-200 ring-4 ring-indigo-50/50"
            )}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-600 transition-colors">{m.label}</CardTitle>
                <div className={cn("p-2.5 rounded-xl transition-all duration-500 group-hover:scale-110 shadow-sm", m.bg)}>
                  {React.createElement(m.icon, { className: cn("h-4.5 w-4.5", m.color) })}
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-2">
                <div className={cn("text-3xl font-black tracking-tighter text-slate-900 group-hover:scale-[1.02] transition-transform origin-left", m.color)}>
                  R$ {m.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                {m.highlight && (
                   <div className="mt-3 flex items-center gap-2">
                      <Badge className="bg-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-full px-2 py-0 border-none">Plataforma</Badge>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Resultado Final</span>
                   </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>


      <Card className="shadow-sm border-none rounded-[2.5rem] bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-black tracking-tight text-slate-900">Histórico de Transações Detalhado</CardTitle>
          <div className="flex gap-2">
             <Button variant="ghost" size="sm" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                <Filter className="h-4 w-4" />
             </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-b-slate-100 h-14">
                <TableHead className="pl-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ID Pedido</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Origem Lojista</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Faturamento</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Custos Totais</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Lucro Líquido</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Comissão Influencer</TableHead>
                <TableHead className="pr-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Resultado PUB ECOM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((o) => {
                const fees = o.amount * 0.05;
                const net = o.amount - o.cost - o.shipping - fees - o.discount;
                const inf = o.influencerId ? net * 0.5 : 0;
                const pub = net - inf;
                return (
                  <TableRow key={o.id} className="hover:bg-slate-50/30 transition-all border-b-slate-50 last:border-0 h-20 group">
                    <TableCell className="font-black pl-8 text-slate-900 text-sm group-hover:text-primary transition-colors">#{o.id}</TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">Loja Tech</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master Admin</span>
                       </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900 text-sm">R$ {o.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-rose-500 font-bold text-sm">-R$ {(o.cost + o.shipping + fees).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-emerald-600 font-black text-base">R$ {net.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                       {inf > 0 ? (
                         <div className="flex flex-col">
                            <span className="text-blue-600 font-black text-sm">R$ {inf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">(50% do Lucro)</span>
                         </div>
                       ) : (
                         <span className="text-slate-300 font-bold text-xs">—</span>
                       )}
                    </TableCell>
                    <TableCell className="font-black text-indigo-600 pr-8 text-right text-lg tracking-tighter group-hover:scale-105 transition-transform origin-right">
                       R$ {pub.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>

  );
}

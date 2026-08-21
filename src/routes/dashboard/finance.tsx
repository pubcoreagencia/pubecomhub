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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Central Financeira</h2>
          <p className="text-slate-500 text-sm">Gestão de margens, custos e repasses da operação.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 rounded-full border-slate-200">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Este Mês</span>
          </Button>
          <Button size="sm" className="gap-2 rounded-full px-4 shadow-sm">
            <Download className="h-3.5 w-3.5" />
            <span>Exportar</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="shadow-sm border-slate-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))
        ) : (
          metrics.map((m, i) => (
            <Card key={i} className={cn(
              "shadow-sm border-slate-100 transition-all hover:shadow-md",
              m.highlight && "border-indigo-200 bg-indigo-50/30"
            )}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
                <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{m.label}</CardTitle>
                <div className={cn("p-1.5 rounded-lg", m.bg)}>
                  <m.icon className={cn("h-3.5 w-3.5", m.color)} />
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className={cn("text-2xl font-bold text-slate-900", m.color)}>
                  R$ {m.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="shadow-sm border-slate-100">
        <CardHeader className="px-6 py-4 border-b border-slate-50">
          <CardTitle className="text-base font-bold text-slate-900">Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-b-slate-100">
                <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">Pedido</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Loja</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Faturamento</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Custo Total</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-emerald-600">Lucro Líq.</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-blue-600">Influencer</TableHead>
                <TableHead className="pr-6 text-right text-[10px] font-bold uppercase tracking-wider text-indigo-600">PUB ECOM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((o) => {
                const fees = o.amount * 0.05;
                const net = o.amount - o.cost - o.shipping - fees - o.discount;
                const inf = o.influencerId ? net * 0.5 : 0;
                const pub = net - inf;
                return (
                  <TableRow key={o.id} className="hover:bg-slate-50/50 transition-colors border-b-slate-50 last:border-0">
                    <TableCell className="font-bold pl-6 text-slate-900">#{o.id}</TableCell>
                    <TableCell className="text-slate-500 font-medium">Loja Tech</TableCell>
                    <TableCell className="font-medium text-slate-900">R$ {o.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-rose-500 font-medium">-R$ {(o.cost + o.shipping + fees).toFixed(2)}</TableCell>
                    <TableCell className="text-emerald-600 font-bold">R$ {net.toFixed(2)}</TableCell>
                    <TableCell className="text-blue-600 font-bold">{inf > 0 ? `R$ ${inf.toFixed(2)}` : '-'}</TableCell>
                    <TableCell className="font-black text-indigo-600 pr-6 text-right text-base">R$ {pub.toFixed(2)}</TableCell>
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

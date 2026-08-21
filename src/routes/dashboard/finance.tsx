import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockOrders, calculateFinance } from '@/data/mock';
import { Wallet, ArrowDownRight, ArrowUpRight, TrendingUp, Percent } from 'lucide-react';

export const Route = createFileRoute('/dashboard/finance')({
  component: FinancePage,
});

function FinancePage() {
  const finance = calculateFinance(mockOrders);

  const metrics = [
    { label: 'Faturamento Bruto', value: finance.grossRevenue, icon: Wallet, color: 'text-slate-900' },
    { label: 'Custo dos Produtos', value: finance.productCost, icon: ArrowDownRight, color: 'text-red-500' },
    { label: 'Frete', value: finance.shipping, icon: ArrowDownRight, color: 'text-red-500' },
    { label: 'Taxas de Pagamento', value: finance.paymentFees, icon: ArrowDownRight, color: 'text-red-500' },
    { label: 'Descontos', value: finance.discounts, icon: ArrowDownRight, color: 'text-red-500' },
    { label: 'Lucro Líquido Geral', value: finance.netProfit, icon: ArrowUpRight, color: 'text-green-500' },
    { label: 'Comissão Afiliados', value: finance.affiliateCommission, icon: Percent, color: 'text-blue-500' },
    { label: 'Repasse Influencers', value: finance.influencerPayout, icon: Percent, color: 'text-blue-500' },
    { label: 'Resultado PUB ECOM', value: finance.pubEcomNetResult, icon: TrendingUp, color: 'text-primary font-bold' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Central Financeira</h2>
        <p className="text-muted-foreground">Gestão completa de margens, custos e repasses da operação central.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m, i) => (
          <Card key={i} className={cn(i === metrics.length - 1 ? "border-primary bg-primary/5 shadow-md" : "")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium uppercase text-muted-foreground">{m.label}</CardTitle>
              <m.icon className={cn("h-4 w-4", m.color)} />
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", m.color)}>
                R$ {m.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Loja</TableHead>
                <TableHead>Faturamento</TableHead>
                <TableHead>Custo Prod.</TableHead>
                <TableHead>Taxas/Frete</TableHead>
                <TableHead>Lucro Líq.</TableHead>
                <TableHead>Influencer</TableHead>
                <TableHead>PUB ECOM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((o) => {
                const fees = o.amount * 0.05;
                const net = o.amount - o.cost - o.shipping - fees - o.discount;
                const inf = o.influencerId ? net * 0.5 : 0;
                const pub = net - inf;
                return (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">#{o.id}</TableCell>
                    <TableCell>Loja Tech</TableCell>
                    <TableCell>R$ {o.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-red-500">-R$ {o.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-red-500">-R$ {(o.shipping + fees).toFixed(2)}</TableCell>
                    <TableCell className="text-green-500 font-semibold">R$ {net.toFixed(2)}</TableCell>
                    <TableCell>{inf > 0 ? `R$ ${inf.toFixed(2)}` : '-'}</TableCell>
                    <TableCell className="font-bold">R$ {pub.toFixed(2)}</TableCell>
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

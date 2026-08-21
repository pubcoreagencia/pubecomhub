import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockOrders } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Truck, CheckCircle2, Package, Activity as ActivityIcon, Search, Filter, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/dashboard/orders')({
  component: OrdersPage,
});

function OrdersPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'delivered': return <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-bold uppercase">Entregue</Badge>;
      case 'shipped': return <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none text-[10px] font-bold uppercase">Enviado</Badge>;
      case 'purchased_from_supplier': return <Badge variant="secondary" className="bg-purple-50 text-purple-600 border-none text-[10px] font-bold uppercase">Comprado</Badge>;
      case 'paid': return <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-none text-[10px] font-bold uppercase">Pago</Badge>;
      default: return <Badge variant="outline" className="text-[10px] font-bold uppercase border-slate-200 text-slate-400">Pendente</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
     switch(status) {
      case 'delivered': return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
      case 'shipped': return <Truck className="h-3.5 w-3.5 text-blue-500" />;
      case 'purchased_from_supplier': return <Package className="h-3.5 w-3.5 text-purple-500" />;
      case 'paid': return <ShoppingBag className="h-3.5 w-3.5 text-amber-500" />;
      default: return <ActivityIcon className="h-3.5 w-3.5 text-slate-300" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Rastreio de Pedidos</h2>
          <p className="text-slate-500 text-sm">Acompanhe o fluxo completo da operação centralizada.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Buscar pedido por ID ou produto..." className="pl-9 bg-white border-slate-200 rounded-full h-10 shadow-sm" />
         </div>
         <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 rounded-full border-slate-200 text-slate-600">
               <Filter className="h-3.5 w-3.5 text-slate-400" />
               <span>Filtrar Status</span>
            </Button>
         </div>
      </div>

      <Card className="shadow-sm border-slate-100 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-b-slate-100">
                <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">ID Pedido</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Loja & Origem</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Produto</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Valor Total</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Status Atual</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Data Compra</TableHead>
                <TableHead className="text-right pr-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i} className="border-b-slate-50">
                    <TableCell className="font-bold pl-6"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-28 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                mockOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors border-b-slate-50 last:border-0">
                    <TableCell className="font-bold pl-6 text-slate-900 py-4">#{order.id}</TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">Loja Tech</span>
                          <span className="text-[10px] font-bold text-primary uppercase">Orgânico</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-slate-500 font-medium">Smartphone Pro</TableCell>
                    <TableCell className="font-bold text-slate-900">R$ {order.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        {getStatusBadge(order.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs font-medium">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary transition-colors">
                         <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

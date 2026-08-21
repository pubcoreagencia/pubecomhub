import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockOrders } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Truck, CheckCircle2, Package, Activity as ActivityIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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
      case 'delivered': return <Badge className="bg-green-50 text-green-700 border-green-200">Entregue</Badge>;
      case 'shipped': return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Enviado</Badge>;
      case 'purchased_from_supplier': return <Badge className="bg-purple-50 text-purple-700 border-purple-200">Comprado (Forn.)</Badge>;
      case 'paid': return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Pago</Badge>;
      default: return <Badge variant="outline">Pendente</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
     switch(status) {
      case 'delivered': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-blue-500" />;
      case 'purchased_from_supplier': return <Package className="h-4 w-4 text-purple-500" />;
      case 'paid': return <ShoppingBag className="h-4 w-4 text-orange-500" />;
      default: return <ActivityIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pedidos</h2>
        <p className="text-muted-foreground">Rastreie o fluxo completo de dropshipping centralizado.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">ID Pedido</TableHead>
                <TableHead>Loja</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-bold pl-6"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-28 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right pr-6"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                mockOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-bold pl-6">#{order.id}</TableCell>
                    <TableCell>Loja Tech</TableCell>
                    <TableCell>Smartphone Pro</TableCell>
                    <TableCell>R$ {order.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        {getStatusBadge(order.status)}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="outline" size="sm">Detalhes</Button>
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


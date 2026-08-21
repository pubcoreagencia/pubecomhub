import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Package, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Clock, 
  Truck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockOrders } from '../../../prototype-b/data/mock';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/orders')({
  component: OrdersDashboardB
});

function OrdersDashboardB() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-emerald-50 text-emerald-600 border-none ring-1 ring-emerald-100 font-black uppercase text-[8px]">Pago</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-50 text-blue-600 border-none ring-1 ring-blue-100 font-black uppercase text-[8px]">Enviado</Badge>;
      case 'pending':
        return <Badge className="bg-orange-50 text-orange-600 border-none ring-1 ring-orange-100 font-black uppercase text-[8px]">Pendente</Badge>;
      default:
        return <Badge className="bg-slate-50 text-slate-600 border-none ring-1 ring-slate-100 font-black uppercase text-[8px]">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Pedidos</h1>
          <p className="text-slate-500 font-bold">Rastreamento e gestão de vendas em tempo real.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl font-black text-xs uppercase tracking-widest px-6 h-12 border-slate-200">
            Exportar CSV <Download className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="rounded-3xl border-none ring-1 ring-slate-100 shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar por cliente, pedido ou código de rastreio..." 
              className="pl-12 h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold text-sm"
            />
          </div>
          <Button variant="outline" className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-slate-100">
            Filtros Avançados <Filter className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID Pedido</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cliente</th>
                  <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total</th>
                  <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5 text-sm font-black text-slate-900 italic">#{order.id}</td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-500">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900">João Silva</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">joao@email.com</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right text-sm font-black text-slate-900 tracking-tighter">
                      R$ {order.amount.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-8 py-5 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-4 w-4 text-slate-900" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

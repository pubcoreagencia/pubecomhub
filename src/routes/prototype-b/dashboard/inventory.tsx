import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  AlertCircle,
  RefreshCcw,
  Plus,
  Search,
  Box
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/inventory')({
  component: InventoryDashboardB
});

function InventoryDashboardB() {
  const stock = [
    { name: "Fone Titanium X1", sku: "TIT-X1-BLK", stock: 154, status: "Normal", color: "text-slate-900" },
    { name: "Cadeira Ergo Nordic", sku: "NRD-CH-GRY", stock: 12, status: "Baixo", color: "text-orange-600" },
    { name: "Teclado Minimalist", sku: "MIN-KB-WHT", stock: 0, status: "Esgotado", color: "text-rose-600" }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Estoque Global</h1>
          <p className="text-slate-500 font-bold">Monitoramento de inventário e reposição.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl font-black text-xs uppercase tracking-widest px-6 h-12 border-slate-200">
            Sincronizar Fornecedores <RefreshCcw className="ml-2 h-4 w-4" />
          </Button>
          <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 shadow-xl shadow-primary/20">
            Entrada de Estoque <Plus className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm bg-white p-8">
          <div className="flex items-center gap-3 text-slate-400 mb-2">
            <Box className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Itens Totais</span>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tighter italic">8.420</p>
        </Card>
        <Card className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm bg-white p-8">
          <div className="flex items-center gap-3 text-orange-600 mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Estoque Baixo</span>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tighter italic">24</p>
        </Card>
        <Card className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm bg-white p-8">
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Giro de Estoque</span>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tighter italic">4.2x</p>
        </Card>
      </div>

      <Card className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm overflow-hidden bg-white">
        <div className="p-6 border-b border-slate-50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar por SKU ou Nome..." 
              className="pl-12 h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-sm"
            />
          </div>
        </div>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Produto</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">SKU</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Qtd Disponível</th>
                <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stock.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 text-sm font-black text-slate-900 uppercase tracking-tighter">{item.name}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-400 font-mono">{item.sku}</td>
                  <td className={cn("px-8 py-5 text-right text-sm font-black italic", item.color)}>
                    {item.stock}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <Badge className={cn(
                      "border-none ring-1 text-[8px] font-black uppercase",
                      item.status === 'Normal' ? "bg-emerald-50 text-emerald-600 ring-emerald-100" :
                      item.status === 'Baixo' ? "bg-orange-50 text-orange-600 ring-orange-100" :
                      "bg-rose-50 text-rose-600 ring-rose-100"
                    )}>
                      {item.status}
                    </Badge>
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

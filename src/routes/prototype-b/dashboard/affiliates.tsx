import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  TrendingUp, 
  Zap, 
  Award,
  Settings,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/affiliates')({
  component: AffiliatesDashboardB
});

function AffiliatesDashboardB() {
  const affiliates = [
    { name: "Lucas Mendes", sales: "R$ 12.450", commission: "10%", totalEarned: "R$ 1.245", leads: 452, status: "Active" },
    { name: "Maria Clara", sales: "R$ 8.920", commission: "12%", totalEarned: "R$ 1.070", leads: 310, status: "Active" }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Afiliados</h1>
          <p className="text-slate-500 font-bold">Gestão de rede de afiliados e comissionamento variável.</p>
        </div>
        <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 shadow-xl shadow-primary/20">
          Recrutar Afiliado <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm bg-white p-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Volume de Vendas</p>
          <p className="text-3xl font-black text-slate-900 tracking-tighter">R$ 45.280</p>
        </Card>
        <Card className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm bg-white p-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Comissões Pagas</p>
          <p className="text-3xl font-black text-slate-900 tracking-tighter">R$ 4.528</p>
        </Card>
        <Card className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm bg-white p-8 border-l-4 border-l-primary">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Taxa de Conversão</p>
          <p className="text-3xl font-black text-primary tracking-tighter italic">4.8%</p>
        </Card>
      </div>

      <Card className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm overflow-hidden bg-white">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nome de afiliado..." 
              className="pl-12 h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-sm"
            />
          </div>
          <Button variant="outline" className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-slate-100">
            Exportar Dados
          </Button>
        </div>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Afiliado</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vendas Atribuídas</th>
                <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Comissão</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ganhos Totais</th>
                <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Leads</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {affiliates.map((a, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5 text-sm font-black text-slate-900 uppercase tracking-tighter">{a.name}</td>
                  <td className="px-8 py-5 text-right text-sm font-bold text-slate-500">{a.sales}</td>
                  <td className="px-8 py-5 text-center">
                    <Badge className="bg-slate-50 text-slate-900 border-none ring-1 ring-slate-100 font-black text-[9px]">{a.commission}</Badge>
                  </td>
                  <td className="px-8 py-5 text-right text-sm font-black text-emerald-600 italic">{a.totalEarned}</td>
                  <td className="px-8 py-5 text-center text-sm font-bold text-slate-400">{a.leads}</td>
                  <td className="px-8 py-5 text-right">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Settings className="h-4 w-4 text-slate-900" />
                    </Button>
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

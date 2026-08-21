import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Megaphone, 
  Target, 
  MousePointer2, 
  BarChart3, 
  Plus,
  ExternalLink,
  Facebook,
  Instagram
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/marketing')({
  component: MarketingDashboardB
});

function MarketingDashboardB() {
  const campaigns = [
    { name: "Black Friday 2026", channel: "Meta Ads", budget: "R$ 50.000", spent: "R$ 12.500", roi: "4.2x", status: "Active" },
    { name: "Lançamento Titanium", channel: "Google Ads", budget: "R$ 30.000", spent: "R$ 8.200", roi: "3.8x", status: "Active" },
    { name: "Remarketing L2-L3", channel: "Meta Ads", budget: "R$ 15.000", spent: "R$ 5.400", roi: "5.1x", status: "Active" }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Marketing & Ads</h1>
          <p className="text-slate-500 font-bold">Gerenciamento de tráfego pago e campanhas.</p>
        </div>
        <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 shadow-xl shadow-primary/20">
          Criar Campanha <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-3xl border-none ring-1 ring-slate-100 shadow-sm bg-white p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Facebook className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tighter text-slate-900">Meta Ads</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conta Conectada</p>
              </div>
            </div>
            <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 rounded-full font-black px-4 py-1 uppercase tracking-widest text-[9px] border-none ring-1 ring-emerald-100">
              Online
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CPA Médio</p>
              <p className="text-lg font-black text-slate-900">R$ 14,20</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CTR</p>
              <p className="text-lg font-black text-slate-900">2.84%</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ROI</p>
              <p className="text-lg font-black text-emerald-600">4.2x</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-none ring-1 ring-slate-100 shadow-sm bg-white p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                <Megaphone className="h-7 w-7 text-slate-900" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tighter text-slate-900">Google Ads</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conta Conectada</p>
              </div>
            </div>
            <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 rounded-full font-black px-4 py-1 uppercase tracking-widest text-[9px] border-none ring-1 ring-emerald-100">
              Online
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CPA Médio</p>
              <p className="text-lg font-black text-slate-900">R$ 18,50</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CTR</p>
              <p className="text-lg font-black text-slate-900">1.95%</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ROI</p>
              <p className="text-lg font-black text-emerald-600">3.8x</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="rounded-3xl border-none ring-1 ring-slate-100 shadow-sm overflow-hidden bg-white">
        <CardHeader className="px-8 py-6 border-b border-slate-50">
          <CardTitle className="text-lg font-black tracking-tighter text-slate-900 uppercase">Campanhas Ativas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Campanha</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Canal</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Orçamento</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Gasto</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ROI</th>
                <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {campaigns.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 text-sm font-black text-slate-900">{c.name}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-500 italic">{c.channel}</td>
                  <td className="px-8 py-5 text-right text-sm font-bold text-slate-500">{c.budget}</td>
                  <td className="px-8 py-5 text-right text-sm font-bold text-slate-500">{c.spent}</td>
                  <td className="px-8 py-5 text-right text-sm font-black text-emerald-600 italic">{c.roi}</td>
                  <td className="px-8 py-5 text-center">
                    <Badge className="bg-emerald-50 text-emerald-600 border-none ring-1 ring-emerald-100 text-[8px] font-black uppercase">Ativa</Badge>
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

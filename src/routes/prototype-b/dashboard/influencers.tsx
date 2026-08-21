import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Users, 
  Target, 
  Zap, 
  Star, 
  Award, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/influencers')({
  component: InfluencersDashboardB
});

function InfluencersDashboardB() {
  const influencers = [
    { 
      name: "Alex Rivera", 
      handle: "@arivera_tech", 
      followers: "1.2M", 
      sales: "R$ 145.200", 
      commission: "R$ 72.600",
      roi: "8.4x",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400"
    },
    { 
      name: "Sarah Chen", 
      handle: "@sarah.minimal", 
      followers: "850K", 
      sales: "R$ 92.450", 
      commission: "R$ 46.225",
      roi: "6.2x",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
    }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Influencers</h1>
          <p className="text-slate-500 font-bold">Gestão de parceiros e repasses (50% Lucro Líquido).</p>
        </div>
        <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 shadow-xl shadow-primary/20">
          Novo Parceiro <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm bg-white p-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Repasses</p>
          <p className="text-3xl font-black text-slate-900 tracking-tighter italic">R$ 118.825</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase">
            <TrendingUp className="h-3 w-3" /> +15.4% este mês
          </div>
        </Card>
        <Card className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm bg-white p-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ROI Médio</p>
          <p className="text-3xl font-black text-slate-900 tracking-tighter italic">7.3x</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase">
            <Zap className="h-3 w-3 fill-current" /> Alta Performance
          </div>
        </Card>
        <Card className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm bg-white p-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Parceiros Ativos</p>
          <p className="text-3xl font-black text-slate-900 tracking-tighter italic">42</p>
          <div className="mt-4 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase">
            <Users className="h-3 w-3" /> +3 novos esta semana
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {influencers.map((inf, i) => (
          <Card key={i} className="group rounded-[40px] border-none ring-1 ring-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="h-20 w-20 rounded-3xl overflow-hidden shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <img src={inf.image} alt={inf.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-tight">{inf.name}</h3>
                    <Badge className="bg-primary/5 text-primary border-none rounded-full font-black px-4 py-1 uppercase tracking-widest text-[9px]">
                      TOP PARCEIRO
                    </Badge>
                  </div>
                  <p className="text-sm font-bold text-slate-400 italic mt-1">{inf.handle}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8 border-y border-slate-50 py-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Vendas</p>
                  <p className="text-lg font-black text-slate-900">{inf.sales}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Comissão (50%)</p>
                  <p className="text-lg font-black text-emerald-600">{inf.commission}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">ROI</p>
                  <p className="text-lg font-black text-slate-900">{inf.roi}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest h-12 shadow-lg shadow-primary/10">
                  Ver Relatório <ArrowUpRight className="ml-2 h-3 w-3" />
                </Button>
                <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest h-12 border-slate-100 px-6">
                  Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Gift, 
  TrendingUp, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Star,
  Award,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/bonifications')({
  component: BonificationsDashboardB
});

function BonificationsDashboardB() {
  const bonuses = [
    { title: "Top Performance Mensal", target: "100 Vendas", reward: "Bônus R$ 5.000", recipients: 3, status: "Active" },
    { title: "Lançamento Titanium", target: "50 Vendas / 24h", reward: "Comissão Extra 5%", recipients: 12, status: "Active" },
    { title: "Fidelidade Semestral", target: "6 Meses Ativo", reward: "Selo Platinum VIP", recipients: 24, status: "Active" }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Bonificações</h1>
          <p className="text-slate-500 font-bold">Gamificação e incentivos para parceiros e afiliados.</p>
        </div>
        <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 shadow-xl shadow-primary/20">
          Nova Regra <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bonuses.map((b, i) => (
          <Card key={i} className="group rounded-[40px] border-none ring-1 ring-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white">
            <CardContent className="p-10 text-center flex flex-col items-center">
              <div className="h-20 w-20 rounded-[30px] bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                <Gift className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-tight mb-2">{b.title}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 italic">{b.target}</p>
              
              <div className="w-full bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recompensa</p>
                <p className="text-2xl font-black text-emerald-600 tracking-tighter italic">{b.reward}</p>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Users className="h-4 w-4" /> {b.recipients} Parceiros Qualificados
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm overflow-hidden bg-slate-900 text-white p-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tighter uppercase leading-tight">Gamificação Titanium Engine</h2>
            <p className="text-slate-400 font-bold max-w-xl leading-relaxed">
              Aumente o engajamento da sua rede criando desafios automáticos com recompensas em tempo real.
            </p>
          </div>
          <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-10 h-14 shadow-2xl shadow-primary/20 bg-primary hover:scale-105 transition-transform">
            Ver Configurações Avançadas <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

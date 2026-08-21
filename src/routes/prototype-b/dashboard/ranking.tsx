import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  Medal, 
  Zap, 
  ArrowUp, 
  Target, 
  Crown,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/ranking')({
  component: RankingDashboardB
});

function RankingDashboardB() {
  const ranks = [
    { pos: 1, name: "Loja Titanium Tech", metric: "R$ 450.200", type: "Revenue", trend: "+12%", color: "text-yellow-500", icon: Crown },
    { pos: 2, name: "Alex Rivera (Inf)", metric: "R$ 380.450", type: "Sales", trend: "+8%", color: "text-slate-400", icon: Trophy },
    { pos: 3, name: "Sarah Chen (Inf)", metric: "R$ 310.120", type: "Sales", trend: "+15%", color: "text-orange-600", icon: Medal },
    { pos: 4, name: "Minimalist Home", metric: "R$ 295.000", type: "Revenue", trend: "+5%", color: "text-slate-300", icon: Trophy }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Ranking Global</h1>
          <p className="text-slate-500 font-bold">Top performers da operação PUB ECOM.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl font-black text-xs uppercase tracking-widest px-6 h-12 border-slate-200">
            Filtro Semanal
          </Button>
          <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-6 h-12 shadow-xl shadow-primary/20">
            Exportar Ranking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top 3 Visual Podiums */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {ranks.slice(0, 3).map((r, i) => (
            <Card key={i} className={cn(
              "relative group rounded-[40px] border-none ring-1 ring-slate-100 shadow-sm transition-all duration-500 overflow-hidden",
              i === 0 ? "bg-slate-900 text-white md:-translate-y-4 shadow-2xl" : "bg-white"
            )}>
              <CardContent className="p-10 flex flex-col items-center text-center">
                <div className={cn(
                  "h-20 w-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl transform transition-transform group-hover:rotate-12",
                  i === 0 ? "bg-primary text-white" : "bg-slate-50 " + r.color
                )}>
                  {React.createElement(r.icon, { className: "h-10 w-10" })}
                </div>
                <Badge variant="outline" className={cn(
                  "text-[10px] font-black uppercase tracking-widest mb-4",
                  i === 0 ? "border-white/20 text-white" : "border-slate-100 text-slate-400"
                )}>
                  Posição #0{r.pos}
                </Badge>
                <h3 className="text-2xl font-black tracking-tighter uppercase leading-tight mb-2">{r.name}</h3>
                <p className={cn(
                  "text-3xl font-black tracking-tighter italic mb-4",
                  i === 0 ? "text-primary" : "text-slate-900"
                )}>{r.metric}</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <ArrowUp className="h-3 w-3 text-emerald-500" />
                  <span className={i === 0 ? "text-slate-400" : "text-emerald-500"}>{r.trend} vs semana anterior</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed List */}
        <Card className="lg:col-span-3 rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm overflow-hidden bg-white">
          <CardHeader className="px-10 py-8 border-b border-slate-50">
            <CardTitle className="text-lg font-black tracking-tighter text-slate-900 uppercase">Lista Completa</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {ranks.map((r, i) => (
                <div key={i} className="px-10 py-6 flex items-center justify-between group hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-8">
                    <span className="text-4xl font-black italic text-slate-100 group-hover:text-primary transition-colors leading-none w-12 text-center">
                      #{r.pos}
                    </span>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-tight">{r.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{r.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12 text-right">
                    <div>
                      <p className="text-xl font-black text-slate-900 tracking-tighter italic">{r.metric}</p>
                      <div className="flex items-center justify-end gap-1 text-emerald-500 text-[10px] font-black">
                        <ArrowUp className="h-3 w-3" /> {r.trend}
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-slate-100 group-hover:text-slate-300 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Zap, 
  Target, 
  BarChart3, 
  ArrowUpRight, 
  Layout, 
  Smartphone, 
  Monitor, 
  MousePointer2,
  TrendingUp,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/tracking')({
  component: TrackingDashboardB
});

function TrackingDashboardB() {
  const events = [
    { time: "Há 2 min", event: "Page View (L1)", user: "Visitante #8821", source: "Facebook Ads" },
    { time: "Há 5 min", event: "Add to Cart (L2)", user: "Visitante #8790", source: "Google / Organic" },
    { time: "Há 12 min", event: "Purchase (L4)", user: "João Silva", source: "Instagram / Alex Rivera" }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Tracking & Pixels</h1>
          <p className="text-slate-500 font-bold">Monitoramento de eventos e atribuição em tempo real.</p>
        </div>
        <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 shadow-xl shadow-primary/20">
          Configurar Pixel <Zap className="ml-2 h-4 w-4 fill-current" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Atribuição Sources */}
        <Card className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm bg-white p-8">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Fontes de Atribuição</h3>
          <div className="space-y-6">
            {[
              { label: 'Meta Ads', value: '45%', color: 'bg-blue-600' },
              { label: 'Google Ads', value: '28%', color: 'bg-slate-900' },
              { label: 'Influencers', value: '22%', color: 'bg-primary' },
              { label: 'Outros', value: '5%', color: 'bg-slate-200' }
            ].map((source, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>{source.label}</span>
                  <span className="text-slate-900">{source.value}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-1000", source.color)} style={{ width: source.value }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Real-time Event Log */}
        <Card className="lg:col-span-2 rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm overflow-hidden bg-white">
          <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black tracking-tighter text-slate-900 uppercase">Live Event Stream</CardTitle>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Ao Vivo</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {events.map((e, i) => (
                <div key={i} className="px-8 py-5 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white shadow-sm transition-colors">
                      <MousePointer2 className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{e.event}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{e.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{e.source}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 italic">{e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tracking Invariants Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Eventos Capturados', value: '1.2M', icon: Target },
          { label: 'Taxa de Atribuição', value: '98.4%', icon: TrendingUp },
          { label: 'Tempo de Resposta', value: '45ms', icon: Zap },
          { label: 'Dispositivos', value: '82% Mobile', icon: Smartphone }
        ].map((m, i) => (
          <Card key={i} className="rounded-2xl border-none ring-1 ring-slate-100 shadow-sm bg-white p-6">
            <div className="flex items-center gap-3 mb-2 text-slate-400">
              <m.icon className="h-4 w-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">{m.label}</span>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tighter italic">{m.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

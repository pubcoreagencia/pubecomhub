import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Search, 
  Globe, 
  BarChart3, 
  Zap, 
  ArrowUpRight, 
  ShieldCheck, 
  Plus,
  RefreshCcw,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/seo')({
  component: SEODashboardB
});

function SEODashboardB() {
  const keywords = [
    { term: "Titanium Headphones", position: 1, volume: "12.5K", trend: "+2" },
    { term: "Minimalist Smart Home", position: 3, volume: "8.2K", trend: "+5" },
    { term: "Nordic Office Chair", position: 2, volume: "15.1K", trend: "-1" }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">SEO & Orgânico</h1>
          <p className="text-slate-500 font-bold">Otimização de visibilidade e ranqueamento nos motores de busca.</p>
        </div>
        <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 shadow-xl shadow-primary/20">
          Gerar Sitemap <Zap className="ml-2 h-4 w-4 fill-current" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visibility Score */}
        <Card className="rounded-[40px] border-none ring-1 ring-slate-100 shadow-sm bg-slate-900 text-white p-10 flex flex-col items-center justify-center text-center">
          <div className="h-24 w-24 rounded-full border-8 border-primary/20 border-t-primary flex items-center justify-center mb-6">
            <span className="text-4xl font-black italic">92</span>
          </div>
          <h3 className="text-xl font-black uppercase tracking-widest mb-2">Visibility Score</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Alta Performance Orgânica</p>
        </Card>

        {/* Top Keywords Table */}
        <Card className="lg:col-span-2 rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm overflow-hidden bg-white">
          <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black tracking-tighter text-slate-900 uppercase">Top Keywords Orgânicas</CardTitle>
            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-primary">Ver Tudo</Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Palavra-Chave</th>
                  <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Posição</th>
                  <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Volume</th>
                  <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {keywords.map((k, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5 text-sm font-black text-slate-900 uppercase tracking-tighter">{k.term}</td>
                    <td className="px-8 py-5 text-center">
                      <Badge className="bg-slate-900 text-white border-none rounded-lg font-black text-[10px]">#{k.position}</Badge>
                    </td>
                    <td className="px-8 py-5 text-right text-sm font-bold text-slate-500">{k.volume}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        k.trend.startsWith('+') ? "text-emerald-500" : "text-rose-500"
                      )}>{k.trend}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Páginas Indexadas', value: '452', icon: Globe },
          { label: 'Backlinks Ativos', value: '1.2K', icon: Target },
          { label: 'Domain Authority', value: '64', icon: ShieldCheck },
          { label: 'Tráfego Orgânico', value: '45K', icon: BarChart3 }
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

import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Target, 
  Users, 
  Zap, 
  RefreshCcw, 
  UserPlus, 
  UserCheck, 
  ShoppingCart, 
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/audience')({
  component: AudienceEngineB
});

function AudienceEngineB() {
  const levels = [
    { 
      level: "L1", 
      label: "Page View", 
      count: "45,280", 
      description: "Visitantes que visualizaram produtos nos últimos 30 dias.",
      icon: UserPlus,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      level: "L2", 
      label: "Add to Cart", 
      count: "8,420", 
      description: "Usuários que adicionaram itens ao carrinho mas não iniciaram checkout.",
      icon: ShoppingCart,
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    { 
      level: "L3", 
      label: "Add Payment", 
      count: "2,150", 
      description: "Usuários que iniciaram checkout mas não concluíram a compra.",
      icon: CreditCard,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    { 
      level: "L4", 
      label: "Purchase", 
      count: "1,840", 
      description: "Clientes que realizaram pelo menos uma compra (excluídos do remarketing).",
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Audience Engine</h1>
          <p className="text-slate-500 font-bold">Gestão inteligente de públicos e remarketing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl font-black text-xs uppercase tracking-widest px-6 h-12 border-slate-200">
            Sincronizar Meta <RefreshCcw className="ml-2 h-4 w-4" />
          </Button>
          <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-6 h-12 shadow-xl shadow-primary/20">
            Criar Público <Zap className="ml-2 h-4 w-4 fill-current" />
          </Button>
        </div>
      </div>

      {/* Audience Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {levels.map((l, i) => (
          <Card key={i} className="group shadow-sm border-none ring-1 ring-slate-100 transition-all hover:shadow-xl bg-white rounded-3xl overflow-hidden p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300", l.bg)}>
                  {React.createElement(l.icon, { className: cn("h-8 w-8", l.color) })}
                </div>
                <div>
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest mb-1 border-slate-200">Nível {l.level}</Badge>
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900">{l.label}</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{l.count}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Usuários Ativos</p>
              </div>
            </div>
            
            <p className="text-sm font-bold text-slate-500 leading-relaxed mb-8">
              {l.description}
            </p>

            <div className="flex items-center gap-3">
              <Button className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 shadow-lg shadow-primary/10">
                Ver Detalhes
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-50">
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Sync Status Section */}
      <Card className="rounded-3xl border-none ring-1 ring-slate-100 shadow-sm overflow-hidden bg-slate-900 text-white p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Meta Pixel</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-black italic">Ativo & Sincronizado</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Google Tag</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-black italic">Ativo & Sincronizado</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Retenção Média</p>
            <p className="text-xl font-black">180 Dias</p>
          </div>
          <div className="space-y-2 text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Exclusão de Compradores</p>
            <div className="flex items-center justify-end gap-2 text-primary font-black">
              <Zap className="h-4 w-4 fill-current" />
              <span>INTELIGENTE</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

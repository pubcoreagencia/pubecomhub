import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ShellB } from '@/prototype-b/components/ShellB';
import { CardMetric, HubTable } from '@/prototype-b/components/ui-b';
import { Target, Users, Zap, RefreshCcw, UserPlus, UserCheck, ShoppingCart, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/audience')({
  component: AudienceEngineB
});

function AudienceEngineB() {
  const levels = [
    { level: "L1", label: "Page View", count: "45,280", icon: UserPlus },
    { level: "L2", label: "Add to Cart", count: "8,420", icon: ShoppingCart },
    { level: "L3", label: "Add Payment", count: "2,150", icon: CreditCard },
    { level: "L4", label: "Purchase", count: "1,840", icon: UserCheck },
  ];

  return (
    <ShellB>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black tracking-tighter text-white">Audience Engine</h1>
            <p className="text-[var(--hub-muted)] font-black uppercase tracking-widest text-[10px]">Gestão Inteligente de Públicos e Remarketing</p>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest px-8 py-3 bg-[var(--hub-primary)] text-black rounded-xl shadow-lg shadow-[var(--hub-primary)]/20 hover:opacity-90">
            Criar Novo Público
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {levels.map((l, i) => (
            <div key={i} className="hub-card hub-gradient-border p-8 flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-xl bg-black/40 border border-[var(--hub-border)] flex items-center justify-center">
                  {React.createElement(l.icon, { className: "h-6 w-6 text-[var(--hub-primary)]" })}
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-[var(--hub-muted)] opacity-60">Nível {l.level}</p>
                   <h3 className="text-xl font-black text-white italic">{l.label}</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-white italic">{l.count}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--hub-muted)]">Usuários Ativos</p>
              </div>
            </div>
          ))}
        </div>

        <div className="hub-card hub-gradient-border p-10 grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
                { label: 'Meta Pixel', status: 'Sincronizado' },
                { label: 'Google Tag', status: 'Sincronizado' },
                { label: 'Retenção Média', status: '180 Dias' },
                { label: 'Exclusão', status: 'Inteligente' }
            ].map((s, i) => (
                <div key={i} className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[var(--hub-muted)]">{s.label}</p>
                    <p className="text-sm font-black text-white italic">{s.status}</p>
                </div>
            ))}
        </div>
      </div>
    </ShellB>
  );
}

import { createFileRoute } from '@tanstack/react-router';
import { ShellB } from '@/prototype-b/components/ShellB';
import { CardMetric, HubTable } from '@/prototype-b/components/ui-b';
import { Search, Filter, Megaphone, Target, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/prototype-b/dashboard/marketing')({
  component: () => <MarketingB />,
});

function MarketingB() {
  return (
    <ShellB>
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <CardMetric label="Alcance Total" value="2.4M" trend="+8% vs ontem" trendType="up" icon={<Users className="h-4 w-4" />} />
          <CardMetric label="CTR Médio" value="3.24%" trend="Estável" trendType="neutral" icon={<MousePointer2 className="h-4 w-4" />} />
          <CardMetric label="ROAS Geral" value="4.8x" trend="+0.5x" trendType="up" icon={<BarChart2 className="h-4 w-4" />} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="hub-card p-6 space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Integrações de Ads</h3>
            <div className="space-y-4">
              {[
                { name: 'Meta Ads', status: 'Conectado', color: 'bg-blue-600', icon: <Megaphone className="h-4 w-4" /> },
                { name: 'Google Ads', status: 'Conectado', color: 'bg-orange-500', icon: <Target className="h-4 w-4" /> },
                { name: 'TikTok Ads', status: 'Pendente', color: 'bg-slate-600', icon: <BarChart2 className="h-4 w-4" /> }
              ].map(ad => (
                <div key={ad.name} className="flex items-center justify-between p-4 bg-black/20 border border-[var(--hub-border)] rounded">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2 rounded", ad.color)}>
                      {React.cloneElement(ad.icon as React.ReactElement<any>, { className: "h-4 w-4 text-white" })}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white uppercase">{ad.name}</p>
                      <p className="text-[9px] text-[var(--hub-muted)] uppercase tracking-widest">{ad.status}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-[8px] font-black uppercase tracking-widest border-[var(--hub-border)] text-white hover:bg-white/5">
                    Configurar
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="hub-card p-6 space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Audiências Ativas</h3>
            <div className="space-y-4">
              {[
                { name: 'L1 - Visualizou Página', size: '184k', status: 'Sincronizado' },
                { name: 'L2 - Carrinho Aberto', size: '33k', status: 'Sincronizado' },
                { name: 'L4 - Compradores 30d', size: '7k', status: 'Sincronizado' }
              ].map(aud => (
                <div key={aud.name} className="p-4 bg-black/20 border border-[var(--hub-border)] rounded flex items-center justify-between">
                   <div>
                      <p className="text-xs font-bold text-white uppercase">{aud.name}</p>
                      <p className="text-[9px] text-[var(--hub-muted)] uppercase tracking-widest">{aud.size} pessoas</p>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[var(--hub-primary)] animate-pulse" />
                      <span className="text-[9px] font-bold text-[var(--hub-primary)] uppercase tracking-widest">{aud.status}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ShellB>
  );
}

import { Users, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as React from 'react';

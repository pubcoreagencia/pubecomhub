import * as React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CardMetricProps {
  label: string;
  value: string;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  subtext?: string;
  icon?: React.ReactNode;
}

export function CardMetric({ label, value, trend, trendType, subtext, icon }: CardMetricProps) {
  return (
    <div className="hub-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--hub-muted)]">
          {label}
        </span>
        {icon && <div className="text-[var(--hub-muted)] opacity-50">{icon}</div>}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-black text-white tracking-tight">
          {value}
        </h3>
        <div className="flex items-center gap-2">
          {trend && (
            <span className={cn(
              "text-[10px] font-bold flex items-center gap-0.5",
              trendType === 'up' && "text-[var(--hub-primary)]",
              trendType === 'down' && "text-red-500",
              trendType === 'neutral' && "text-[var(--hub-muted)]"
            )}>
              {trendType === 'up' && <TrendingUp className="h-3 w-3" />}
              {trendType === 'down' && <TrendingDown className="h-3 w-3" />}
              {trend}
            </span>
          )}
          {subtext && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--hub-muted)] opacity-50">
              {subtext}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function HubTable({ children, headers }: { children: React.ReactNode, headers: string[] }) {
  return (
    <div className="hub-card overflow-hidden">
      <table className="w-full text-left text-[11px]">
        <thead>
          <tr className="border-b border-[var(--hub-border)] bg-black/20">
            {headers.map((h, i) => (
              <th key={i} className="px-5 py-3 font-black uppercase tracking-[0.2em] text-[var(--hub-muted)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--hub-border)]">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function AcquisitionFunnel() {
  const steps = [
    { label: "PAGE VIEW", value: "184.200", percent: "100%", width: "100%" },
    { label: "ADD TO CART", value: "33.890", percent: "18,4%", width: "18.4%" },
    { label: "ADD PAYMENT INFO", value: "15.120", percent: "8,2%", width: "8.2%" },
    { label: "PURCHASE", value: "6.980", percent: "3,8%", width: "3.8%" },
  ];

  return (
    <div className="hub-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Funil de aquisição</h4>
      </div>
      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.label} className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
              <span className="text-[var(--hub-muted)]">{step.label} ({step.percent})</span>
              <span className="text-white">{step.value}</span>
            </div>
            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--hub-primary)]/80" 
                style={{ width: step.width }}
              />
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--hub-primary)] hover:underline">
        Abrir funil completo
      </button>
    </div>
  );
}

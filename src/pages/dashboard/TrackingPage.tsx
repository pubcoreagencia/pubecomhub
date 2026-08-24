import * as React from "react";
import { Zap, Target, MousePointer2, TrendingUp, Smartphone } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { CardMetric } from "@/components/ui-b";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TrackingPage() {
  const events = [
    { time: "Há 2 min", event: "Page View (L1)", user: "Visitante #8821", source: "Facebook Ads" },
    {
      time: "Há 5 min",
      event: "Add to Cart (L2)",
      user: "Visitante #8790",
      source: "Google / Organic",
    },
    {
      time: "Há 12 min",
      event: "Purchase (L4)",
      user: "João Silva",
      source: "Instagram / Alex Rivera",
    },
  ];

  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              Tracking & Pixels
            </h2>
            <p className="text-[var(--hub-muted)] text-[9px] font-bold uppercase tracking-[0.3em]">
              Atribuição em Tempo Real · L1 - L4 Engine
            </p>
          </div>
          <Button className="h-10 hub-bg-primary hover:opacity-90 text-black text-[10px] font-black uppercase tracking-[0.2em] px-6 shadow-lg shadow-[var(--hub-primary)]/20 rounded-xl animate-pulse">
            Configurar Pixel <Zap className="ml-2 h-4 w-4 fill-current" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Atribuição Sources */}
          <div className="hub-card hub-gradient-border p-8 bg-black/20">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-8">
              Fontes de Atribuição
            </h3>
            <div className="space-y-8">
              {[
                { label: "Meta Ads", value: "45%", color: "bg-blue-600" },
                { label: "Google Ads", value: "28%", color: "bg-slate-400" },
                { label: "Influencers", value: "22%", color: "var(--hub-primary)" },
                { label: "Outros", value: "5%", color: "rgba(255,255,255,0.1)" },
              ].map((source, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="text-[var(--hub-muted)]">{source.label}</span>
                    <span className="text-white italic">{source.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-[var(--hub-border)]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        !source.color.startsWith("var") && !source.color.startsWith("rgba")
                          ? source.color
                          : "",
                      )}
                      style={{
                        width: source.value,
                        backgroundColor:
                          source.color.startsWith("var") || source.color.startsWith("rgba")
                            ? source.color
                            : undefined,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Event Log */}
          <div className="lg:col-span-2 hub-card hub-gradient-border overflow-hidden bg-black/20">
            <div className="px-8 py-6 border-b border-[var(--hub-border)] flex flex-row items-center justify-between bg-black/40">
              <h3 className="text-[11px] font-black tracking-[0.3em] text-white uppercase italic">
                Live Event Stream
              </h3>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--hub-primary)] animate-pulse shadow-[0_0_8px_var(--hub-primary)]" />
                <span className="text-[9px] font-black uppercase text-[var(--hub-primary)] tracking-[0.2em]">
                  Ao Vivo
                </span>
              </div>
            </div>
            <div className="divide-y divide-[var(--hub-border)]">
              {events.map((e, i) => (
                <div
                  key={i}
                  className="px-8 py-5 flex items-center justify-between group hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-10 w-10 rounded-xl bg-black/40 border border-[var(--hub-border)] flex items-center justify-center group-hover:border-[var(--hub-primary)]/40 transition-all">
                      <MousePointer2 className="h-4 w-4 text-[var(--hub-muted)] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-tighter italic">
                        {e.event}
                      </p>
                      <p className="text-[9px] font-bold text-[var(--hub-muted)] uppercase tracking-widest mt-0.5">
                        {e.user}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-white uppercase tracking-[0.2em]">
                      {e.source}
                    </p>
                    <p className="text-[9px] font-bold text-[var(--hub-muted)] mt-0.5 italic opacity-40">
                      {e.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tracking Invariants Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Eventos Capturados", value: "1.2M", icon: Target },
            { label: "Taxa de Atribuição", value: "98.4%", icon: TrendingUp },
            { label: "Tempo de Resposta", value: "45ms", icon: Zap },
            { label: "Dispositivos", value: "82% Mobile", icon: Smartphone },
          ].map((m, i) => (
            <CardMetric key={i} label={m.label} value={m.value} icon={m.icon} />
          ))}
        </div>
      </div>
    </Shell>
  );
}

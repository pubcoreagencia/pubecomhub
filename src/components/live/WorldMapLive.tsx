import * as React from "react";
import { cn } from "@/lib/utils";
import { Globe, MapPin, Eye, ShoppingBag, ShieldCheck, Smartphone, Laptop, Sparkles } from "lucide-react";

export interface GeoVisitor {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  ip: string;
  device: "mobile" | "desktop";
  page: string;
  action: "viewing" | "cart" | "checkout" | "purchased";
  productName?: string;
  productPrice?: number;
  timeOnSite: string;
  score: number; // 0-100
  socials: {
    instagramFollower: boolean;
    youtubeSubscriber: boolean;
    interactionCount: number;
  };
  gender: string;
  age: number;
}

interface WorldMapLiveProps {
  visitors: GeoVisitor[];
  selectedVisitor: GeoVisitor | null;
  onSelectVisitor: (v: GeoVisitor) => void;
}

export const WorldMapLive: React.FC<WorldMapLiveProps> = ({
  visitors,
  selectedVisitor,
  onSelectVisitor,
}) => {
  // Equirectangular projection: converts lat/lng to SVG percentages
  const getCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  const getActionColor = (action: GeoVisitor["action"]) => {
    switch (action) {
      case "purchased":
        return "#22c55e"; // green
      case "checkout":
        return "#f59e0b"; // amber
      case "cart":
        return "#38bdf8"; // cyan
      default:
        return "#a855f7"; // purple
    }
  };

  const getActionLabel = (action: GeoVisitor["action"]) => {
    switch (action) {
      case "purchased":
        return "Compra Aprovada";
      case "checkout":
        return "No Checkout";
      case "cart":
        return "Com Carrinho";
      default:
        return "Navegando";
    }
  };

  const getActionHabboIcon = (action: GeoVisitor["action"]) => {
    switch (action) {
      case "purchased":
        return "🦆"; // Habbo Rubber Duck of honor
      case "checkout":
        return "💰"; // Habbo credits bag
      case "cart":
        return "🪙"; // Habbo gold coin
      default:
        return "💬"; // Habbo chat bubble
    }
  };

  return (
    <div className="relative w-full aspect-[2/1] min-h-[380px] sm:min-h-[460px] bg-[#07090e] border border-[var(--hub-border)] rounded-3xl overflow-hidden shadow-2xl group">
      {/* Background Radar Grid & Coordinates Lines */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #38bdf8 1px, transparent 1px),
            linear-gradient(to bottom, #38bdf8 1px, transparent 1px)
          `,
          backgroundSize: "8.33% 16.66%",
        }}
      />

      {/* Futuristic Header Overlay */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
          <Globe className="h-4 w-4 animate-spin" style={{ animationDuration: "25s" }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-white italic">
              Radar Geográfico Global (Habbo Telemetry)
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-black text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-[9px] font-mono text-[var(--hub-muted)]">
            Projeção Cilíndrica Equirretangular • Lat/Lng Realtime
          </p>
        </div>
      </div>

      {/* Action Indicators Legend (Top-Right) */}
      <div className="absolute top-4 right-6 z-20 hidden sm:flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-wider">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span>🦆</span>
          <span>Compra</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400">
          <span>💰</span>
          <span>Checkout</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400">
          <span>🪙</span>
          <span>Carrinho</span>
        </div>
        <div className="flex items-center gap-1.5 text-purple-400">
          <span>💬</span>
          <span>Visita</span>
        </div>
      </div>

      {/* SVG Continents Outline Graphic - High-Fidelity Silhouette */}
      <svg
        className="absolute inset-0 w-full h-full object-fill pointer-events-none opacity-45"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="radarCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#07090e" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1000" height="500" fill="url(#radarCenterGlow)" />

        {/* Linhas de Trópicos e Equador */}
        <line x1="0" y1="250" x2="1000" y2="250" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.3" />
        <line x1="0" y1="185" x2="1000" y2="185" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.2" />
        <line x1="0" y1="315" x2="1000" y2="315" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.2" />

        {/* América do Sul - Silhueta Fiel com Brasil e Litoral */}
        <path
          d="M 270 230 C 290 235, 335 240, 365 270 C 375 285, 360 320, 345 350 C 330 380, 315 415, 305 440 C 295 450, 285 450, 280 435 C 270 410, 265 350, 255 310 C 245 280, 250 250, 270 230 Z"
          fill="#0f172a"
          stroke="#38bdf8"
          strokeWidth="1.2"
          opacity="0.9"
        />

        {/* América do Norte & Central */}
        <path
          d="M 120 70 C 150 55, 230 50, 280 60 C 315 75, 330 110, 310 140 C 295 160, 280 185, 260 210 C 240 225, 220 205, 195 180 C 165 170, 140 140, 120 110 Z"
          fill="#0f172a"
          stroke="#38bdf8"
          strokeWidth="1.2"
          opacity="0.8"
        />

        {/* Europa */}
        <path
          d="M 455 90 C 485 80, 530 85, 555 110 C 565 125, 550 150, 525 165 C 495 175, 465 160, 450 140 C 445 120, 445 100, 455 90 Z"
          fill="#0f172a"
          stroke="#38bdf8"
          strokeWidth="1.2"
          opacity="0.85"
        />

        {/* África */}
        <path
          d="M 450 175 C 490 170, 545 175, 565 210 C 580 240, 570 280, 545 330 C 525 365, 495 365, 475 320 C 455 280, 440 230, 450 175 Z"
          fill="#0f172a"
          stroke="#38bdf8"
          strokeWidth="1.2"
          opacity="0.75"
        />

        {/* Ásia */}
        <path
          d="M 555 80 C 620 65, 750 65, 820 110 C 850 140, 835 180, 790 220 C 745 250, 680 235, 620 200 C 575 170, 545 130, 555 80 Z"
          fill="#0f172a"
          stroke="#38bdf8"
          strokeWidth="1.2"
          opacity="0.75"
        />

        {/* Oceania */}
        <path
          d="M 760 300 C 800 290, 865 305, 885 340 C 895 365, 875 390, 835 395 C 795 400, 765 360, 755 330 Z"
          fill="#0f172a"
          stroke="#38bdf8"
          strokeWidth="1.2"
          opacity="0.8"
        />
      </svg>

      {/* Radar Sweep Animation (efeito varredura sonar) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background: "linear-gradient(90deg, transparent 45%, rgba(56, 189, 248, 0.4) 50%, transparent 55%)",
          backgroundSize: "200% 100%",
          animation: "radarSweep 8s linear infinite",
        }}
      />

      {/* Pulsating Visitor Pins com Estética Habbo Hotel */}
      {visitors.map((visitor) => {
        const coords = getCoordinates(visitor.lat, visitor.lng);
        const color = getActionColor(visitor.action);
        const habboIcon = getActionHabboIcon(visitor.action);
        const isSelected = selectedVisitor?.id === visitor.id;

        return (
          <div
            key={visitor.id}
            onClick={() => onSelectVisitor(visitor)}
            className="absolute z-30 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group/pin"
            style={{
              left: coords.x,
              top: coords.y,
            }}
          >
            {/* Ondas Sonar Concêntricas de Pulso */}
            <div
              className="absolute -inset-3 rounded-full animate-ping opacity-40 pointer-events-none"
              style={{ backgroundColor: color }}
            />

            {/* Balão de Fala Estilo Habbo Hotel Flutuante */}
            <div
              className={cn(
                "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 transition-all duration-300 pointer-events-none z-40",
                isSelected ? "scale-100 opacity-100" : "scale-90 opacity-80 group-hover/pin:scale-105 group-hover/pin:opacity-100"
              )}
            >
              <div
                style={{
                  background: "#09090b",
                  border: `2px solid ${color}`,
                  borderRadius: "10px",
                  padding: "3px 8px",
                  whiteSpace: "nowrap",
                  boxShadow: `0 4px 16px ${color}66`,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span style={{ fontSize: "12px" }}>{habboIcon}</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "9px", fontWeight: 900, color: "#ffffff", fontFamily: "monospace" }}>
                    {visitor.name}
                  </span>
                  <span style={{ fontSize: "8px", color: color, fontWeight: 700 }}>
                    {visitor.city} ({visitor.action === 'purchased' ? 'COMPRA R$ ' + (visitor.productPrice || 189) : visitor.action === 'cart' ? 'Carrinho' : 'Navegando'})
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  background: "#09090b",
                  borderRight: `2px solid ${color}`,
                  borderBottom: `2px solid ${color}`,
                  transform: "rotate(45deg)",
                  margin: "-3px auto 0 auto",
                }}
              />
            </div>

            {/* Pin Isométrico Losango Retrô Habbo */}
            <div
              className={cn(
                "relative h-4 w-4 transform rotate-45 border-2 border-white shadow-lg transition-all duration-300 flex items-center justify-center",
                isSelected ? "scale-150 ring-4 ring-white/50" : "group-hover/pin:scale-125"
              )}
              style={{
                backgroundColor: color,
                boxShadow: `0 0 16px ${color}`,
              }}
            >
              <div className="h-1.5 w-1.5 bg-white transform -rotate-45" />
            </div>
          </div>
        );
      })}

      {/* Visitor Detail Floating Drawer (Quando um pin é selecionado) */}
      {selectedVisitor && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-88 z-40 bg-[#0c1018]/95 backdrop-blur-xl p-4 rounded-2xl border border-cyan-500/40 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center text-black font-black text-base shadow-md"
                style={{ backgroundColor: getActionColor(selectedVisitor.action) }}
              >
                {getActionHabboIcon(selectedVisitor.action)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-white">{selectedVisitor.name}</h4>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 font-mono text-cyan-300">
                    {selectedVisitor.gender}, {selectedVisitor.age}a
                  </span>
                </div>
                <p className="text-[10px] text-cyan-400 font-mono">
                  {selectedVisitor.city}, {selectedVisitor.state} ({selectedVisitor.country})
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectVisitor(null as any)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
            <div className="bg-black/40 p-2 rounded-xl border border-white/5">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Coordenadas</span>
              <span className="text-white font-mono font-bold">
                {selectedVisitor.lat.toFixed(4)}°, {selectedVisitor.lng.toFixed(4)}°
              </span>
            </div>
            <div className="bg-black/40 p-2 rounded-xl border border-white/5">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Lead Score (DB 2)</span>
              <span className="text-emerald-400 font-mono font-black">
                {selectedVisitor.score}/100 pts
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-[10px] text-slate-300">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Página Atual:</span>
              <span className="font-mono text-white truncate max-w-[160px]">{selectedVisitor.page}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Tempo na Loja:</span>
              <span className="font-mono text-cyan-300">{selectedVisitor.timeOnSite}</span>
            </div>
            {selectedVisitor.productName && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Produto Ativo:</span>
                <span className="font-bold text-amber-300 truncate max-w-[160px]">
                  {selectedVisitor.productName}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1 border-t border-white/5 text-[9px]">
              <span className="text-slate-400">Interações:</span>
              <span className="text-purple-300 font-bold">
                {selectedVisitor.socials.instagramFollower ? "Seguidor no IG" : "Novo Visitante"} • {selectedVisitor.socials.interactionCount}x visualizações de posts
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import * as React from "react";
import { cn } from "@/lib/utils";
import { Globe, MapPin, Eye, ShoppingBag, ShieldCheck, Smartphone, Laptop, Sparkles, Activity, Filter, Zap } from "lucide-react";

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
  const [filterAction, setFilterAction] = React.useState<string>("all");

  // Equirectangular projection: converts lat/lng to percentage coordinates
  const getCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: `${x}%`, y: `${y}%`, rawX: (lng + 180) * (1000 / 360), rawY: (90 - lat) * (500 / 180) };
  };

  const getActionColor = (action: GeoVisitor["action"]) => {
    switch (action) {
      case "purchased":
        return "#22c55e"; // Emerald green
      case "checkout":
        return "#f59e0b"; // Amber gold
      case "cart":
        return "#38bdf8"; // Cyan blue
      default:
        return "#a855f7"; // Neon purple
    }
  };

  const getActionHabboBadge = (action: GeoVisitor["action"]) => {
    switch (action) {
      case "purchased":
        return { emoji: "🦆", label: "Compra Aprovada", bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" };
      case "checkout":
        return { emoji: "💰", label: "No Checkout", bg: "bg-amber-500/20 text-amber-400 border-amber-500/40" };
      case "cart":
        return { emoji: "🪙", label: "Com Carrinho", bg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40" };
      default:
        return { emoji: "💬", label: "Navegando", bg: "bg-purple-500/20 text-purple-400 border-purple-500/40" };
    }
  };

  const filteredVisitors = visitors.filter((v) => {
    if (filterAction === "all") return true;
    return v.action === filterAction;
  });

  const totalCartValue = visitors.reduce((sum, v) => sum + (v.productPrice || 0), 0);
  const totalPurchases = visitors.filter((v) => v.action === "purchased").length;

  return (
    <div className="relative w-full aspect-[2/1] min-h-[460px] sm:min-h-[560px] bg-[#030712] border border-[var(--hub-border)] rounded-3xl overflow-hidden shadow-2xl group select-none">
      {/* Background Cyber Grid Matrix */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, rgba(56, 189, 248, 0.15) 0%, transparent 70%),
            linear-gradient(to right, #38bdf8 1px, transparent 1px),
            linear-gradient(to bottom, #38bdf8 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 4% 8%, 4% 8%",
        }}
      />

      {/* Top Telemetry Header Bar */}
      <div className="absolute top-4 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Globe className="h-5 w-5 animate-spin" style={{ animationDuration: "35s" }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-white italic">
                Radar Global de Vendas & Telemetria
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-black text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                EDGE LIVE
              </span>
            </div>
            <p className="text-[10px] font-mono text-cyan-400/70">
              Cloudflare Anycast • São Paulo Core Hub • {filteredVisitors.length} Compradores Monitorados
            </p>
          </div>
        </div>

        {/* Global Live Stats Ticker */}
        <div className="flex items-center gap-2 sm:gap-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span>🦆</span>
            <span>{totalPurchases} Vendas</span>
          </div>
          <div className="h-3 w-[1px] bg-white/20" />
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <span>🪙</span>
            <span>R$ {totalCartValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em Carrinhos</span>
          </div>
          <div className="h-3 w-[1px] bg-white/20" />
          <div className="flex items-center gap-1.5 text-purple-400 font-bold hidden md:flex">
            <Zap className="h-3.5 w-3.5" />
            <span>14ms Edge Latency</span>
          </div>
        </div>

        {/* Action Filter Pills */}
        <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/10 text-[10px] font-bold">
          {[
            { id: "all", label: "Todos", icon: "🌐" },
            { id: "purchased", label: "Compras", icon: "🦆" },
            { id: "checkout", label: "Checkout", icon: "💰" },
            { id: "cart", label: "Carrinho", icon: "🪙" },
            { id: "viewing", label: "Visitas", icon: "💬" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterAction(f.id)}
              className={cn(
                "px-2.5 py-1 rounded-lg transition-all flex items-center gap-1",
                filterAction === f.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SVG High-Fidelity World Map Canvas */}
      <svg
        className="absolute inset-0 w-full h-full object-fill pointer-events-none"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#22c55e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="radarSweepGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1000" height="500" fill="url(#radarSweepGlow)" />

        {/* Lat/Long Coordinate Grid Lines */}
        <g stroke="#38bdf8" strokeWidth="0.5" opacity="0.2" strokeDasharray="3 4">
          {/* Equator & Tropics */}
          <line x1="0" y1="250" x2="1000" y2="250" strokeWidth="1" opacity="0.4" />
          <line x1="0" y1="185" x2="1000" y2="185" />
          <line x1="0" y1="315" x2="1000" y2="315" />
          <line x1="0" y1="120" x2="1000" y2="120" />
          <line x1="0" y1="380" x2="1000" y2="380" />

          {/* Meridians */}
          <line x1="200" y1="0" x2="200" y2="500" />
          <line x1="350" y1="0" x2="350" y2="500" />
          <line x1="500" y1="0" x2="500" y2="500" strokeWidth="1" opacity="0.4" />
          <line x1="650" y1="0" x2="650" y2="500" />
          <line x1="800" y1="0" x2="800" y2="500" />
        </g>

        {/* ========================================================================= */}
        {/* DETAILED HIGH-DEFINITION SVG CONTINENT POLYGONS */}
        {/* ========================================================================= */}
        <g fill="#0b1329" stroke="#38bdf8" strokeWidth="1.1" opacity="0.85" filter="url(#cyanGlow)">
          {/* AMÉRICA DO SUL (Brasil, Argentina, Chile, Colômbia) */}
          <path
            d="
              M 275,230 
              L 300,225 L 340,240 L 375,260 L 385,285 L 375,320 L 360,350 L 345,380 
              L 325,415 L 310,445 L 300,455 L 292,440 L 295,405 L 285,360 L 270,320 
              L 260,285 L 255,260 L 265,240 Z
            "
          />

          {/* AMÉRICA DO NORTE (EUA, Canadá, Alasca, México) */}
          <path
            d="
              M 80,85 
              L 125,70 L 160,55 L 210,50 L 260,55 L 300,70 L 325,95 L 310,120 
              L 290,140 L 280,165 L 275,190 L 255,215 L 240,225 L 225,215 L 205,190 
              L 180,175 L 150,165 L 120,135 L 95,110 Z
            "
          />

          {/* GROENLÂNDIA */}
          <path d="M 330,40 L 375,35 L 390,60 L 365,80 L 340,75 L 325,55 Z" />

          {/* EUROPA (Reino Unido, Península Ibérica, França, Alemanha, Escandinávia, Itália) */}
          <path
            d="
              M 445,100 
              L 470,85 L 505,80 L 535,90 L 555,105 L 560,125 L 545,145 L 530,165 
              L 510,170 L 490,175 L 465,160 L 450,140 L 440,120 Z
            "
          />
          {/* Grã-Bretanha & Irlanda */}
          <path d="M 430,95 L 445,90 L 448,110 L 435,115 Z" />

          {/* ÁFRICA (Norte, Saara, Chifre da África, África do Sul, Madagascar) */}
          <path
            d="
              M 455,180 
              L 500,175 L 545,185 L 575,215 L 585,250 L 570,290 L 555,330 L 535,365 
              L 510,380 L 490,365 L 475,330 L 455,280 L 445,230 L 445,195 Z
            "
          />
          {/* Madagascar */}
          <path d="M 585,320 L 595,315 L 600,345 L 590,350 Z" />

          {/* ÁSIA (Oriente Médio, Rússia, Índia, China, Sudeste Asiático) */}
          <path
            d="
              M 565,85 
              L 620,70 L 700,60 L 780,65 L 845,95 L 870,130 L 855,170 L 820,195 
              L 780,215 L 740,240 L 705,255 L 670,240 L 640,215 L 600,195 L 575,150 
              L 560,115 Z
            "
          />
          {/* Península Indiana */}
          <path d="M 670,205 L 705,220 L 710,255 L 690,275 L 675,250 Z" />
          {/* Japão */}
          <path d="M 865,140 L 880,150 L 875,175 L 860,165 Z" />

          {/* OCEANIA & AUSTRÁLIA */}
          <path
            d="
              M 770,305 
              L 820,295 L 875,310 L 895,340 L 885,380 L 845,400 L 805,395 L 775,365 
              L 760,335 Z
            "
          />
          {/* Nova Zelândia */}
          <path d="M 905,385 L 920,380 L 925,415 L 910,420 Z" />
        </g>

        {/* ========================================================================= */}
        {/* GLOBAL FLIGHT & DATA ARCS (Conexão São Paulo Core Hub com o Mundo) */}
        {/* ========================================================================= */}
        <g stroke="url(#arcGrad)" fill="none" strokeWidth="1.5" opacity="0.6">
          {/* São Paulo (335, 340) -> Miami/EUA (235, 175) */}
          <path
            d="M 335,340 Q 260,230 235,175"
            strokeDasharray="6 6"
            className="animate-[dash_20s_linear_infinite]"
          />
          {/* São Paulo (335, 340) -> Frankfurt/Europa (485, 125) */}
          <path
            d="M 335,340 Q 420,180 485,125"
            strokeDasharray="6 6"
            className="animate-[dash_25s_linear_infinite]"
          />
          {/* São Paulo (335, 340) -> Tóquio/Ásia (870, 155) */}
          <path
            d="M 335,340 Q 600,120 870,155"
            strokeDasharray="6 6"
            className="animate-[dash_30s_linear_infinite]"
          />
          {/* São Paulo (335, 340) -> Londres (445, 105) */}
          <path
            d="M 335,340 Q 380,180 445,105"
            strokeDasharray="6 6"
            className="animate-[dash_22s_linear_infinite]"
          />
        </g>

        {/* Pulse Beacon no Hub Central (São Paulo / Brasil) */}
        <circle cx="335" cy="340" r="14" fill="#0ea5e9" opacity="0.2" className="animate-ping" />
        <circle cx="335" cy="340" r="5" fill="#38bdf8" />
        <circle cx="335" cy="340" r="2.5" fill="#ffffff" />
      </svg>

      {/* Radar Sweep Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: "linear-gradient(90deg, transparent 40%, rgba(56, 189, 248, 0.45) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "radarSweep 7s linear infinite",
        }}
      />

      {/* ========================================================================= */}
      {/* INTERACTIVE PULSATING VISITOR PINS WITH HABBO AVATAR BADGES */}
      {/* ========================================================================= */}
      {filteredVisitors.map((visitor) => {
        const coords = getCoordinates(visitor.lat, visitor.lng);
        const color = getActionColor(visitor.action);
        const badge = getActionHabboBadge(visitor.action);
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
            {/* Concentric Radar Ping Waves */}
            <div
              className="absolute -inset-3.5 rounded-full animate-ping opacity-60 pointer-events-none"
              style={{ backgroundColor: color }}
            />
            <div
              className="absolute -inset-1 rounded-full opacity-70 pointer-events-none"
              style={{ backgroundColor: color }}
            />

            {/* Habbo Avatar Speech Bubble Pin */}
            <div
              className={cn(
                "relative flex items-center gap-1.5 px-2 py-1 rounded-xl shadow-xl transition-all duration-300 backdrop-blur-md",
                isSelected
                  ? "scale-110 ring-2 ring-white bg-black/90 border-2"
                  : "scale-90 hover:scale-105 bg-black/80 border"
              )}
              style={{ borderColor: color }}
            >
              <span className="text-xs">{badge.emoji}</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-black leading-tight text-white whitespace-nowrap">
                  {visitor.name.split(' ')[0]}
                </span>
                <span className="text-[8px] font-mono leading-none text-zinc-400 whitespace-nowrap">
                  {visitor.city}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* ========================================================================= */}
      {/* SELECTED BUYER DOSSIER DRAWER (Card de Detalhes Completo do Comprador) */}
      {/* ========================================================================= */}
      {selectedVisitor && (
        <div className="absolute bottom-4 right-4 z-40 w-full max-w-sm bg-black/85 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-4 shadow-2xl shadow-cyan-500/20 text-white animate-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center text-xl shadow-lg">
                {getActionHabboBadge(selectedVisitor.action).emoji}
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  {selectedVisitor.name}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                    Score: {selectedVisitor.score}
                  </span>
                </h4>
                <p className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-cyan-400" />
                  {selectedVisitor.city}, {selectedVisitor.state} ({selectedVisitor.country})
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectVisitor(null as any);
              }}
              className="text-zinc-400 hover:text-white text-xs font-bold px-2 py-1 bg-white/5 rounded-lg"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg">
              <span className="text-zinc-400">Status da Jornada:</span>
              <span className={cn("px-2 py-0.5 rounded font-black text-[10px] border", getActionHabboBadge(selectedVisitor.action).bg)}>
                {getActionHabboBadge(selectedVisitor.action).label}
              </span>
            </div>

            {selectedVisitor.productName && (
              <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg">
                <span className="text-zinc-400">Produto no Radar:</span>
                <span className="text-cyan-300 font-bold truncate max-w-[180px]">
                  {selectedVisitor.productName}
                </span>
              </div>
            )}

            {selectedVisitor.productPrice && (
              <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg">
                <span className="text-zinc-400">Valor do Ticket:</span>
                <span className="text-emerald-400 font-black">
                  R$ {selectedVisitor.productPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
              <div className="bg-white/5 p-2 rounded-lg">
                <span className="text-zinc-500 block">Dispositivo / IP:</span>
                <span className="text-zinc-300 font-bold capitalize">{selectedVisitor.device} • {selectedVisitor.ip}</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg">
                <span className="text-zinc-500 block">Tempo no Site:</span>
                <span className="text-zinc-300 font-bold">{selectedVisitor.timeOnSite}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

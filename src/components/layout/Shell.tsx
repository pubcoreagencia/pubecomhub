import * as React from 'react';
import { Link, Outlet, useLocation } from '@tanstack/react-router';
import { 
  LayoutDashboard, Activity, Store, Package, Users, BarChart3, 
  Target, Megaphone, Settings, Bell, Search, Box, Truck, 
  TrendingUp, Award, CircleDollarSign, Share2, Globe, Gift,
  MousePointer2, Layers, BarChart, LogOut, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navGroups = [
  {
    label: "Operação",
    items: [
      { label: "Dashboard Master", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Live Shop", icon: Activity, href: "/dashboard/live" },
      { label: "Lojas", icon: Store, href: "/dashboard/stores" },
      { label: "Pedidos", icon: Package, href: "/dashboard/orders" },
    ]
  },
  {
    label: "Produtos & Logística",
    items: [
      { label: "Produtos", icon: Box, href: "/dashboard/products" },
      { label: "Fornecedores", icon: Truck, href: "/dashboard/suppliers" },
      { label: "Estoque", icon: Layers, href: "/dashboard/inventory" },
    ]
  },
  {
    label: "Financeiro & Performance",
    items: [
      { label: "Central Financeira", icon: BarChart3, href: "/dashboard/finance" },
      { label: "Tracking & Pixels", icon: MousePointer2, href: "/dashboard/tracking" },
      { label: "Marketing & Ads", icon: Megaphone, href: "/dashboard/marketing" },
      { label: "SEO & Orgânico", icon: BarChart, href: "/dashboard/seo" },
    ]
  },
  {
    label: "Crescimento",
    items: [
      { label: "Audience Engine", icon: Target, href: "/dashboard/audience" },
      { label: "Funil de Aquisição", icon: TrendingUp, href: "/dashboard/live" },
      { label: "UTM / Tracking", icon: Globe, href: "/dashboard/tracking" },
    ]
  },
  {
    label: "Parceiros",
    items: [
      { label: "Afiliados", icon: Share2, href: "/dashboard/affiliates" },
      { label: "Influencers", icon: Users, href: "/dashboard/influencers" },
      { label: "Ranking Global", icon: Award, href: "/dashboard/ranking" },
      { label: "Bonificações", icon: Gift, href: "/dashboard/bonifications" },
    ]
  },
  {
    label: "Sistema",
    items: [
      { label: "Configurações", icon: Settings, href: "/dashboard/settings" },
    ]

  }
];

export function Shell({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="pub-ecom flex h-screen overflow-hidden selection:bg-[var(--hub-primary)] selection:text-[var(--hub-primary-foreground)]">
      {/* Official Hub Sidebar */}
      <aside className="hub-sidebar w-[var(--hub-sidebar-width)] flex flex-col z-50 shrink-0">
        <div className="p-8 border-b border-[var(--hub-border)]/50">
          <Link to="/dashboard" className="flex items-center gap-4 group">
            <div className="h-10 w-10 hub-bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-[var(--hub-primary)]/20 transition-transform group-hover:scale-105">
              <CircleDollarSign className="h-6 w-6 text-black" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter text-white block leading-none">PUB ECOM</span>
              <span className="text-[10px] font-black hub-text-primary tracking-[0.2em] uppercase mt-1 block">Master Operation</span>
            </div>
          </Link>
        </div>


        <ScrollArea className="flex-1 px-4 py-6">
          <nav className="space-y-8">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="px-4 text-[9px] font-black text-[var(--hub-muted)] uppercase tracking-[0.3em] opacity-40">
                  {group.label}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      activeProps={{ className: "hub-sidebar-item-active text-[var(--hub-primary)] bg-[var(--hub-primary)]/5" }}
                      inactiveProps={{ className: "text-slate-400 hover:text-white hover:bg-white/5" }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-bold transition-all group border-l-2 border-transparent",
                        location.pathname === item.href && "border-[var(--hub-primary)]"
                      )}
                    >
                      {React.createElement(item.icon, {
                        className: cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          location.pathname === item.href ? "text-[var(--hub-primary)]" : "text-slate-500 group-hover:text-white"
                        )
                      })}
                      <span className="flex-1 tracking-tight">{item.label}</span>
                      {item.label === "Live Shop" && (
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-6 border-t border-[var(--hub-border)]/50 bg-black/20">
          <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-[var(--hub-border)]">
            <Avatar className="h-9 w-9 rounded-lg border border-[var(--hub-border)]/50">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-black text-white truncate italic">Central Operator</p>
              <p className="text-[9px] text-[var(--hub-muted)] uppercase font-bold tracking-widest">Master Access</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-500/10">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[var(--hub-bg)]">
        {/* Hub Premium Header */}
        <header className="h-[var(--hub-header-height)] hub-glass border-b border-[var(--hub-border)] flex items-center justify-between px-10 z-40 sticky top-0">
          <div className="flex items-center gap-6">
             <div className="hidden lg:flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-[var(--hub-border)] w-96 group focus-within:border-[var(--hub-primary)] transition-all">
                <Search className="h-4 w-4 text-[var(--hub-muted)] group-focus-within:text-[var(--hub-primary)]" />
                <input 
                  type="text" 
                  placeholder="Pesquisar na operação..." 
                  className="bg-transparent border-none text-[12px] font-bold text-white focus:outline-none w-full placeholder:text-[var(--hub-muted)]"
                />
             </div>
             <div className="h-6 w-[1px] bg-[var(--hub-border)] mx-2 hidden lg:block" />
             <div className="text-[11px] text-[var(--hub-muted)] font-bold uppercase tracking-widest hidden xl:block">
               Operação Ativa · 100% de performance
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2.5 bg-[var(--hub-primary)]/5 px-4 py-2 rounded-xl border border-[var(--hub-primary)]/20 text-[11px] font-black tracking-widest text-[var(--hub-primary)] animate-pulse">
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--hub-primary)]" />
                1.284 ONLINE
             </div>
             <Button className="h-10 rounded-xl hub-bg-primary hover:opacity-90 text-black text-[11px] font-black uppercase tracking-[0.2em] px-6 shadow-lg shadow-[var(--hub-primary)]/20">
                Novo Lojista
             </Button>
             <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-[var(--hub-border)] text-[var(--hub-muted)] hover:text-white hover:bg-white/5 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-[var(--hub-primary)] rounded-full shadow-[0_0_8px_var(--hub-primary)]" />
             </Button>
          </div>
        </header>

        {/* Global Hub Time Filter */}
        <div className="h-14 bg-black/20 border-b border-[var(--hub-border)] flex items-center justify-end px-10 gap-4 overflow-x-auto no-scrollbar">
           {['Tempo Real', 'Hoje', 'Ontem', 'Últimos 7 dias', 'Últimos 30 dias', 'Personalizado'].map((filter, i) => (
             <button 
               key={filter}
               className={cn(
                 "text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg transition-all border border-transparent",
                 i === 0 ? "text-[var(--hub-primary)] bg-[var(--hub-primary)]/5 border-[var(--hub-primary)]/20 shadow-[0_0_15px_rgba(110,231,183,0.05)]" : "text-[var(--hub-muted)] hover:text-white hover:bg-white/5"
               )}
             >
               {filter}
             </button>
           ))}
        </div>

        {/* Dynamic Content Area */}
        <ScrollArea className="flex-1">
          <div className="p-8 max-w-[1800px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

import * as React from 'react';
import { Link, Outlet, useLocation } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Activity, 
  Store, 
  Package, 
  Users, 
  BarChart3, 
  Target, 
  Megaphone, 
  Settings,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Box,
  Truck,
  TrendingUp,
  Award,
  CircleDollarSign,
  Share2,
  Globe,
  Gift,
  MousePointer2,
  Layers,
  BarChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navGroups = [
  {
    label: "Visão Geral",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/prototype-b/dashboard" },
    ]
  },
  {
    label: "Operações",
    items: [
      { label: "Live Shop", icon: Activity, href: "/prototype-b/dashboard/live" },
      { label: "Lojas", icon: Store, href: "/prototype-b/dashboard/stores" },
      { label: "Pedidos", icon: Package, href: "/prototype-b/dashboard/orders" },
      { label: "Produtos", icon: Box, href: "/prototype-b/dashboard/products" },
      { label: "Fornecedores", icon: Truck, href: "/prototype-b/dashboard/suppliers" },
      { label: "Estoque", icon: Layers, href: "/prototype-b/dashboard/inventory" },
    ]
  },
  {
    label: "Crescimento",
    items: [
      { label: "Financeiro", icon: BarChart3, href: "/prototype-b/dashboard/finance" },
      { label: "Ads", icon: Megaphone, href: "/prototype-b/dashboard/marketing" },
      { label: "Funil", icon: TrendingUp, href: "/prototype-b/dashboard/live" },
      { label: "Tracking", icon: MousePointer2, href: "/prototype-b/dashboard/tracking" },
      { label: "UTM", icon: Globe, href: "/prototype-b/dashboard/seo" },
      { label: "Audiências", icon: Target, href: "/prototype-b/dashboard/audience" },
      { label: "Remarketing", icon: Share2, href: "/prototype-b/dashboard/audience" },
    ]
  },
  {
    label: "Parceiros",
    items: [
      { label: "Afiliados", icon: Share2, href: "/prototype-b/dashboard/affiliates" },
      { label: "Influencers", icon: Users, href: "/prototype-b/dashboard/influencers" },
      { label: "Ranking", icon: Award, href: "/prototype-b/dashboard/ranking" },
      { label: "Bonificações", icon: Gift, href: "/prototype-b/dashboard/bonifications" },
    ]
  },
  {
    label: "Sistemas",
    items: [
      { label: "SEO", icon: BarChart, href: "/prototype-b/dashboard/seo" },
      { label: "Store / Checkout", icon: Store, href: "/prototype-b/store" },
      { label: "Configurações", icon: Settings, href: "/prototype-b/dashboard/settings" },
    ]
  }
];

export function ShellB() {
  const location = useLocation();

  return (
    <div className="prototype-b flex h-screen overflow-hidden selection:bg-[var(--hub-primary)] selection:text-[var(--hub-primary-foreground)]">
      {/* Sidebar */}
      <aside className="hub-sidebar w-[260px] flex flex-col z-50 shrink-0">
        <div className="p-6">
          <Link to="/prototype-b/dashboard" className="flex items-center gap-3">
            <div className="h-9 w-9 hub-bg-primary rounded flex items-center justify-center">
              <CircleDollarSign className="h-6 w-6 text-[var(--hub-primary-foreground)]" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-none">PUB ECOM</span>
              <span className="text-[10px] font-bold hub-text-primary tracking-widest uppercase">Master</span>
            </div>
          </Link>
        </div>

        <ScrollArea className="flex-1 px-3">
          <nav className="space-y-6 pb-8 mt-2">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <h3 className="px-3 text-[10px] font-bold text-[var(--hub-muted)] uppercase tracking-[0.2em] mb-2 opacity-50">
                  {group.label}
                </h3>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      activeProps={{ className: "hub-sidebar-item-active" }}
                      inactiveProps={{ className: "text-slate-400 hover:text-white hover:bg-white/5" }}
                      className="flex items-center gap-3 px-3 py-2 rounded text-[13px] font-medium transition-all group"
                    >
                      {React.createElement(item.icon, {
                        className: cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          location.pathname === item.href ? "text-[var(--hub-primary)]" : "text-slate-500 group-hover:text-white"
                        )
                      })}
                      <span className="flex-1">{item.label}</span>
                      {item.label === "Live Shop" && (
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 mt-auto border-t border-[var(--hub-border)]">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-8 w-8 rounded border border-[var(--hub-border)]">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Central PUB ECOM</p>
              <p className="text-[10px] text-[var(--hub-muted)] uppercase tracking-wider">operador · master</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-black/20 border-b border-[var(--hub-border)] flex items-center justify-between px-6 z-40 sticky top-0 backdrop-blur-sm">
          <div className="flex items-center gap-4">
             <h2 className="text-sm font-bold text-white">Visão Geral da Operação</h2>
             <div className="h-4 w-[1px] bg-[var(--hub-border)] mx-2" />
             <div className="text-[11px] text-[var(--hub-muted)] hidden md:block">
               PUB ECOM opera catálogo, fornecedores, fulfillment, checkout e financeiro de toda a rede
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded border border-[var(--hub-border)] text-[11px] font-medium">
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--hub-primary)] animate-pulse" />
                <span className="text-white">1.284 ONLINE</span>
             </div>
             <Button className="h-8 rounded bg-[var(--hub-primary)] hover:bg-[var(--hub-primary)]/80 text-[var(--hub-primary-foreground)] text-[11px] font-black uppercase tracking-wider px-4">
                Exportar Relatório
             </Button>
          </div>
        </header>

        {/* Filters Bar */}
        <div className="h-12 bg-black/10 border-b border-[var(--hub-border)] flex items-center justify-end px-6 gap-2 overflow-x-auto no-scrollbar">
           {['Hoje', '7 dias', '30 dias', 'Mês atual', 'Mês anterior', 'Personalizado'].map((filter, i) => (
             <button 
               key={filter}
               className={cn(
                 "text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all",
                 i === 0 ? "text-white bg-white/10" : "text-[var(--hub-muted)] hover:text-white"
               )}
             >
               {filter}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1">
          <div className="p-6 max-w-[1800px] mx-auto animate-in fade-in duration-700">
            <Outlet />
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

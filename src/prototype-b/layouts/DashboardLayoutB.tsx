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
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navGroups = [
  {
    label: "Operação",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/prototype-b/dashboard" },
      { label: "Live Shop", icon: Activity, href: "/prototype-b/dashboard/live" },
      { label: "Lojas", icon: Store, href: "/prototype-b/dashboard/stores" },
      { label: "Pedidos", icon: Package, href: "/prototype-b/dashboard/orders" },
    ]
  },
  {
    label: "Produtos & Logística",
    items: [
      { label: "Produtos", icon: Box, href: "/prototype-b/dashboard/products" },
      { label: "Fornecedores", icon: Truck, href: "/prototype-b/dashboard/suppliers" },
      { label: "Estoque", icon: Package, href: "/prototype-b/dashboard/inventory" },
    ]
  },
  {
    label: "Financeiro & Performance",
    items: [
      { label: "Financeiro", icon: BarChart3, href: "/prototype-b/dashboard/finance" },
      { label: "Ads & UTM", icon: TrendingUp, href: "/prototype-b/dashboard/ads" },
      { label: "Marketing", icon: Megaphone, href: "/prototype-b/dashboard/marketing" },
    ]
  },
  {
    label: "Crescimento",
    items: [
      { label: "Audience Engine", icon: Target, href: "/prototype-b/dashboard/audience" },
      { label: "Afiliados", icon: Share2, href: "/prototype-b/dashboard/afiliados" },
      { label: "Influencers", icon: Users, href: "/prototype-b/dashboard/influencers" },
      { label: "Ranking & Prêmios", icon: Award, href: "/prototype-b/dashboard/ranking" },
    ]
  },
  {
    label: "Sistema",
    items: [
      { label: "Configurações", icon: Settings, href: "/prototype-b/dashboard/settings" },
    ]
  }
];

export function DashboardLayoutB() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans selection:bg-primary/10 selection:text-primary">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-slate-100 flex flex-col z-50">
        <div className="p-8">
          <Link to="/prototype-b/dashboard" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <CircleDollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter text-slate-900 block leading-none">PUB ECOM</span>
              <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Prototype B</span>
            </div>
          </Link>
        </div>

        <ScrollArea className="flex-1 px-4">
          <nav className="space-y-8 pb-8">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  {group.label}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      activeProps={{ className: "bg-primary/5 text-primary" }}
                      inactiveProps={{ className: "text-slate-500 hover:bg-slate-50 hover:text-slate-900" }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group relative"
                    >
                      <div className={cn(
                        "p-1.5 rounded-lg transition-colors group-hover:bg-primary/10",
                        location.pathname === item.href && "bg-primary/10 text-primary"
                      )}>
                        {React.createElement(item.icon, {
                          className: "h-4.5 w-4.5 shrink-0"
                        })}
                      </div>
                      <span className="flex-1">{item.label}</span>
                      {location.pathname === item.href && (
                        <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 mt-auto border-t border-slate-50">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 truncate">Admin Master</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Plano Enterprise</p>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 z-40 sticky top-0">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 w-96 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar em pedidos, produtos, clientes..." 
              className="bg-transparent border-none text-sm font-medium focus:outline-none w-full text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full border-2 border-white" />
            </Button>
            <div className="h-8 w-[1px] bg-slate-100 mx-2" />
            <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20">
              Nova Loja
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <ScrollArea className="flex-1">
          <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            <Outlet />
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

import * as React from 'react';
import { Link, Outlet, useLocation } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Store, 
  Users, 
  DollarSign, 
  Activity, 
  BarChart3, 
  Settings,
  Package,
  Truck,
  Zap,
  ChevronRight,
  Search,
  Bell,
  Menu,
  Boxes,
  Target,
  Trophy,
  Globe,
  ExternalLink,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const navigation = [
  {
    title: 'Operacional',
    items: [
      { label: 'Dashboard Master', icon: LayoutDashboard, to: '/dashboard' },
      { label: 'Live Shop', icon: Activity, to: '/dashboard/live', badge: 'Ao Vivo' },
      { label: 'Lojas', icon: Store, to: '/dashboard/stores' },
      { label: 'Pedidos', icon: ShoppingBag, to: '/dashboard/orders' },
    ]
  },
  {
    title: 'Gestão & Catálogo',
    items: [
      { label: 'Produtos', icon: Package, to: '/dashboard' }, // Simulated for now
      { label: 'Fornecedores', icon: Truck, to: '/dashboard' },
      { label: 'Estoque', icon: Boxes, to: '/dashboard' },
      { label: 'Financeiro', icon: Wallet, to: '/dashboard/finance' },
    ]
  },
  {
    title: 'Crescimento',
    items: [
      { label: 'Audience Engine', icon: Target, to: '/dashboard/audience' },
      { label: 'Marketing & Ads', icon: BarChart3, to: '/dashboard/marketing' },
      { label: 'Ranking & Prêmios', icon: Trophy, to: '/dashboard' },
      { label: 'SEO', icon: Search, to: '/dashboard' },
    ]
  },
  {
    title: 'Sistema',
    items: [
      { label: 'Configurações', icon: Settings, to: '/dashboard/settings' },
    ]
  }
];

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r transition-all duration-300 ease-in-out md:relative md:translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
          !isSidebarOpen && "-translate-x-full md:w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b shrink-0 bg-white">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
              <Zap className="h-5 w-5 text-primary fill-primary/20" />
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-black tracking-tighter text-slate-900">PUB ECOM</span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
            {navigation.map((group) => (
              <div key={group.title} className="space-y-2">
                {isSidebarOpen && (
                  <h3 className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {group.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group relative",
                        "hover:bg-slate-50 text-slate-500 hover:text-primary",
                        "aria-[current]:bg-primary/5 aria-[current]:text-primary"
                      )}
                    >
                      <div className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        "group-hover:bg-primary/10",
                        "group-aria-[current]:bg-primary/10"
                      )}>
                        {React.createElement(item.icon, {
                          className: cn(
                            "h-4.5 w-4.5 shrink-0 transition-colors",
                            "group-hover:text-primary"
                          )
                        })}
                      </div>
                      {isSidebarOpen && (
                        <span className="flex-1 truncate tracking-tight">{item.label}</span>
                      )}
                      {isSidebarOpen && item.badge && (
                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-black bg-red-50 text-red-600 border-red-100 animate-pulse uppercase tracking-tighter">
                          {item.badge}
                        </Badge>
                      )}
                      {/* Active Indicator Line */}
                      <div className="absolute left-0 w-1 h-0 group-aria-[current]:h-6 bg-primary rounded-r-full transition-all duration-300" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t shrink-0 bg-white">
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:border-primary/20 cursor-pointer group",
              !isSidebarOpen && "justify-center p-2"
            )}>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                OC
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate tracking-tight">Operador Central</p>
                  <p className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-widest opacity-60">Pro Plano</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6 flex-1">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:bg-slate-50 rounded-xl">
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="hidden md:flex relative max-w-md w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Pesquisar na central PUB ECOM..." 
                className="pl-10 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary/10 transition-all h-10 rounded-xl font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <Link to="/store">
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 rounded-full border-slate-200 hover:bg-slate-50 hover:border-primary/20 text-xs font-black uppercase tracking-widest transition-all px-4">
                <ExternalLink className="h-3.5 w-3.5 text-primary" />
                <span>Loja Pública</span>
              </Button>
            </Link>
            
            <div className="flex items-center gap-2 border-l pl-4 ml-2 border-slate-100">
              <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] scrollbar-hide">
          <div className="max-w-[1600px] mx-auto p-4 md:p-8 animate-in fade-in duration-700">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}


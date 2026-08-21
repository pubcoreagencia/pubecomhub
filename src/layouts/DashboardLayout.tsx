import * as React from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import { LayoutDashboard, ShoppingBag, Store, Users, DollarSign, Activity, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Live Shop', icon: Activity, to: '/dashboard/live' },
  { label: 'Lojas', icon: Store, to: '/dashboard/stores' },
  { label: 'Pedidos', icon: ShoppingBag, to: '/dashboard/orders' },
  { label: 'Financeiro', icon: DollarSign, to: '/dashboard/finance' },
  { label: 'Audience', icon: Users, to: '/dashboard/audience' },
  { label: 'Marketing', icon: BarChart3, to: '/dashboard/marketing' },
  { label: 'Configurações', icon: Settings, to: '/dashboard/settings' },
];

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-primary tracking-tight">PUB ECOM</h1>
          <p className="text-xs text-muted-foreground uppercase font-semibold mt-1">Operador Central</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100 text-slate-600",
                "aria-[current]:bg-primary aria-[current]:text-primary-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
             <h2 className="text-lg font-semibold text-slate-800">Painel Master</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/store">
              <Button variant="outline" size="sm">Ver Loja Pública</Button>
            </Link>
            <div className="h-8 w-8 rounded-full bg-slate-200" />
          </div>

        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

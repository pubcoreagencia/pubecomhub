import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Plus, 
  Search, 
  Filter, 
  Globe, 
  Package, 
  Truck,
  Star,
  ExternalLink
} from 'lucide-react';
import { Shell } from '@/components/layout/Shell';
import { HubTable } from '@/components/ui-b';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/dashboard/suppliers')({
  component: () => (
    <Shell>
      <SuppliersDashboardB />
    </Shell>
  )
});

function SuppliersDashboardB() {
  const suppliers = [
    { 
      name: "Global Tech Hub", 
      category: "Eletrônicos Titanium", 
      location: "Shenzhen, CN", 
      rating: 4.9, 
      orders: 1240,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400"
    },
    { 
      name: "Nordic Design Co.", 
      category: "Mobiliário Premium", 
      location: "Stockholm, SE", 
      rating: 4.8, 
      orders: 850,
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Cadeia de Suprimentos</h2>
          <p className="text-[var(--hub-muted)] text-[9px] font-bold uppercase tracking-[0.3em]">Gestão de Parceiros & Logística Global</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-black/40 px-4 py-2.5 rounded-xl border border-[var(--hub-border)] group focus-within:border-[var(--hub-primary)] transition-all w-64">
            <Search className="h-4 w-4 text-[var(--hub-muted)] group-focus-within:text-[var(--hub-primary)]" />
            <input 
              type="text" 
              placeholder="Buscar fornecedor..." 
              className="bg-transparent border-none text-[11px] font-bold text-white focus:outline-none w-full placeholder:text-[var(--hub-muted)] uppercase tracking-wider"
            />
          </div>
          <Button className="h-10 hub-bg-primary hover:opacity-90 text-black text-[10px] font-black uppercase tracking-[0.2em] px-6 shadow-lg shadow-[var(--hub-primary)]/20 rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Novo Parceiro
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {suppliers.map((s, i) => (
          <div key={i} className="hub-card hub-gradient-border group overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-48 h-48 relative overflow-hidden shrink-0">
              <img 
                src={s.image} 
                alt={s.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
            </div>
            
            <div className="p-8 flex-1 flex flex-col justify-between bg-black/20">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 text-[9px] font-black text-[var(--hub-primary)] uppercase tracking-[0.2em] mb-1">
                    <Globe className="h-3 w-3" /> {s.location}
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-tight italic">{s.name}</h3>
                </div>
                <div className="flex items-center gap-1 bg-black/40 border border-[var(--hub-border)] px-3 py-1 rounded-lg">
                  <Star className="h-3 w-3 fill-current text-[var(--hub-primary)]" />
                  <span className="text-[10px] font-black text-white">{s.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-[9px] font-black text-[var(--hub-muted)] uppercase tracking-[0.2em] mb-1 italic opacity-60">Categoria</p>
                  <p className="text-xs font-black text-white uppercase tracking-wider">{s.category}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-[var(--hub-muted)] uppercase tracking-[0.2em] mb-1 italic opacity-60">Total Pedidos</p>
                  <p className="text-xs font-black text-white italic">{s.orders.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button className="flex-1 rounded-lg font-black text-[9px] uppercase tracking-[0.2em] h-10 border border-[var(--hub-border)] bg-white/5 text-white hover:bg-white/10 transition-all">
                  Ver Catálogo <Package className="ml-2 h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-white/5 border border-[var(--hub-border)] text-[var(--hub-muted)] hover:text-white transition-all">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

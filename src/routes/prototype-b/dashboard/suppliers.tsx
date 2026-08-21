import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Plus, 
  Search, 
  Filter, 
  Globe, 
  Mail, 
  Phone, 
  Package, 
  Truck,
  Star,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/suppliers')({
  component: SuppliersDashboardB
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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Fornecedores</h1>
          <p className="text-slate-500 font-bold">Gestão de parceiros e cadeia de suprimentos.</p>
        </div>
        <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 shadow-xl shadow-primary/20">
          Novo Fornecedor <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar por nome, categoria ou localização..." 
            className="pl-12 h-14 rounded-2xl border-none ring-1 ring-slate-100 bg-white font-bold text-sm shadow-sm"
          />
        </div>
        <Button variant="outline" className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest border-none ring-1 ring-slate-100 bg-white shadow-sm">
          Filtros <Filter className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {suppliers.map((s, i) => (
          <Card key={i} className="group rounded-[40px] border-none ring-1 ring-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white flex flex-col md:flex-row">
            <div className="w-full md:w-48 h-48 relative overflow-hidden shrink-0">
              <img 
                src={s.image} 
                alt={s.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            
            <CardContent className="p-8 flex-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                    <Globe className="h-3 w-3" /> {s.location}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-tight">{s.name}</h3>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full">
                  <Star className="h-3 w-3 fill-current text-yellow-400" />
                  <span className="text-[10px] font-black">{s.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Categoria</p>
                  <p className="text-sm font-black text-slate-700">{s.category}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Total Pedidos</p>
                  <p className="text-sm font-black text-slate-700">{s.orders.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 shadow-lg shadow-primary/10">
                  Ver Catálogo <Package className="ml-2 h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-50 border-none ring-1 ring-slate-100">
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

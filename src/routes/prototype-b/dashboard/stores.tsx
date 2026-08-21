import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Store, 
  Plus, 
  MoreVertical, 
  ExternalLink, 
  Settings,
  ShoppingBag,
  TrendingUp,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/stores')({
  component: StoresDashboardB
});

function StoresDashboardB() {
  const stores = [
    { 
      name: "Titanium Tech", 
      url: "titanium.pubecom.com", 
      status: "Online", 
      orders: 154, 
      revenue: "R$ 45.280", 
      conversion: "3.2%",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400"
    },
    { 
      name: "Minimalist Home", 
      url: "home.pubecom.com", 
      status: "Online", 
      orders: 89, 
      revenue: "R$ 12.450", 
      conversion: "2.8%",
      image: "https://images.unsplash.com/photo-1449247704656-1a641a794962?w=400"
    }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Lojas</h1>
          <p className="text-slate-500 font-bold">Gestão de vitrines e domínios da operação.</p>
        </div>
        <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 shadow-xl shadow-primary/20">
          Nova Loja <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {stores.map((store, i) => (
          <Card key={i} className="group rounded-[40px] border-none ring-1 ring-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white">
            <div className="h-48 relative overflow-hidden">
              <img 
                src={store.image} 
                alt={store.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{store.name}</h3>
                  <div className="flex items-center gap-2 text-slate-300 mt-1">
                    <Globe className="h-3 w-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{store.url}</span>
                  </div>
                </div>
                <Badge className="bg-emerald-500 text-white border-none rounded-full font-black px-4 py-1 uppercase tracking-widest text-[9px]">
                  {store.status}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-8">
              <div className="grid grid-cols-3 gap-8 mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ShoppingBag className="h-3 w-3" /> Pedidos
                  </p>
                  <p className="text-xl font-black text-slate-900">{store.orders}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" /> Faturamento
                  </p>
                  <p className="text-xl font-black text-slate-900">{store.revenue}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conversão</p>
                  <p className="text-xl font-black text-primary italic">{store.conversion}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button className="flex-1 rounded-xl font-black text-xs uppercase tracking-widest h-12 shadow-lg shadow-primary/10">
                  Gerenciar <Settings className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="rounded-xl font-black text-xs uppercase tracking-widest h-12 border-slate-200 px-6">
                  Ver Loja <ExternalLink className="ml-2 h-4 w-4 text-slate-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Store Placeholder */}
        <button className="rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 hover:border-primary hover:bg-slate-50/50 transition-all group min-h-[400px]">
          <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-6">
            <Plus className="h-10 w-10 text-slate-300 group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-2">Adicionar Nova Vitrine</h3>
          <p className="text-sm font-bold text-slate-400 max-w-[200px] text-center uppercase tracking-widest leading-relaxed">
            Expanda sua operação com um novo domínio personalizado.
          </p>
        </button>
      </div>
    </div>
  );
}

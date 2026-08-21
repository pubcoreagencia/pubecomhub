import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Tag, 
  Layers, 
  Box,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockProducts } from '../../../prototype-b/data/mock';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/products')({
  component: ProductsDashboardB
});

function ProductsDashboardB() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Produtos</h1>
          <p className="text-slate-500 font-bold">Gestão de catálogo e estoque global.</p>
        </div>
        <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 shadow-xl shadow-primary/20">
          Adicionar Produto <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Filtrar produtos por nome, SKU ou categoria..." 
            className="pl-12 h-14 rounded-2xl border-none ring-1 ring-slate-100 bg-white font-bold text-sm shadow-sm"
          />
        </div>
        <Button variant="outline" className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest border-none ring-1 ring-slate-100 bg-white shadow-sm">
          Filtros <Filter className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <Card key={product.id} className="group rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white">
            <div className="h-56 relative overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full shadow-lg bg-white opacity-0 group-hover:opacity-100 transition-opacity border-none">
                  <MoreVertical className="h-4 w-4 text-slate-900" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-black text-[8px] uppercase tracking-widest px-3 py-1">
                  Estoque: 124
                </Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                  <Tag className="h-3 w-3" /> Categoria Premium
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase group-hover:text-primary transition-colors cursor-pointer leading-tight">
                  {product.name}
                </h3>
              </div>
              
              <div className="flex items-end justify-between pt-4 border-t border-slate-50">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Preço Sugerido</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter italic">R$ {product.price.toLocaleString('pt-BR')}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-50 transition-colors">
                  <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

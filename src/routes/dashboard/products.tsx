import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Shell } from '@/components/layout/Shell';
import { HubTable, CardMetric } from '@/components/ui-b';
import { Box, Package, Truck, AlertTriangle, Search, Filter, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/dashboard/products')({
  component: () => <ProductsB />,
});

function ProductsB() {
  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-1">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Gestão de Catálogo</h2>
              <p className="text-[var(--hub-muted)] text-[9px] font-bold uppercase tracking-[0.3em]">Central de Operação de Produtos & Logística</p>
           </div>
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-black/40 px-4 py-2.5 rounded-xl border border-[var(--hub-border)] group focus-within:border-[var(--hub-primary)] transition-all w-64">
                <Search className="h-4 w-4 text-[var(--hub-muted)] group-focus-within:text-[var(--hub-primary)]" />
                <input 
                  type="text" 
                  placeholder="Buscar SKU ou Nome..." 
                  className="bg-transparent border-none text-[11px] font-bold text-white focus:outline-none w-full placeholder:text-[var(--hub-muted)] uppercase tracking-wider"
                />
              </div>
              <Button className="h-10 hub-bg-primary hover:opacity-90 text-black text-[10px] font-black uppercase tracking-[0.2em] px-6 shadow-lg shadow-[var(--hub-primary)]/20 rounded-xl">
                 <Plus className="h-4 w-4 mr-2" />
                 Novo Produto
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <CardMetric label="Produtos Ativos" value="1.284" icon={Box} />
           <CardMetric label="Estoque Global" value="28.450" subtext="Unidades totais" icon={Package} />
           <CardMetric label="Alerta Reposição" value="18" trendType="down" trend="Crítico" icon={AlertTriangle} />
           <CardMetric label="Margem Média" value="52.4%" trend="+2.1%" trendType="up" icon={TrendingUp} />
        </div>

        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Inventário de Alta Performance</h3>
              <div className="flex gap-2">
                 <button className="px-4 py-2 text-[9px] font-black text-white bg-white/5 border border-[var(--hub-border)] rounded-lg uppercase tracking-widest hover:bg-white/10 transition-all">
                    <Filter className="h-3 w-3 inline-block mr-2" />
                    Filtros
                 </button>
              </div>
           </div>
           
           <HubTable headers={['SKU', 'Produto', 'Fornecedor', 'Estoque', 'Custo', 'Venda', 'Margem', 'Status']}>
             {[
               { sku: 'PUB-WH-001', nome: 'Premium Wireless Headphones', sup: 'FastShip Logistics', stock: 150, cost: 'R$ 450', price: 'R$ 899', margin: '50%', status: 'Active' },
               { sku: 'PUB-SW-002', nome: 'Smart Fitness Watch Pro', sup: 'Tech Source Pro', stock: 18, cost: 'R$ 210', price: 'R$ 459', margin: '54%', status: 'Low Stock' },
               { sku: 'PUB-CM-003', nome: 'Ultra HD Camera 4K', sup: 'Global Optic', stock: 142, cost: 'R$ 1.200', price: 'R$ 2.400', margin: '50%', status: 'Active' },
               { sku: 'PUB-MC-004', nome: 'Professional Microphone', sup: 'Audio Tech', stock: 0, cost: 'R$ 380', price: 'R$ 799', margin: '52%', status: 'Out of Stock' },
             ].map(prod => (
               <tr key={prod.sku} className="hover:bg-white/[0.02] transition-colors group">
                 <td className="px-6 py-5 font-black text-[var(--hub-muted)] group-hover:text-white">{prod.sku}</td>
                 <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-lg bg-black/40 border border-[var(--hub-border)] flex items-center justify-center overflow-hidden">
                          <Package className="h-5 w-5 text-[var(--hub-muted)]" />
                       </div>
                       <div className="space-y-0.5">
                          <span className="font-black text-white italic block leading-none">{prod.nome}</span>
                          <span className="text-[9px] text-[var(--hub-muted)] uppercase tracking-widest font-bold">Categoria: Eletrônicos</span>
                       </div>
                    </div>
                 </td>
                 <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <Truck className="h-3 w-3 text-[var(--hub-muted)]" />
                       <span className="text-[var(--hub-muted)] font-bold uppercase tracking-widest text-[9px]">{prod.sup}</span>
                    </div>
                 </td>
                 <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <span className={cn(
                         "font-black italic",
                         prod.stock < 20 ? "text-red-500" : "text-white"
                       )}>
                          {prod.stock}
                       </span>
                       {prod.stock < 20 && <AlertTriangle className="h-3 w-3 text-red-500 animate-pulse" />}
                    </div>
                 </td>
                 <td className="px-6 py-5 text-red-400 font-bold italic">{prod.cost}</td>
                 <td className="px-6 py-5 text-white font-black italic">{prod.price}</td>
                 <td className="px-6 py-5">
                    <span className="font-black text-[var(--hub-primary)] italic">{prod.margin}</span>
                 </td>
                 <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                      prod.status === 'Active' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                      prod.status === 'Low Stock' ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                      "bg-red-500/10 text-red-500 border border-red-500/20"
                    )}>
                       {prod.status}
                    </span>
                 </td>
               </tr>
             ))}
           </HubTable>
        </div>
      </div>
    </Shell>
  );
}

import { TrendingUp } from 'lucide-react';


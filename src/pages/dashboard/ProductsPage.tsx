import { useEffect, useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { HubTable, CardMetric } from '@/components/ui-b';
import { Box, Package, AlertTriangle, Search, Filter, Plus, Truck, TrendingUp, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { catalogApi } from '@/lib/api/catalog';
import { Product } from '@/lib/api/types';
import { toast } from 'sonner';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    catalogApi.getProducts()
      .then(setProducts)
      .catch((e) => {
        console.error(e);
        toast.error('Erro ao carregar catálogo global');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.externalId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-1">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Gestão de Catálogo Master</h2>
              <p className="text-[var(--hub-muted)] text-[9px] font-bold uppercase tracking-[0.3em]">Repositório Global de Produtos Sincronizados</p>
           </div>
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-black/40 px-4 py-2.5 rounded-xl border border-[var(--hub-border)] group focus-within:border-[var(--hub-primary)] transition-all w-64">
                <Search className="h-4 w-4 text-[var(--hub-muted)] group-focus-within:text-[var(--hub-primary)]" />
                <input 
                  type="text" 
                  placeholder="Buscar SKU, ID ou Nome..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none text-[11px] font-bold text-white focus:outline-none w-full placeholder:text-[var(--hub-muted)] uppercase tracking-wider"
                />
              </div>
              <Button 
                onClick={fetchProducts}
                className="h-10 hub-bg-primary hover:opacity-90 text-black text-[10px] font-black uppercase tracking-[0.2em] px-6 shadow-lg shadow-[var(--hub-primary)]/20 rounded-xl"
              >
                 <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                 Atualizar
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <CardMetric label="Produtos Totais" value={products.length.toString()} icon={Box} />
           <CardMetric label="Fontes" value={Array.from(new Set(products.map(p => p.storeId.split(':')[0]))).length.toString()} subtext="Canais integrados" icon={Truck} />
           <CardMetric label="Preço Médio" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(products.length ? products.reduce((acc, p) => acc + p.price, 0) / products.length : 0)} icon={TrendingUp} />
           <CardMetric label="Inventário Sync" value="REALTIME" trendType="up" trend="Ativo" icon={Package} />
        </div>

        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic">Inventário Master (D1)</h3>
              <div className="flex gap-2">
                 <button className="px-4 py-2 text-[9px] font-black text-white bg-white/5 border border-[var(--hub-border)] rounded-lg uppercase tracking-widest hover:bg-white/10 transition-all">
                    <Filter className="h-3 w-3 inline-block mr-2" />
                    Filtros
                 </button>
              </div>
           </div>
           
           <HubTable headers={['Imagem', 'Produto', 'ID Externo', 'SKU', 'Preço', 'Categoria', 'Canais', 'Ações']}>
             {filteredProducts.map(prod => (
               <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors group">
                 <td className="px-6 py-5">
                    <div className="h-10 w-10 rounded-lg bg-black/40 border border-[var(--hub-border)] flex items-center justify-center overflow-hidden">
                       {prod.images[0] ? (
                         <img src={prod.images[0]} alt={prod.title} className="h-full w-full object-cover" />
                       ) : (
                         <Package className="h-5 w-5 text-[var(--hub-muted)]" />
                       )}
                    </div>
                 </td>
                 <td className="px-6 py-5">
                    <div className="space-y-0.5 max-w-[200px]">
                       <span className="font-black text-white italic block leading-none truncate">{prod.title}</span>
                       <span className="text-[9px] text-[var(--hub-muted)] uppercase tracking-widest font-bold">Store: {prod.storeId}</span>
                    </div>
                 </td>
                 <td className="px-6 py-5 text-[9px] font-mono text-[var(--hub-muted)] uppercase">{prod.externalId}</td>
                 <td className="px-6 py-5 text-[10px] font-mono text-white italic">{prod.sku || '-'}</td>
                 <td className="px-6 py-5 text-white font-black italic">
                   {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: prod.currency || 'BRL' }).format(prod.price)}
                 </td>
                 <td className="px-6 py-5">
                   <span className="px-2 py-0.5 rounded-[4px] bg-black/40 border border-[var(--hub-border)] text-[8px] font-black text-[var(--hub-muted)] uppercase italic">
                     {prod.category || 'Geral'}
                   </span>
                 </td>
                 <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <span className="text-[var(--hub-muted)] font-bold uppercase tracking-widest text-[9px]">{prod.storeId.split(':')[0]}</span>
                    </div>
                 </td>
                 <td className="px-6 py-5 text-right">
                    <a 
                      href={prod.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 text-[var(--hub-muted)] hover:text-[var(--hub-primary)] transition-colors inline-block"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                 </td>
               </tr>
             ))}
             {filteredProducts.length === 0 && !loading && (
               <tr>
                 <td colSpan={8} className="px-6 py-20 text-center text-[var(--hub-muted)] italic text-[11px] uppercase tracking-widest">
                   Nenhum produto encontrado no Catálogo Master.
                 </td>
               </tr>
             )}
           </HubTable>
        </div>
      </div>
    </Shell>
  );
}
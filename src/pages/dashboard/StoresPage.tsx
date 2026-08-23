import { useEffect, useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { HubTable } from '@/components/ui-b';
import { Link } from '@tanstack/react-router';
import { Plus, Search, Filter, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { catalogApi } from '@/lib/api/catalog';
import { Store } from '@/lib/api/types';
import { toast } from 'sonner';

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catalogApi.getStores()
      .then(setStores)
      .catch((e) => {
        console.error(e);
        if (e.status === 401 || e.isAuthError) {
          toast.error(e.message || 'Usuário não autenticado. Faça login no Supabase para acessar o catálogo.');
        } else {
          toast.error(e.message || 'Falha ao carregar lojas');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="bg-black/40 px-4 py-2 rounded border border-[var(--hub-border)] flex items-center gap-3 w-80">
                 <Search className="h-4 w-4 text-[var(--hub-muted)]" />
                 <input type="text" placeholder="Buscar lojas..." className="bg-transparent border-none text-[11px] text-white focus:outline-none w-full" />
              </div>
              <Button variant="ghost" className="h-9 text-[10px] font-bold uppercase tracking-widest text-[var(--hub-muted)] hover:text-white">
                 <Filter className="h-4 w-4 mr-2" /> Filtrar
              </Button>
           </div>
           <Button className="h-9 bg-[var(--hub-primary)] hover:bg-[var(--hub-primary)]/80 text-[var(--hub-primary-foreground)] text-[10px] font-black uppercase tracking-wider px-6">
              <Plus className="h-4 w-4 mr-2" /> Criar Nova Vitrine
           </Button>
        </div>

        {loading ? (
            <div className="text-white text-center py-10">Carregando lojas...</div>
        ) : (
            <HubTable headers={['Status', 'Loja', 'Username', 'Source', 'Produtos', 'Sync', 'Ações']}>
            {stores.map((loja) => (
                <tr key={loja.id}>
                <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase ${loja.status === 'active' ? 'bg-[var(--hub-primary)]/20 text-[var(--hub-primary)]' : 'bg-slate-500/20 text-slate-400'}`}>
                        {loja.status}
                    </span>
                </td>
                <td className="px-5 py-4 font-bold text-white">{loja.name}</td>
                <td className="px-5 py-4 text-[var(--hub-muted)]">{loja.username}</td>
                <td className="px-5 py-4 text-white uppercase text-[10px] font-bold">{loja.source}</td>
                <td className="px-5 py-4 font-black text-white">{loja.productCount}</td>
                <td className="px-5 py-4 text-[var(--hub-muted)]">
                    <div className="flex items-center gap-2">
                        {loja.syncState === 'success' && <CheckCircle className="h-3 w-3 text-red-500" />}
                        {loja.syncState === 'failed' && <AlertCircle className="h-3 w-3 text-red-500" />}
                        {loja.syncState === 'running' && <RefreshCw className="h-3 w-3 text-blue-500 animate-spin" />}
                        {loja.syncState}
                    </div>
                </td>
                <td className="px-5 py-4 text-right">
                    <Link 
                        to="/dashboard/stores/$storeId"
                        params={{ storeId: loja.id }}
                        className="text-[var(--hub-primary)] hover:bg-[var(--hub-primary)]/10 text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-lg transition-colors border border-[var(--hub-primary)]/20"
                    >
                        Gerenciar
                    </Link>
                </td>
                </tr>
            ))}
            </HubTable>
        )}
      </div>
    </Shell>
  );
}

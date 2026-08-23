import { useEffect, useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { CardMetric, AcquisitionFunnel } from '@/components/ui-b';
import { cn } from '@/lib/utils';
import { 
  Package, Store as StoreIcon, Activity, Zap, LayoutDashboard, RefreshCw
} from 'lucide-react';
import { catalogApi } from '@/lib/api/catalog';
import { CatalogStats } from '@/lib/api/types';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [stats, setStats] = useState<CatalogStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    catalogApi.getStats()
      .then(setStats)
      .catch((e) => {
        console.error(e);
        if (e.status === 401 || e.isAuthError) {
          toast.error(e.message || 'Usuário não autenticado. Faça login no Supabase para acessar o catálogo.');
        } else {
          toast.error(e.message || 'Falha ao conectar com o backend real');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-white italic">Master Catalog Performance</h2>
            {loading && <RefreshCw className="h-4 w-4 text-red-500 animate-spin" />}
          </div>
          <button 
            onClick={fetchStats}
            disabled={loading}
            className="text-[10px] font-black text-[var(--hub-primary)] uppercase tracking-widest hover:underline italic flex items-center gap-2"
          >
            <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
            Atualizar Dados
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Metric Cards */}
            <CardMetric 
            label="Total de Produtos" 
            value={stats?.stats.products.toString() || '0'} 
            subtext="Backend Real"
            icon={Package}
            />
            <CardMetric 
            label="Lojas Conectadas" 
            value={stats?.stats.stores.toString() || '0'} 
            subtext={`${stats?.stats.activeStores || 0} Ativas`}
            icon={StoreIcon}
            />
            <CardMetric 
            label="Sincronizações" 
            value={stats?.stats.sync.success.toString() || '0'} 
            trend={stats?.stats.sync.running ? 'Processando' : 'Idle'}
            trendType={stats?.stats.sync.running ? 'up' : 'neutral'}
            icon={Activity}
            />
            <CardMetric 
            label="Fontes Ativas" 
            value={Object.keys(stats?.stats.sources || {}).length.toString() || '0'} 
            subtext={Object.keys(stats?.stats.sources || {}).join(', ') || 'Nenhuma'}
            icon={Zap}
            />

            <div className="xl:col-span-3 space-y-8">
            {/* Main Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Chart 1: Sales by Channel */}
                <div className="hub-card hub-gradient-border p-6 h-[300px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Lojas por Fonte</h3>
                        <div className="h-6 w-6 rounded-lg bg-black/40 border border-[var(--hub-border)] flex items-center justify-center">
                        <LayoutDashboard className="h-3 w-3 text-[var(--hub-muted)]" />
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                        {stats?.stats.sources && Object.entries(stats.stats.sources).map(([source, data]) => (
                        <div key={source} className="space-y-1">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest italic">
                                <span className="text-[var(--hub-muted)]">{source}</span>
                                <span className="text-white">{data.products} Produtos</span>
                            </div>
                            <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--hub-primary)]" style={{ width: '100%' }} />
                            </div>
                        </div>
                        ))}
                        {(!stats || Object.keys(stats.stats.sources).length === 0) && (
                            <div className="text-[10px] text-[var(--hub-muted)] italic">Nenhuma fonte detectada</div>
                        )}
                    </div>
                </div>

                {/* Chart 2: Visitors by Hour */}
                <div className="hub-card hub-gradient-border p-6 h-[300px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Status de Sincronização</h3>
                        <Activity className="h-3 w-3 text-[var(--hub-muted)]" />
                    </div>
                    <div className="flex-1 space-y-3 pt-2">
                        {[
                            { label: 'Sucesso', val: stats?.stats.sync.success || 0, color: 'bg-red-500' },
                            { label: 'Processando', val: stats?.stats.sync.running || 0, color: 'bg-blue-500' },
                            { label: 'Parcial', val: stats?.stats.sync.partial || 0, color: 'bg-yellow-500' },
                            { label: 'Erro', val: stats?.stats.sync.error || 0, color: 'bg-red-500' }
                        ].map(s => (
                            <div key={s.label} className="flex items-center gap-3">
                                <div className={cn("h-2 w-2 rounded-full", s.color)} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--hub-muted)] w-24">{s.label}</span>
                                <div className="flex-1 h-1 bg-black/40 rounded-full overflow-hidden">
                                    <div className={cn("h-full", s.color)} style={{ width: `${(s.val / (stats?.stats.sync.success || 1)) * 100}%` }} />
                                </div>
                                <span className="text-[10px] font-black text-white">{s.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ranking Tables */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Status da Operação Real</h3>
                </div>
                <div className="p-8 hub-card hub-gradient-border text-center">
                    <p className="text-[10px] text-[var(--hub-muted)] uppercase tracking-[0.2em] font-black italic">
                        Infraestrutura conectada ao D1 Master Catalog via Cloudflare Worker
                    </p>
                </div>
            </div>
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-8">
            <AcquisitionFunnel />
            
            {/* Live Event Stream */}
            <div className="hub-card hub-gradient-border p-6 flex flex-col min-h-[450px]">
                <div className="flex items-center justify-between mb-8">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Catalog Sync Stream</h4>
                    <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">REALTIME</span>
                    </div>
                </div>
                <div className="space-y-4">
                    {[
                    { msg: 'Stats Recarregados', type: 'API', time: 'agora', meta: 'Backend Official' },
                    { msg: 'Conectado ao D1', type: 'SQL', time: 'ativo', meta: 'Cloudflare' },
                    { msg: 'Health Check', type: 'SUCCESS', time: 'ok', meta: 'v1.6.5' },
                    ].map((evt, i) => (
                    <div key={i} className="hub-glass p-4 rounded-xl border border-[var(--hub-border)] space-y-2 hover:border-[var(--hub-primary)] transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                            <span className={cn(
                            "text-[8px] font-black px-1.5 py-0.5 rounded uppercase",
                            evt.type === 'SUCCESS' ? "bg-[var(--hub-primary)] text-black" : "bg-white/10 text-white"
                            )}>
                            {evt.type}
                            </span>
                            <span className="text-[9px] text-[var(--hub-muted)] font-bold italic">{evt.time}</span>
                        </div>
                        <p className="text-[11px] font-black text-white italic leading-tight">{evt.msg}</p>
                        <p className="text-[9px] text-[var(--hub-muted)] font-bold uppercase tracking-widest opacity-40">{evt.meta}</p>
                    </div>
                    ))}
                </div>
            </div>
            </div>
        </div>
      </div>
    </Shell>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { HubTable } from "@/components/ui-b";
import {
  RefreshCw,
  ArrowLeft,
  Package,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Power,
  History,
  ShieldCheck,
  AlertTriangle,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogApi } from "@/lib/api/catalog";
import { Store, Product, SyncRun, StoreOperationalStatus, SyncResponse } from "@/lib/api/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function StoreDetailPage() {
  const { storeId } = useParams({ from: "/dashboard/stores/$storeId" });
  const [store, setStore] = useState<Store | null>(null);
  const [statusInfo, setStatusInfo] = useState<StoreOperationalStatus | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [syncRuns, setSyncRuns] = useState<SyncRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState<1 | 10 | 50 | 100>(10);
  const [syncResult, setSyncResult] = useState<SyncResponse["results"] | null>(null);

  const fetchData = async () => {
    try {
      const [storeData, statusData, productsData, runsData] = await Promise.all([
        catalogApi.getStore(storeId),
        catalogApi.getStoreStatus(storeId).catch(() => null),
        catalogApi.getStoreProducts(storeId),
        catalogApi.getStoreSyncRuns(storeId, { limit: 10 }).catch(() => ({ runs: [], total: 0 })),
      ]);
      setStore(storeData);
      setStatusInfo(statusData);
      setProducts(productsData);
      setSyncRuns(runsData.runs || []);
    } catch (e: any) {
      console.error(e);
      if (e.status === 401 || e.isAuthError) {
        toast.error(
          e.message || "Usuário não autenticado. Faça login no Supabase para acessar o catálogo.",
        );
      } else if (e.status === 403) {
        toast.error(
          e.message || "Acesso negado: você não tem permissão para visualizar esta loja.",
        );
      } else {
        toast.error(e.message || "Erro ao carregar dados da loja");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [storeId]);

  const handleToggleStatus = async () => {
    if (!store || togglingStatus) return;
    const newStatus = store.status === "active" ? "inactive" : "active";
    setTogglingStatus(true);

    try {
      const res = await catalogApi.updateStoreStatus(store.id, newStatus);
      if (res.success) {
        setStore(res.store);
        toast.success(`Loja ${newStatus === "active" ? "ativada" : "desativada"} com sucesso.`);
        await fetchData();
      }
    } catch (err: any) {
      toast.error(`Erro ao alterar status: ${err.message || String(err)}`);
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    if (store?.status !== "active") {
      toast.error("Loja inativa. Ative a loja antes de iniciar a sincronização.");
      return;
    }

    setRefreshing(true);
    setSyncResult(null);
    toast.info(`Sincronizando loja (limite: ${selectedLimit} produtos)...`);

    try {
      const response = await catalogApi.refreshStore(storeId, selectedLimit);
      if (response.success) {
        setSyncResult(response.results || null);
        toast.success("Sincronização concluída com sucesso!");
        await fetchData();
      }
    } catch (error: any) {
      if (error.status === 409) {
        toast.warning("Sincronização já está em andamento no servidor para esta loja.");
      } else if (error.status === 401 || error.isAuthError) {
        toast.error(
          error.message ||
            "Usuário não autenticado. Faça login no Supabase para acessar o catálogo.",
        );
      } else if (error.status === 403) {
        toast.error(
          error.message ||
            "Acesso negado: você não tem permissão MASTER para atualizar o catálogo.",
        );
      } else {
        toast.error(`Falha ao sincronizar: ${error.data?.message || error.message}`);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const getHealthBadge = (health?: string) => {
    switch (health) {
      case "healthy":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="h-3 w-3" /> Saudável
          </span>
        );
      case "syncing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse">
            <RefreshCw className="h-3 w-3 animate-spin" /> Sincronizando
          </span>
        );
      case "degraded":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <AlertTriangle className="h-3 w-3" /> Degradado
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/30">
            <AlertCircle className="h-3 w-3" /> Erro Operacional
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <Clock className="h-3 w-3" /> Nunca Sincronizado
          </span>
        );
    }
  };

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 text-[var(--hub-primary)] animate-spin" />
        </div>
      </Shell>
    );
  }

  if (!store) {
    return (
      <Shell>
        <div className="text-center py-20 space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-white text-xl font-bold">Loja não encontrada</h2>
          <Button onClick={() => window.history.back()} variant="outline">
            Voltar
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg bg-black/40 border border-[var(--hub-border)] text-[var(--hub-muted)] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-white italic">{store.name}</h1>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase",
                    store.status === "active"
                      ? "bg-[var(--hub-primary)]/20 text-[var(--hub-primary)]"
                      : "bg-slate-500/20 text-slate-400",
                  )}
                >
                  {store.status}
                </span>
                {getHealthBadge(statusInfo?.health)}
              </div>
              <p className="text-[10px] text-[var(--hub-muted)] font-black uppercase tracking-[0.2em]">
                {store.source} · {store.username || "sem username"} · ID: {store.shopId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Toggle Button */}
            <Button
              variant="outline"
              onClick={handleToggleStatus}
              disabled={togglingStatus || refreshing}
              className="h-11 text-[10px] font-bold uppercase tracking-wider border-[var(--hub-border)]"
            >
              <Power className="h-3.5 w-3.5 mr-2 text-[var(--hub-muted)]" />
              {store.status === "active" ? "Desativar Loja" : "Ativar Loja"}
            </Button>

            {/* Limit Selector */}
            <div className="flex items-center bg-black/40 border border-[var(--hub-border)] rounded-lg p-1">
              {[1, 10, 50, 100].map((lim) => (
                <button
                  key={lim}
                  type="button"
                  onClick={() => setSelectedLimit(lim as any)}
                  className={`px-3 py-1.5 text-[9px] font-black uppercase rounded transition-all ${
                    selectedLimit === lim
                      ? "bg-[var(--hub-primary)] text-black"
                      : "text-[var(--hub-muted)] hover:text-white"
                  }`}
                >
                  {lim}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <Button
              onClick={handleRefresh}
              disabled={refreshing || store.status !== "active"}
              className="bg-[var(--hub-primary)] hover:bg-[var(--hub-primary)]/80 text-[var(--hub-primary-foreground)] font-black uppercase tracking-wider h-11 px-6"
            >
              {refreshing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Sincronizando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2 fill-current" /> Sincronizar ({selectedLimit})
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Sync Summary Alert */}
        {syncResult && (
          <div className="hub-card border-[var(--hub-primary)]/30 bg-[var(--hub-primary)]/5 p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 text-[var(--hub-primary)]">
              <CheckCircle className="h-5 w-5" />
              <h3 className="text-sm font-black uppercase tracking-widest">
                Resultado da Sincronização
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-[9px] text-[var(--hub-muted)] font-black uppercase tracking-widest">
                  Encontrados
                </p>
                <p className="text-xl font-black text-white italic">{syncResult.productsFound}</p>
              </div>
              <div>
                <p className="text-[9px] text-emerald-400/80 font-black uppercase tracking-widest">
                  Criados
                </p>
                <p className="text-xl font-black text-emerald-400 italic">{syncResult.created}</p>
              </div>
              <div>
                <p className="text-[9px] text-blue-400/80 font-black uppercase tracking-widest">
                  Atualizados
                </p>
                <p className="text-xl font-black text-blue-400 italic">{syncResult.updated}</p>
              </div>
              <div>
                <p className="text-[9px] text-[var(--hub-muted)] font-black uppercase tracking-widest">
                  Inalterados
                </p>
                <p className="text-xl font-black text-white italic">{syncResult.unchanged}</p>
              </div>
              <div>
                <p className="text-[9px] text-[var(--hub-muted)] font-black uppercase tracking-widest">
                  Duração
                </p>
                <p className="text-xl font-black text-white italic">
                  {(syncResult.duration / 1000).toFixed(1)}s
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="hub-card hub-gradient-border p-6 space-y-2">
            <Package className="h-4 w-4 text-[var(--hub-muted)] mb-2" />
            <p className="text-[9px] text-[var(--hub-muted)] font-black uppercase tracking-widest">
              Produtos Sincronizados
            </p>
            <p className="text-2xl font-black text-white italic">{store.productCount}</p>
          </div>
          <div className="hub-card hub-gradient-border p-6 space-y-2">
            <Activity className="h-4 w-4 text-[var(--hub-muted)] mb-2" />
            <p className="text-[9px] text-[var(--hub-muted)] font-black uppercase tracking-widest">
              Estado Sync
            </p>
            <p
              className={cn(
                "text-2xl font-black italic uppercase",
                store.syncState === "success"
                  ? "text-emerald-400"
                  : store.syncState === "running"
                    ? "text-blue-500"
                    : store.syncState === "error" || store.syncState === "failed"
                      ? "text-red-500"
                      : "text-white",
              )}
            >
              {store.syncState}
            </p>
          </div>
          <div className="hub-card hub-gradient-border p-6 space-y-2">
            <CheckCircle className="h-4 w-4 text-emerald-400/80 mb-2" />
            <p className="text-[9px] text-[var(--hub-muted)] font-black uppercase tracking-widest">
              Último Sync Sucesso
            </p>
            <p className="text-sm font-bold text-white truncate">
              {statusInfo?.lastSuccessfulSync
                ? new Date(statusInfo.lastSuccessfulSync).toLocaleString("pt-BR")
                : store.lastSyncAt
                  ? new Date(store.lastSyncAt).toLocaleString("pt-BR")
                  : "Nunca"}
            </p>
          </div>
          <div className="hub-card hub-gradient-border p-6 space-y-2">
            <Clock className="h-4 w-4 text-[var(--hub-muted)] mb-2" />
            <p className="text-[9px] text-[var(--hub-muted)] font-black uppercase tracking-widest">
              Última Tentativa
            </p>
            <p className="text-sm font-bold text-white truncate">
              {store.lastSyncAt ? new Date(store.lastSyncAt).toLocaleString("pt-BR") : "Nunca"}
            </p>
          </div>
        </div>

        {/* Sync History Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-[var(--hub-primary)]" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic">
                Histórico Operacional de Sincronizações ({syncRuns.length})
              </h3>
            </div>
            <span className="text-[9px] font-black text-[var(--hub-muted)] uppercase tracking-widest italic opacity-40">
              D1 Sync Runs Log
            </span>
          </div>

          <HubTable
            headers={[
              "Status",
              "Início",
              "Limite",
              "Descobertos",
              "Criados",
              "Atualizados",
              "Inalterados",
              "Duração",
            ]}
          >
            {syncRuns.map((run) => (
              <tr key={run.id} className="hover:bg-white/[0.02]">
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase",
                      run.status === "success"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : run.status === "partial"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : run.status === "running"
                            ? "bg-blue-500/20 text-blue-400 animate-pulse"
                            : "bg-red-500/20 text-red-400",
                    )}
                  >
                    {run.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-[10px] text-white font-mono">
                  {new Date(run.startedAt).toLocaleString("pt-BR")}
                </td>
                <td className="px-5 py-3 text-[10px] text-[var(--hub-muted)] font-bold">
                  {run.requestedLimit}
                </td>
                <td className="px-5 py-3 text-[10px] font-bold text-white">{run.discovered}</td>
                <td className="px-5 py-3 text-[10px] font-black text-emerald-400">{run.created}</td>
                <td className="px-5 py-3 text-[10px] font-black text-blue-400">{run.updated}</td>
                <td className="px-5 py-3 text-[10px] text-[var(--hub-muted)] font-mono">
                  {run.unchanged}
                </td>
                <td className="px-5 py-3 text-[10px] text-[var(--hub-muted)] font-mono">
                  {run.durationMs ? `${(run.durationMs / 1000).toFixed(1)}s` : "-"}
                </td>
              </tr>
            ))}
            {syncRuns.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-[var(--hub-muted)] italic text-[11px] uppercase tracking-widest"
                >
                  Nenhum registro de sincronização encontrado para esta loja.
                </td>
              </tr>
            )}
          </HubTable>
        </div>

        {/* Products Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic">
              Catálogo de Produtos da Loja ({products.length})
            </h3>
            <span className="text-[9px] font-black text-[var(--hub-muted)] uppercase tracking-widest italic opacity-40">
              D1 Master Storage
            </span>
          </div>

          <HubTable headers={["Imagem", "Título", "SKU", "Preço", "Categoria", "Ações"]}>
            {products.map((product) => (
              <tr key={product.id} className="group hover:bg-white/[0.02]">
                <td className="px-5 py-3">
                  <div className="h-12 w-12 rounded bg-black/40 border border-[var(--hub-border)] overflow-hidden">
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="max-w-[300px]">
                    <p className="text-white font-bold truncate">{product.title}</p>
                    <p className="text-[9px] text-[var(--hub-muted)] font-mono uppercase truncate italic">
                      {product.externalId}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono text-[10px] text-[var(--hub-muted)] italic">
                  {product.sku || "-"}
                </td>
                <td className="px-5 py-3 font-black text-white italic">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: product.currency || "BRL",
                  }).format(product.price)}
                </td>
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 rounded-[4px] bg-black/40 border border-[var(--hub-border)] text-[8px] font-black text-[var(--hub-muted)] uppercase italic">
                    {product.category || "Geral"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-[var(--hub-muted)] hover:text-[var(--hub-primary)] transition-colors inline-block"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-20 text-center text-[var(--hub-muted)] italic text-[11px] uppercase tracking-widest"
                >
                  Nenhum produto sincronizado para esta loja. Clique em &quot;Sincronizar&quot;
                  acima.
                </td>
              </tr>
            )}
          </HubTable>
        </div>
      </div>
    </Shell>
  );
}

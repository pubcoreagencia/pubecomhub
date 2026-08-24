import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { HubTable } from "@/components/ui-b";
import { Link } from "@tanstack/react-router";
import {
  Plus,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  Store as StoreIcon,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogApi } from "@/lib/api/catalog";
import { Store } from "@/lib/api/types";
import { toast } from "sonner";

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [syncingStoreId, setSyncingStoreId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storeUrl, setStoreUrl] = useState("");
  const [storeName, setStoreName] = useState("");
  const [syncLimit, setSyncLimit] = useState<1 | 10 | 50 | 100>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStores = async () => {
    try {
      const data = await catalogApi.getStores();
      setStores(data);
    } catch (e: any) {
      console.error(e);
      if (e.status === 401 || e.isAuthError) {
        toast.error(
          e.message || "Usuário não autenticado. Faça login no Supabase para acessar o catálogo.",
        );
      } else {
        toast.error(e.message || "Falha ao carregar lojas");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeUrl.trim()) {
      toast.error("Informe a URL pública da loja Shopee.");
      return;
    }

    setIsSubmitting(true);
    toast.info("Descobrindo e cadastrando loja...");

    try {
      const res = await catalogApi.createStore(storeUrl.trim(), storeName.trim() || undefined);
      if (res.success) {
        toast.success(res.message || "Loja cadastrada com sucesso!");
        setIsModalOpen(false);
        setStoreUrl("");
        setStoreName("");
        await fetchStores();

        // Opcional: Pergunta se deseja sincronizar agora
        const shouldSync = confirm(
          `Loja cadastrada! Deseja iniciar a primeira sincronização agora com limite de ${syncLimit} produtos?`,
        );
        if (shouldSync) {
          handleSyncStore(res.store.id, syncLimit);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Falha ao cadastrar loja.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSyncStore = async (storeId: string, limit: 1 | 10 | 50 | 100 = 10) => {
    if (syncingStoreId) return;

    setSyncingStoreId(storeId);
    toast.info(`Iniciando sincronização (limite: ${limit} produtos)...`);

    try {
      const res = await catalogApi.refreshStore(storeId, limit);
      if (res.success) {
        toast.success(
          `Sincronização concluída! ${res.results?.created || 0} criados, ${res.results?.updated || 0} atualizados.`,
        );
        await fetchStores();
      }
    } catch (err: any) {
      if (err.status === 409) {
        toast.warning("Sincronização já em andamento no servidor para esta loja.");
      } else {
        toast.error(`Erro ao sincronizar: ${err.message || String(err)}`);
      }
    } finally {
      setSyncingStoreId(null);
    }
  };

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shopId.includes(searchTerm),
  );

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-black/40 px-4 py-2 rounded border border-[var(--hub-border)] flex items-center gap-3 w-80">
              <Search className="h-4 w-4 text-[var(--hub-muted)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar lojas por nome, usuário ou ID..."
                className="bg-transparent border-none text-[11px] text-white focus:outline-none w-full"
              />
            </div>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-9 bg-[var(--hub-primary)] hover:bg-[var(--hub-primary)]/80 text-[var(--hub-primary-foreground)] text-[10px] font-black uppercase tracking-wider px-6"
          >
            <Plus className="h-4 w-4 mr-2" /> Adicionar Loja Shopee
          </Button>
        </div>

        {loading ? (
          <div className="text-white text-center py-10 flex items-center justify-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-[var(--hub-primary)]" />
            <span>Carregando lojas cadastradas...</span>
          </div>
        ) : (
          <HubTable
            headers={["Status", "Loja", "Username", "Source", "Produtos", "Sync State", "Ações"]}
          >
            {filteredStores.map((loja) => (
              <tr key={loja.id} className="hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <span
                    className={`px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase ${
                      loja.status === "active"
                        ? "bg-[var(--hub-primary)]/20 text-[var(--hub-primary)]"
                        : "bg-slate-500/20 text-slate-400"
                    }`}
                  >
                    {loja.status}
                  </span>
                </td>
                <td className="px-5 py-4 font-bold text-white">
                  <div className="flex items-center gap-2">
                    <StoreIcon className="h-4 w-4 text-[var(--hub-muted)]" />
                    <span>{loja.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-[var(--hub-muted)] font-mono text-[11px]">
                  {loja.username || "-"}
                </td>
                <td className="px-5 py-4 text-white uppercase text-[10px] font-bold">
                  {loja.source}
                </td>
                <td className="px-5 py-4 font-black text-white">{loja.productCount}</td>
                <td className="px-5 py-4 text-[var(--hub-muted)]">
                  <div className="flex items-center gap-2">
                    {loja.syncState === "success" && (
                      <CheckCircle className="h-3 w-3 text-emerald-400" />
                    )}
                    {loja.syncState === "failed" && (
                      <AlertCircle className="h-3 w-3 text-red-500" />
                    )}
                    {loja.syncState === "running" && (
                      <RefreshCw className="h-3 w-3 text-blue-500 animate-spin" />
                    )}
                    <span className="text-[10px] uppercase font-bold">{loja.syncState}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={syncingStoreId === loja.id || loja.status !== "active"}
                    onClick={() => handleSyncStore(loja.id, 10)}
                    className="h-8 text-[9px] font-bold uppercase tracking-wider text-[var(--hub-muted)] hover:text-white border border-[var(--hub-border)]"
                  >
                    {syncingStoreId === loja.id ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1 text-[var(--hub-primary)]" /> Sync (10)
                      </>
                    )}
                  </Button>

                  <Link
                    to="/dashboard/stores/$storeId"
                    params={{ storeId: loja.id }}
                    className="text-[var(--hub-primary)] hover:bg-[var(--hub-primary)]/10 text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-lg transition-colors border border-[var(--hub-primary)]/20 inline-block"
                  >
                    Gerenciar
                  </Link>
                </td>
              </tr>
            ))}

            {filteredStores.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-[var(--hub-muted)] text-[11px] uppercase tracking-widest"
                >
                  Nenhuma loja encontrada. Adicione uma loja Shopee para iniciar.
                </td>
              </tr>
            )}
          </HubTable>
        )}

        {/* Modal: Adicionar Loja */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#121214] border border-[var(--hub-border)] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between p-6 border-b border-[var(--hub-border)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--hub-primary)]/10 text-[var(--hub-primary)]">
                    <StoreIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white italic">Adicionar Loja Shopee</h2>
                    <p className="text-[10px] text-[var(--hub-muted)] uppercase tracking-wider">
                      Cadastro e Descoberta de ShopID
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !isSubmitting && setIsModalOpen(false)}
                  className="text-[var(--hub-muted)] hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateStore} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--hub-muted)] mb-2">
                    URL da Loja Shopee *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://shopee.com.br/zenttababuche"
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    className="w-full bg-black/40 border border-[var(--hub-border)] rounded-lg px-4 py-3 text-xs text-white placeholder-[var(--hub-muted)] focus:outline-none focus:border-[var(--hub-primary)]"
                  />
                  <p className="text-[9px] text-[var(--hub-muted)] mt-1">
                    Exemplo: https://shopee.com.br/nome_da_loja
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--hub-muted)] mb-2">
                    Nome de Exibição (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Zentta Babuche Oficial"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-black/40 border border-[var(--hub-border)] rounded-lg px-4 py-3 text-xs text-white placeholder-[var(--hub-muted)] focus:outline-none focus:border-[var(--hub-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--hub-muted)] mb-2">
                    Limite da Sincronização Inicial
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 10, 50, 100].map((lim) => (
                      <button
                        key={lim}
                        type="button"
                        onClick={() => setSyncLimit(lim as any)}
                        className={`py-2 text-[10px] font-black uppercase rounded-lg border transition-all ${
                          syncLimit === lim
                            ? "bg-[var(--hub-primary)] border-[var(--hub-primary)] text-black"
                            : "bg-black/40 border-[var(--hub-border)] text-white hover:border-white/30"
                        }`}
                      >
                        {lim} {lim === 1 ? "Item" : "Itens"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--hub-border)]">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isSubmitting}
                    onClick={() => setIsModalOpen(false)}
                    className="text-xs text-[var(--hub-muted)] hover:text-white"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[var(--hub-primary)] hover:bg-[var(--hub-primary)]/80 text-[var(--hub-primary-foreground)] text-xs font-black uppercase tracking-wider px-6 h-10"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Conectando...
                      </>
                    ) : (
                      "Cadastrar Loja"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

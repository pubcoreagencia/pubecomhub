import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Package,
  RefreshCw,
  Clock,
  Globe,
  Info,
  History,
  Database
} from 'lucide-react';
import { Shell } from '@/components/layout/Shell';
import { toast } from 'sonner';

type IngestionStatus = 'idle' | 'running' | 'success' | 'error';

interface IngestionResult {
  productsFound: number;
  created: number;
  updated: number;
  unchanged: number;
  failed: number;
  provider: string;
  duration: number;
  syncRunId: string;
}

export const CatalogIngestion = () => {
  const [url, setUrl] = useState('');
  const [limit, setLimit] = useState(30);
  const [status, setStatus] = useState<IngestionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<IngestionResult | null>(null);
  const [history, setHistory] = useState<IngestionResult[]>([]);

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setStatus('running');
    setErrorMessage(null);
    setResult(null);

    try {
      const apiUrl = import.meta.env['VITE_CATALOG_API_URL'] || 'https://pub-ecom-catalog-worker.contato-pubcore.workers.dev';
      const response = await fetch(`${apiUrl}/ingestion/shopee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env['VITE_CATALOG_API_TOKEN'] || ''}`
        },
        body: JSON.stringify({ url, limit })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP ${response.status}`);
      }

      setResult(data.results);
      setHistory(prev => [data.results, ...prev.slice(0, 4)]);
      setStatus('success');
      toast.success('Ingestão concluída com sucesso!');
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'Erro inesperado na ingestão');
      setStatus('error');
      toast.error('Falha na ingestão');
    }
  };

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Ingestion Engine</h1>
          <p className="text-[var(--hub-muted)] text-[9px] font-bold uppercase tracking-[0.3em]">
            Motor Operacional de Descoberta e Ingestão de Catálogos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-black/40 border-[var(--hub-border)]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-sm uppercase tracking-widest font-black">
                <RefreshCw className={status === 'running' ? 'animate-spin text-[var(--hub-primary)]' : 'text-[var(--hub-primary)]'} />
                Executar Nova Ingestão
              </CardTitle>
              <CardDescription className="text-[var(--hub-muted)] text-[10px] uppercase font-bold tracking-wider">
                Informe a URL da loja Shopee para sincronizar produtos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleIngest} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--hub-muted)] uppercase tracking-widest italic">URL da Loja Shopee</label>
                      <Input
                        placeholder="https://shopee.com.br/username-ou-id"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-black/60 border-[var(--hub-border)] text-white focus:border-[var(--hub-primary)] h-12"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--hub-muted)] uppercase tracking-widest italic">Username (Opcional)</label>
                      <Input placeholder="ex: zentta_babuche" className="bg-black/60 border-[var(--hub-border)] text-white h-10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--hub-muted)] uppercase tracking-widest italic">Shop ID (Opcional)</label>
                      <Input placeholder="ex: 1729928484" className="bg-black/60 border-[var(--hub-border)] text-white h-10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--hub-muted)] uppercase tracking-widest italic">Limite de Produtos</label>
                      <Input 
                        type="number" 
                        value={limit} 
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="bg-black/60 border-[var(--hub-border)] text-white h-10" 
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={status === 'running' || !url}
                  className="w-full h-12 hub-bg-primary text-black font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-[var(--hub-primary)]/10"
                >
                  {status === 'running' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando Ingestão...
                    </>
                  ) : (
                    <>
                      Executar Ingestão Real
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-black/40 border-[var(--hub-border)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-xs uppercase font-black tracking-widest flex items-center gap-2">
                  <Database className="w-4 h-4 text-[var(--hub-primary)]" />
                  Estado da Operação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[var(--hub-border)]/30">
                  <span className="text-[10px] font-bold text-[var(--hub-muted)] uppercase">Status</span>
                  <Badge className={status === 'running' ? 'bg-blue-500/20 text-blue-400' : status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
                    {status.toUpperCase()}
                  </Badge>
                </div>
                {result && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-[var(--hub-border)]/30">
                      <span className="text-[10px] font-bold text-[var(--hub-muted)] uppercase">Produtos Encontrados</span>
                      <span className="text-sm font-black text-white">{result.productsFound}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[var(--hub-border)]/30">
                      <span className="text-[10px] font-bold text-[var(--hub-muted)] uppercase">Novos Criados</span>
                      <span className="text-sm font-black text-emerald-400">{result.created}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[var(--hub-border)]/30">
                      <span className="text-[10px] font-bold text-[var(--hub-muted)] uppercase">Atualizados</span>
                      <span className="text-sm font-black text-blue-400">{result.updated}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[var(--hub-border)]/30">
                      <span className="text-[10px] font-bold text-[var(--hub-muted)] uppercase">Falhas</span>
                      <span className="text-sm font-black text-red-400">{result.failed}</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-[9px] text-[var(--hub-muted)] font-mono truncate">ID: {result.syncRunId}</p>
                    </div>
                  </>
                )}
                {errorMessage && (
                  <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg text-[10px] text-red-400 font-bold flex gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorMessage}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-[var(--hub-border)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-xs uppercase font-black tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4 text-[var(--hub-primary)]" />
                  Histórico Recente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {history.length === 0 ? (
                  <p className="text-[10px] text-[var(--hub-muted)] italic">Nenhuma execução registrada</p>
                ) : (
                  history.map((h, i) => (
                    <div key={i} className="text-[10px] border-l-2 border-[var(--hub-primary)] pl-3 py-1 bg-white/5 rounded-r-lg">
                      <div className="font-black text-white">{h.productsFound} PRODUTOS · {h.provider}</div>
                      <div className="text-[8px] text-[var(--hub-muted)] uppercase">{h.syncRunId.split('-')[0]}... · {(h.duration / 1000).toFixed(1)}s</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
};

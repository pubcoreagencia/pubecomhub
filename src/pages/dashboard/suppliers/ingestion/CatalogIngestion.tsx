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
  Trash2,
  ChevronRight,
  RefreshCw,
  Clock,
  Database,
  Globe,
  Info
} from 'lucide-react';
import { useServerFn } from '@tanstack/react-start';
import { analyzeCatalogFn, importProductsFn } from '@/lib/catalog.functions';
import { ImportPreview, NormalizedProduct } from '@/lib/ingestion/types';
import { toast } from 'sonner';

type IngestionStatus = 'idle' | 'analyzing' | 'preview' | 'error' | 'importing' | 'completed';

export const CatalogIngestion = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<IngestionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);

  const analyzeFn = useServerFn(analyzeCatalogFn);
  const importFn = useServerFn(importProductsFn);

  const steps = [
    "Validando URL",
    "Identificando fonte",
    "Descobrindo loja",
    "Buscando produtos",
    "Preparando preview"
  ];

  // Auto-advance progress steps during analyzing
  useEffect(() => {
    let interval: any;
    if (status === 'analyzing') {
      setCurrentStep(0);
      interval = setInterval(() => {
        setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Clean URL: remove fragments like #product_list
    const cleanUrl = url.split('#')[0].trim();
    
    setStatus('analyzing');
    setErrorMessage(null);
    setPreview(null);
    
    try {
      const result = await analyzeFn({ data: { url: cleanUrl } });
      
      // Check if there are critical errors in metadata (like 403)
      if (result.metadata?.errors && result.metadata.errors.length > 0) {
        // If we found 0 items and have errors, it's an error state
        if (result.items.length === 0) {
          setErrorMessage(result.metadata.errors.join('. '));
          setStatus('error');
          return;
        }
      }

      setPreview(result);
      setSelectedItems(new Set(result.items.map(item => item.externalId)));
      setStatus('preview');
      toast.success('Catálogo analisado com sucesso!');
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'Erro inesperado ao analisar o catálogo');
      setStatus('error');
      toast.error('Falha na análise');
    }
  };

  const handleToggleItem = (externalId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(externalId)) {
      newSelected.delete(externalId);
    } else {
      newSelected.add(externalId);
    }
    setSelectedItems(newSelected);
  };

  const handleImport = async () => {
    if (!preview) return;
    
    const itemsToImport = preview?.items?.filter(item => selectedItems.has(item.externalId)) || [];
    if (itemsToImport.length === 0) {
      toast.error('Selecione ao menos um produto para importar');
      return;
    }

    setStatus('importing');
    try {
      await importFn({ 
        data: {
          items: itemsToImport, 
          supplierId: 'shopee-default'
        }
      });
      setStatus('completed');
      toast.success(`${itemsToImport.length} produtos importados para o Catálogo Master!`);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'Erro durante a importação');
      setStatus('error');
    }
  };

  const reset = () => {
    setUrl('');
    setStatus('idle');
    setPreview(null);
    setErrorMessage(null);
    setSelectedItems(new Set());
    setCurrentStep(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-50">Catalog Ingestion Engine</h1>
        <p className="text-emerald-50/60 text-sm">
          Infraestrutura operacional para descoberta e sincronização de catálogos externos.
        </p>
      </div>

      {status === 'idle' && (
        <Card className="bg-emerald-950/20 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-emerald-50 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-400" />
              Importar catálogo
            </CardTitle>
            <CardDescription className="text-emerald-50/60">
              Transforme URLs de fornecedores em produtos normalizados no Catálogo Master.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-emerald-50/50 uppercase tracking-wider">URL da loja ou fonte</label>
                <div className="flex gap-3">
                  <Input
                    placeholder="https://shopee.com.br/9r18ht6m88"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-emerald-900/20 border-emerald-500/20 text-emerald-50 focus:border-emerald-500/50"
                  />
                  <Button 
                    type="submit" 
                    disabled={!url}
                    className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold shrink-0"
                  >
                    Analisar catálogo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-emerald-900/10 border border-emerald-500/10 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <Globe className="w-4 h-4" />
                  Fontes Suportadas
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">Shopee BR</Badge>
                  <Badge variant="outline" className="opacity-40 border-emerald-500/20 text-emerald-50">Mercado Livre (Breve)</Badge>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-emerald-900/10 border border-emerald-500/10 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <Info className="w-4 h-4" />
                  Exemplo de URL
                </div>
                <code className="text-[10px] text-emerald-50/40 block bg-black/20 p-2 rounded truncate">
                  https://shopee.com.br/9r18ht6m88#product_list
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {status === 'analyzing' && (
        <Card className="bg-emerald-950/20 border-emerald-500/20 p-12">
          <div className="flex flex-col items-center justify-center space-y-8 max-w-md mx-auto">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-emerald-50">Analisando catálogo...</h2>
              <p className="text-emerald-50/40 text-sm">Isso pode levar alguns segundos dependendo da fonte.</p>
            </div>

            <div className="w-full space-y-4">
              {steps.map((step, idx) => (
                <div key={step} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${idx <= currentStep ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-emerald-900'}`} />
                  <span className={`text-sm ${idx === currentStep ? 'text-emerald-50 font-medium' : idx < currentStep ? 'text-emerald-50/60' : 'text-emerald-50/20'}`}>
                    {step}
                  </span>
                  {idx === currentStep && <Loader2 className="w-3 h-3 text-emerald-400 animate-spin ml-auto" />}
                  {idx < currentStep && <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-auto" />}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {status === 'error' && (
        <Card className="bg-red-950/20 border-red-500/20 p-12">
          <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-red-400">Falha na Ingestão</h2>
              <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-lg text-sm text-red-200/80 font-mono text-left w-full">
                {errorMessage || "Erro desconhecido durante a análise da fonte."}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={reset} className="border-red-500/20 text-red-200 hover:bg-red-500/10">
                Tentar novamente
              </Button>
            </div>
            <p className="text-[10px] text-red-200/40">
              Possíveis causas: HTTP 403 (Scraping Blocked), Timeout, Loja Inexistente ou URL Malformada.
            </p>
          </div>
        </Card>
      )}

      {(status === 'preview' || status === 'importing') && preview && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-emerald-950/20 border-emerald-500/20">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-50/40 uppercase tracking-widest">Produtos</p>
                    <h3 className="text-2xl font-bold text-emerald-50">{preview.totalFound}</h3>
                  </div>
                  <Package className="w-5 h-5 text-emerald-500/40" />
                </div>
                <div className="mt-2 text-[10px] text-emerald-400 font-mono">
                  {preview.metadata?.shopId ? `ShopID: ${preview.metadata.shopId}` : 'Fonte: Shopee'}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-emerald-950/20 border-emerald-500/20">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-50/40 uppercase tracking-widest">Novos</p>
                    <h3 className="text-2xl font-bold text-emerald-50 text-emerald-400">{preview.newItems}</h3>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500/40" />
                </div>
                <div className="mt-2 text-[10px] text-emerald-50/40 italic">
                  {preview.duplicates} já existentes
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-950/20 border-emerald-500/20">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-50/40 uppercase tracking-widest">Seleção</p>
                    <h3 className="text-2xl font-bold text-emerald-50">{selectedItems.size}</h3>
                  </div>
                  <Database className="w-5 h-5 text-emerald-500/40" />
                </div>
                <div className="mt-2 text-[10px] text-emerald-50/40">
                  Prontos para Master
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-950/20 border-emerald-500/20">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-50/40 uppercase tracking-widest">Execução</p>
                    <h3 className="text-2xl font-bold text-emerald-50">
                      {preview.metadata?.executionTime ? `${(preview.metadata.executionTime / 1000).toFixed(1)}s` : '-'}
                    </h3>
                  </div>
                  <Clock className="w-5 h-5 text-emerald-500/40" />
                </div>
                <div className="mt-2 text-[10px] text-emerald-50/40">
                  Tempo de resposta
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-emerald-950/20 border-emerald-500/20 overflow-hidden">
            <div className="p-4 border-b border-emerald-500/20 flex justify-between items-center bg-emerald-900/10">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-50 uppercase tracking-widest">
                Preview de Importação
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={reset}
                  className="border-emerald-500/20 text-emerald-50/60 hover:text-emerald-50 hover:bg-emerald-500/5 h-8"
                  disabled={status === 'importing'}
                >
                  Cancelar
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleImport}
                  disabled={status === 'importing' || selectedItems.size === 0}
                  className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold h-8 px-6"
                >
                  {status === 'importing' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin mr-2" />
                      Importando...
                    </>
                  ) : (
                    `Importar ${selectedItems.size} Itens`
                  )}
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-emerald-500/10 bg-emerald-900/5">
                    <th className="p-4 w-10">
                      <input 
                        type="checkbox" 
                        className="rounded border-emerald-500/20 bg-emerald-950/50 accent-emerald-500"
                        checked={selectedItems.size === preview.items.length && preview.items.length > 0}
                        onChange={() => {
                          if (selectedItems.size === preview.items.length) {
                            setSelectedItems(new Set());
                          } else {
                            setSelectedItems(new Set(preview.items.map(i => i.externalId)));
                          }
                        }}
                      />
                    </th>
                    <th className="p-4 text-[10px] font-bold text-emerald-50/40 uppercase tracking-widest">Produto</th>
                    <th className="p-4 text-[10px] font-bold text-emerald-50/40 uppercase tracking-widest">SKU / ID</th>
                    <th className="p-4 text-[10px] font-bold text-emerald-50/40 uppercase tracking-widest">Custo Forn.</th>
                    <th className="p-4 text-[10px] font-bold text-emerald-50/40 uppercase tracking-widest">Preço Base PUB</th>
                    <th className="p-4 text-[10px] font-bold text-emerald-50/40 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/5">
                  {preview.items.map((item) => (
                    <tr 
                      key={item.externalId} 
                      className={`transition-colors hover:bg-emerald-500/5 ${!selectedItems.has(item.externalId) ? 'opacity-30' : ''}`}
                    >
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.has(item.externalId)}
                          onChange={() => handleToggleItem(item.externalId)}
                          className="rounded border-emerald-500/20 bg-emerald-950/50 accent-emerald-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-emerald-900/40 border border-emerald-500/10 overflow-hidden flex-shrink-0">
                            {item.images[0] ? (
                              <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-full h-full p-2 text-emerald-50/20" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-emerald-50 line-clamp-1">{item.title}</div>
                            <div className="text-[10px] text-emerald-50/30 flex items-center gap-1">
                              {item.sourceUrl.includes('shopee') ? 'Shopee' : 'Mock'}
                              <ChevronRight className="w-2 h-2" />
                              {item.category || 'Sem categoria'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[10px] text-emerald-50/40">
                        {item.sku}
                      </td>
                      <td className="p-4 text-sm text-emerald-50">
                        R$ {item.supplierCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-sm font-semibold text-emerald-400">
                        R$ {item.basePricePub.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4">
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[10px] h-4">Novo</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {status === 'completed' && (
        <Card className="bg-emerald-950/20 border-emerald-500/20 p-16 flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center relative">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            <div className="absolute inset-0 rounded-full border border-emerald-400/20 animate-ping" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-emerald-50">Importação Concluída!</h2>
            <p className="text-emerald-50/60 max-w-md">
              Os produtos selecionados foram persistidos no Master Catalog e estão prontos para distribuição.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={reset} className="border-emerald-500/20 text-emerald-50 hover:bg-emerald-500/5">
              Nova Importação
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-8">
              Ver Master Catalog
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
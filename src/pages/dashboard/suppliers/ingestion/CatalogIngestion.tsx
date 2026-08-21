import React, { useState } from 'react';
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
  ExternalLink,
  Package,
  ShoppingCart,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { useServerFn } from '@tanstack/react-start';
import { analyzeCatalogFn, importProductsFn } from '@/lib/catalog.functions';
import { ImportPreview, NormalizedProduct } from '@/lib/ingestion/types';
import { toast } from 'sonner';

export const CatalogIngestion = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'preview' | 'importing' | 'completed'>('idle');
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const analyzeFn = useServerFn(analyzeCatalogFn);
  const importFn = useServerFn(importProductsFn);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setStatus('analyzing');
    try {
      const result = await analyzeFn({ data: { url } });
      setPreview(result);
      setSelectedItems(new Set(result.items.map(item => item.externalId)));
      setStatus('preview');
      toast.success('Catálogo analisado com sucesso!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Erro ao analisar o catálogo');
      setStatus('idle');
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
    
    const itemsToImport = preview.items.filter(item => selectedItems.has(item.externalId));
    if (itemsToImport.length === 0) {
      toast.error('Selecione ao menos um produto para importar');
      return;
    }

    setStatus('importing');
    try {
      await importFn({ 
        data: {
          items: itemsToImport, 
          supplierId: 'default-supplier-id' // Em produção, viria da seleção do fornecedor
        }
      });
      setStatus('completed');
      toast.success(`${itemsToImport.length} produtos importados com sucesso!`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Erro durante a importação');
      setStatus('preview');
    }
  };

  const reset = () => {
    setUrl('');
    setStatus('idle');
    setPreview(null);
    setSelectedItems(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-50">Catalog Ingestion Engine</h1>
        <p className="text-emerald-50/60 text-sm">
          Importe catálogos de fornecedores automaticamente a partir de URLs (Shopee, Mercado Livre, etc).
        </p>
      </div>

      {status === 'idle' || status === 'analyzing' ? (
        <Card className="bg-emerald-950/20 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-emerald-50 flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              Analisar Nova Fonte
            </CardTitle>
            <CardDescription className="text-emerald-50/60">
              Insira a URL da loja ou do catálogo do fornecedor para começar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAnalyze} className="flex gap-3">
              <Input
                placeholder="https://shopee.com.br/loja-exemplo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-emerald-900/20 border-emerald-500/20 text-emerald-50 focus:border-emerald-500/50"
                disabled={status === 'analyzing'}
              />
              <Button 
                type="submit" 
                disabled={status === 'analyzing' || !url}
                className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold"
              >
                {status === 'analyzing' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    Analisar Catálogo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
            <div className="mt-4 flex gap-4 text-xs text-emerald-50/40">
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 px-1 py-0">Shopee</Badge>
                <span>Suportado</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-50">
                <Badge variant="outline" className="border-white/10 text-white/40 px-1 py-0">ML</Badge>
                <span>Em breve</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : status === 'preview' || status === 'importing' ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-emerald-950/20 border-emerald-500/20">
              <CardHeader className="pb-2">
                <CardDescription className="text-emerald-50/40 text-xs uppercase font-bold">Total Encontrado</CardDescription>
                <CardTitle className="text-2xl text-emerald-50">{preview?.totalFound}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-emerald-950/20 border-emerald-500/20">
              <CardHeader className="pb-2">
                <CardDescription className="text-emerald-50/40 text-xs uppercase font-bold">Selecionados</CardDescription>
                <CardTitle className="text-2xl text-emerald-400">{selectedItems.size}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-emerald-950/20 border-emerald-500/20">
              <CardHeader className="pb-2">
                <CardDescription className="text-emerald-50/40 text-xs uppercase font-bold">Novos</CardDescription>
                <CardTitle className="text-2xl text-emerald-50">{preview?.newItems}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-emerald-950/20 border-emerald-500/20">
              <CardHeader className="pb-2">
                <CardDescription className="text-emerald-50/40 text-xs uppercase font-bold">Custo Total Est.</CardDescription>
                <CardTitle className="text-2xl text-emerald-50">
                  R$ {preview?.items
                    .filter(i => selectedItems.has(i.externalId))
                    .reduce((acc, curr) => acc + curr.supplierCost, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="bg-emerald-950/20 border-emerald-500/20 overflow-hidden">
            <div className="p-4 border-b border-emerald-500/20 flex justify-between items-center bg-emerald-900/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400 w-5 h-5" />
                <h3 className="font-semibold text-emerald-50">Preview de Importação</h3>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={reset}
                  className="border-emerald-500/20 text-emerald-50/60 hover:text-emerald-50"
                  disabled={status === 'importing'}
                >
                  Cancelar
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleImport}
                  disabled={status === 'importing' || selectedItems.size === 0}
                  className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold"
                >
                  {status === 'importing' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
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
                        className="rounded border-emerald-500/20 bg-emerald-950/50"
                        checked={selectedItems.size === preview?.items.length}
                        onChange={() => {
                          if (selectedItems.size === preview?.items.length) {
                            setSelectedItems(new Set());
                          } else {
                            setSelectedItems(new Set(preview?.items.map(i => i.externalId)));
                          }
                        }}
                      />
                    </th>
                    <th className="p-4 text-xs font-bold text-emerald-50/40 uppercase">Produto</th>
                    <th className="p-4 text-xs font-bold text-emerald-50/40 uppercase">SKU / ID</th>
                    <th className="p-4 text-xs font-bold text-emerald-50/40 uppercase">Custo Forn.</th>
                    <th className="p-4 text-xs font-bold text-emerald-50/40 uppercase">Preço Base PUB</th>
                    <th className="p-4 text-xs font-bold text-emerald-50/40 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview?.items.map((item) => (
                    <tr 
                      key={item.externalId} 
                      className={`border-b border-emerald-500/5 transition-colors hover:bg-emerald-500/5 ${!selectedItems.has(item.externalId) ? 'opacity-50' : ''}`}
                    >
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.has(item.externalId)}
                          onChange={() => handleToggleItem(item.externalId)}
                          className="rounded border-emerald-500/20 bg-emerald-950/50"
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
                      <td className="p-4 font-mono text-xs text-emerald-50/40">
                        {item.sku}
                      </td>
                      <td className="p-4 text-sm text-emerald-50">
                        R$ {item.supplierCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-sm font-semibold text-emerald-400">
                        R$ {item.basePricePub.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4">
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[10px]">Novo</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="bg-emerald-950/20 border-emerald-500/20 p-12 flex flex-col items-center text-center space-y-4 animate-in zoom-in duration-500">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-emerald-50">Importação Concluída!</h2>
            <p className="text-emerald-50/60 max-w-md">
              Os produtos foram adicionados ao Master Catalog e agora estão prontos para serem distribuídos para as lojas.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={reset} className="border-emerald-500/20 text-emerald-50">
              Nova Importação
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold">
              Ver Master Catalog
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

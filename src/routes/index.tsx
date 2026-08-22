import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Database, Globe, Search, ShoppingBag, RefreshCw, AlertCircle, CheckCircle2, LayoutDashboard, Store, Package, Activity, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-[#020817] text-emerald-50/90 p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto space-y-8 text-left">
        {/* Header */}
        <div className="space-y-4 border-b border-emerald-500/20 pb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              PUB ECOM Master Catalog
            </h1>
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/5 px-3 py-1 text-sm font-medium">
              Frontend Operacional
            </Badge>
          </div>
          <p className="text-emerald-50/70 text-lg max-w-3xl leading-relaxed">
            Quero transformar o projeto existente no Lovable em um <strong>frontend operacional funcional do PUB ECOM Master Catalog</strong>, usando o backend já implementado no repositório oficial.
          </p>
        </div>

        {/* Backend Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-emerald-400 text-lg">Repositório Oficial</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <a 
                href="https://github.com/pubcoreagencia/pub-ecom-catalog-worker" 
                target="_blank" 
                className="text-sm hover:text-emerald-300 transition-colors underline decoration-emerald-500/30 underline-offset-4 flex items-center gap-2"
              >
                pubcoreagencia/pub-ecom-catalog-worker <ExternalLink className="w-3 h-3" />
              </a>
            </CardContent>
          </Card>

          <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-emerald-400 text-lg">Backend em Produção</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-emerald-500/60 mb-1 uppercase tracking-wider font-semibold">Base URL</p>
              <code className="text-emerald-300/90 text-sm break-all">
                https://pub-ecom-catalog-worker.contato-pubcore.workers.dev
              </code>
            </CardContent>
          </Card>
        </div>

        {/* Constraints Card */}
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "NÃO recrie o backend",
                "NÃO crie scraping próprio",
                "NÃO implemente Playwright",
                "NÃO implemente Apify",
                "NÃO crie outro banco",
                "NÃO substitua a arquitetura"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-red-400/80 text-xs font-semibold uppercase tracking-wider">
                  <AlertCircle className="w-3 h-3" /> {text}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Objective Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" /> OBJETIVO
          </h2>
          <p className="text-emerald-50/70">
            Quero conseguir abrir o <strong>Preview do Lovable</strong> e realizar meu primeiro teste visual real do Master Catalog. A aplicação deve funcionar como um painel administrativo/operacional do catálogo, permitindo:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: LayoutDashboard, text: "Visualizar estatísticas gerais" },
              { icon: Store, text: "Visualizar lojas cadastradas" },
              { icon: Search, text: "Pesquisar e filtrar produtos" },
              { icon: ShoppingBag, text: "Visualizar detalhes de um produto" },
              { icon: RefreshCw, text: "Disparar manualmente um refresh" },
              { icon: Activity, text: "Acompanhar sincronização" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[#0a0f1d] border border-emerald-500/10">
                <item.icon className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-emerald-50/80 leading-snug">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* API Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2 pt-4">
            <Terminal className="w-6 h-6" /> API OFICIAL DISPONÍVEL
          </h2>
          
          <div className="space-y-4">
            <Card className="bg-[#0a0f1d] border-emerald-500/20">
              <CardHeader className="py-3 px-6 border-b border-emerald-500/10">
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-none px-2 py-0">GET</Badge>
                  <code className="text-emerald-400 font-mono text-sm">/v1/catalog/stats</code>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <pre className="p-4 text-[10px] md:text-xs text-emerald-300/70 overflow-x-auto whitespace-pre leading-relaxed">
{`{
  "success": true,
  "stats": {
    "products": 10,
    "stores": 1,
    "activeStores": 1,
    "errorStores": 0,
    "sources": { "shopee": { "products": 10, "stores": 1 } },
    "sync": { "idle": 0, "running": 0, "success": 1, "partial": 0, "error": 0 }
  }
}`}
                </pre>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0a0f1d] border border-emerald-500/10 space-y-2">
                <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">Lojas (Stores)</p>
                <ul className="space-y-1.5 text-xs text-emerald-50/60 font-mono">
                  <li>GET /v1/catalog/stores</li>
                  <li>GET /v1/catalog/stores/:id</li>
                  <li>POST /v1/catalog/stores/:id/refresh</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-[#0a0f1d] border border-emerald-500/10 space-y-2">
                <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">Produtos (Products)</p>
                <ul className="space-y-1.5 text-xs text-emerald-50/60 font-mono">
                  <li>GET /v1/catalog/products</li>
                  <li>GET /v1/catalog/products/:id</li>
                  <li>GET /v1/catalog/stores/:id/products</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Section */}
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> AUTENTICAÇÃO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-emerald-50/70">
              Todas as rotas exigem <code>Authorization: Bearer {'<CATALOG_WORKER_TOKEN>'}</code>.
              NÃO exponha segredos no código. Use variáveis de ambiente:
            </p>
            <div className="bg-[#0a0f1d] p-4 rounded-lg font-mono text-sm text-emerald-400/80">
              VITE_CATALOG_API_URL<br />
              VITE_CATALOG_API_TOKEN
            </div>
          </CardContent>
        </Card>

        {/* Test Case Alert */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <ShoppingBag className="w-6 h-6" />
            <h3 className="text-xl font-bold uppercase tracking-widest">Primeiro Teste Operacional</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-2 text-sm text-emerald-50/80">
              <p><strong>Loja de Teste:</strong> Zentta Babuche</p>
              <p><strong>ShopID:</strong> 1729928484</p>
              <p><strong>Username:</strong> 9r18ht6m88</p>
            </div>
            <div className="bg-[#020817] p-4 rounded-xl border border-emerald-500/20 text-xs font-mono text-emerald-500/80 leading-relaxed">
              Dashboard → Stores → Zentta Babuche → Refresh → Confirmar Sincronização Real
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 pb-12">
          <Button 
            variant="outline" 
            className="flex-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 py-6 text-lg font-semibold rounded-xl"
            onClick={() => window.open('https://github.com/pubcoreagencia/pub-ecom-catalog-worker', '_blank')}
          >
            Ver Backend Repo
          </Button>
          <Button 
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-6 text-lg font-semibold rounded-xl shadow-lg shadow-emerald-500/20"
            onClick={() => window.open('/dashboard', '_self')}
          >
            Acessar Painel Operacional
          </Button>
        </div>
      </div>
    </div>
  );
}
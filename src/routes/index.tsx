import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Terminal, AlertCircle, CheckCircle2, Info, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-[#020817] text-emerald-50/90 p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4 border-b border-emerald-500/20 pb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              FASE 2F.8 — RESOLUÇÃO DE SHOPID POR LINKS DE PRODUTO
            </h1>
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/5 px-3 py-1 text-sm font-medium">
              OPERACIONAL
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-emerald-400/80">
            <ExternalLink className="w-4 h-4" />
            <a 
              href="https://github.com/pubcoreagencia/pub-ecom-catalog-worker" 
              target="_blank" 
              className="text-sm hover:text-emerald-300 transition-colors underline decoration-emerald-500/30 underline-offset-4"
            >
              pub-ecom-catalog-worker
            </a>
          </div>
        </div>

        {/* Status Alert */}
        <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-emerald-400">Status da Fase</CardTitle>
              <CardDescription className="text-emerald-500/60">Extração de ShopID via Product Link Regex</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0a0f1d] border border-emerald-500/10 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                  <Terminal className="w-4 h-4" /> Product Link Regex
                </div>
                <ul className="space-y-2 text-sm text-emerald-50/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Regex /i.(\d+).(\d+)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Extração do DOM Links
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Frequência de ShopID
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#0a0f1d] border border-emerald-500/10 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                  <Terminal className="w-4 h-4" /> Diagnóstico Avançado
                </div>
                <ul className="space-y-2 text-sm text-emerald-50/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Captura productLinkCount
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Captura productLinkShopIds
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Fallback API v4 instrumentado
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-lg flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-amber-200 font-semibold mb-1">Importante</p>
                <p className="text-amber-200/70">
                  O objetivo desta fase é implementar a resolução de ShopID através de links de produtos (<code className="bg-amber-500/10 px-1 rounded text-amber-300">/i.SHOPID.ITEMID</code>), garantindo que lojas amigáveis como a Zentta Babuche sejam resolvidas com sucesso.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Evidence */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-widest">Metadata de Diagnóstico</span>
          </div>
          <pre className="bg-[#0a0f1d] border border-emerald-500/20 p-6 rounded-xl overflow-x-auto text-xs text-emerald-400/80 leading-relaxed shadow-inner">
{`{
  "shopIdStrategy": "product-link",
  "productLinkCount": 42,
  "productLinkShopIds": ["1729928484"],
  "shopBaseStatus": 200,
  "shopBaseContentType": "application/json",
  "shopBaseResponseSize": 1234,
  "shopBaseKeys": ["data"],
  "shopBaseHasData": true,
  "shopBaseHasShopId": false,
  "fallbackGetStatus": 403,
  "fallbackGetResponseSize": 456,
  "fallbackGetKeys": [],
  "fallbackGetHasData": false,
  "fallbackGetHasShopId": false,
  "finalPageUrl": "https://shopee.com.br/...",
  "username": "9r18ht6m88"
}`}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button 
            variant="outline" 
            className="flex-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 py-6 text-lg font-semibold rounded-xl"
            onClick={() => window.open('https://github.com/pubcoreagencia/pub-ecom-catalog-worker', '_blank')}
          >
            Ver Repositório do Worker
          </Button>
          <Button 
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-6 text-lg font-semibold rounded-xl shadow-lg shadow-emerald-500/20"
            onClick={() => window.open('/dashboard/suppliers/ingestion', '_self')}
          >
            Acessar Ingestion Engine
          </Button>
        </div>

        <p className="text-center text-xs text-emerald-500/40 uppercase tracking-[0.2em]">
          debug: fix: resolve shopee shop id from product links
        </p>
      </div>
    </div>
  );
}

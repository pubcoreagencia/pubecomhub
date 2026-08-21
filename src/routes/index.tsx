import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Terminal, AlertCircle, CheckCircle2, Info, Activity, Gauge } from "lucide-react";
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
              FASE 2F.9 — DIAGNÓSTICO DE LIMITES DO CLOUDFLARE BROWSER RUN
            </h1>
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/5 px-3 py-1 text-sm font-medium">
              DEBUG MODE
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
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-emerald-400">Status do Diagnóstico</CardTitle>
              <CardDescription className="text-emerald-500/60">Cloudflare Browser Run Rate Limits (HTTP 429)</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0a0f1d] border border-emerald-500/10 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                  <Terminal className="w-4 h-4" /> Diagnóstico de Limites
                </div>
                <ul className="space-y-2 text-sm text-emerald-50/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    GET /debug/browser
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    playwright.limits()
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    playwright.sessions()
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#0a0f1d] border border-emerald-500/10 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                  <Terminal className="w-4 h-4" /> Segurança & Build
                </div>
                <ul className="space-y-2 text-sm text-emerald-50/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    CATALOG_WORKER_TOKEN Auth
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    npm run build (esbuild)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Health Check Preservado
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-lg flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-amber-200 font-semibold mb-1">Diagnóstico HTTP 429</p>
                <p className="text-amber-200/70">
                  O objetivo é descobrir por que o <code className="bg-amber-500/10 px-1 rounded text-amber-300">acquire(env.BROWSER)</code> está falhando antes mesmo de carregar páginas. O endpoint debug retorna limites reais da conta Cloudflare.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Evidence */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-widest">Estrutura do Resumo de Debug</span>
          </div>
          <pre className="bg-[#0a0f1d] border border-emerald-500/20 p-6 rounded-xl overflow-x-auto text-xs text-emerald-400/80 leading-relaxed shadow-inner">
{`{
  "sessions": [],
  "history": [],
  "limits": {
    "allowedBrowserAcquisitions": 0,
    "maxConcurrentSessions": 2,
    "timeUntilNextAllowedBrowserAcquisition": 0
  }
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
          debug: expose browser run limits
        </p>
      </div>
    </div>
  );
}
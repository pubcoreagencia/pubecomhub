import { createFileRoute } from '@tanstack/react-router';
// Load the security issues from the scan results and fix the selected issues.
// Update the "@tanstack/react-start" dependency (currently 1.168.48) to a version that fixes its known security vulnerability: JS-YAML: Quadratic CPU consumption in !!omap resolution (3.x and 4.x) — CVE-2026-59870 fix not backported (via js-yaml) (high). Update package.json and the lockfile, then verify the project still builds. If the project's only lockfile is the binary bun.lockb, regenerate it as a text lockfile by running `bun install --save-text-lockfile` so the dependency scanner can verify the fix.
// No projeto PUB ECOM / PubecomHub, preciso recuperar o acesso da conta MASTER existente.
// 
// Usuário:
// contato.pubcore@gmail.com
// 
// O projeto usa Lovable Cloud Managed Supabase, e eu não tenho acesso administrativo ao Supabase Dashboard externo.
// 
// Use o mecanismo administrativo interno disponível no Lovable Cloud para redefinir a senha desse usuário existente.
// 
// IMPORTANTE:
// - NÃO crie outro usuário.
// - NÃO altere o e-mail.
// - NÃO altere o role.
// - Confirme que o perfil continua com role MASTER.
// - NÃO exponha service_role, tokens ou outras credenciais.
// - NÃO grave a senha em código, arquivo ou Git.
// - Se a interface permitir definir a senha diretamente, faça a alteração de forma segura.
// - Se precisar que eu informe uma nova senha, solicite a entrada de forma interativa e não registre o valor em logs.
// 
// Depois valide:
// MASTER USER = contato.pubcore@gmail.com
// MASTER ROLE = MASTER
// PASSWORD RESET = PASS
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Database, Globe, LayoutDashboard, Store, RefreshCw, Activity, Terminal } from "lucide-react";
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
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-bold uppercase tracking-widest text-xs h-9 px-4"
                onClick={() => window.location.href = '/login'}
              >
                Entrar / Login
              </Button>
              <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/5 px-3 py-1 text-sm font-medium">
                v1.7.0
              </Badge>
            </div>
          </div>
          <p className="text-emerald-50/70 text-lg max-w-3xl leading-relaxed">
            O frontend operacional do PUB ECOM está agora integrado ao <strong>backend oficial</strong>. 
            Esta é a central de comando para sincronização de catálogos reais.
          </p>
        </div>

        {/* Integration Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Terminal className="w-5 h-5" />
              </div>
              <CardTitle className="text-emerald-400 text-sm font-black uppercase tracking-widest">Catalog API</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400 mb-2">CONNECTED</Badge>
              <p className="text-[10px] text-emerald-50/50 truncate">pub-ecom-catalog-worker.contato-pubcore.workers.dev</p>
            </CardContent>
          </Card>

          <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <CardTitle className="text-emerald-400 text-sm font-black uppercase tracking-widest">D1 Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400 mb-2">MASTER SYNC</Badge>
              <p className="text-[10px] text-emerald-50/50 truncate">Persistence Layer Active</p>
            </CardContent>
          </Card>

          <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Globe className="w-5 h-5" />
              </div>
              <CardTitle className="text-emerald-400 text-sm font-black uppercase tracking-widest">Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 mb-2">v1.0.0 Stable</Badge>
              <p className="text-[10px] text-emerald-50/50 truncate">GET/POST /v1/catalog/*</p>
            </CardContent>
          </Card>
        </div>

        {/* E2E Test Flow */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
            <Activity className="w-6 h-6" /> FLUXO E2E INTEGRADO
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: LayoutDashboard, text: "Métricas Reais do D1", step: "01" },
              { icon: Store, text: "Lojas Sincronizadas", step: "02" },
              { icon: RefreshCw, text: "Disparo do Scraper Real", step: "03" },
              { icon: Activity, text: "Resultado em Tempo Real", step: "04" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-3 p-5 rounded-xl bg-[#0a0f1d] border border-emerald-500/10 relative">
                <span className="absolute top-4 right-4 text-[10px] font-black text-emerald-500/20">{item.step}</span>
                <item.icon className="w-8 h-8 text-emerald-500 shrink-0" />
                <span className="text-sm font-bold text-emerald-50/90 leading-tight">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Test Case Banner */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <Activity className="w-6 h-6" />
            <h3 className="text-xl font-bold uppercase tracking-widest italic">Primeira Prova de Ingestão</h3>
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4 max-w-md">
              <p className="text-sm text-emerald-50/80 leading-relaxed">
                Use a loja <strong>Zentta Babuche</strong> para validar o ciclo completo. O sistema detectará o ShopID 1729928484 e acionará o worker na Cloudflare.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-black/40 text-emerald-400 border-emerald-500/30">source: shopee</Badge>
                <Badge variant="outline" className="bg-black/40 text-emerald-400 border-emerald-500/30">ID: 1729928484</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-3 justify-center min-w-[200px]">
              <Button 
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-xl py-6"
                onClick={() => window.location.href = '/dashboard/stores'}
              >
                Executar Teste Real
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-8 border-t border-emerald-500/10 text-emerald-50/30 text-[10px] font-black uppercase tracking-widest">
          <span>PUB ECOM OPERATIONAL FRONTEND</span>
          <div className="flex gap-6">
            <a href="https://github.com/pubcoreagencia/pub-ecom-catalog-worker" target="_blank" className="hover:text-emerald-400 transition-colors">BACKEND REPO</a>
            <a href="/dashboard" className="hover:text-emerald-400 transition-colors">DASHBOARD MASTER</a>
          </div>
        </div>
      </div>
    </div>
  );
}
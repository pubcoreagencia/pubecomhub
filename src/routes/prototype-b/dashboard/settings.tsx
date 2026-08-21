import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Settings, 
  Shield, 
  Globe, 
  Zap, 
  Database, 
  Bell, 
  Lock, 
  CreditCard,
  Check,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/dashboard/settings')({
  component: SettingsDashboardB
});

function SettingsDashboardB() {
  const sections = [
    {
      title: "Geral",
      icon: Globe,
      settings: [
        { label: "Nome da Operação", value: "PUB ECOM - PROTOTYPE B", type: "text" },
        { label: "Moeda Base", value: "BRL (R$)", type: "select" },
        { label: "Fuso Horário", value: "America/Sao_Paulo (UTC-3)", type: "select" }
      ]
    },
    {
      title: "Segurança & API",
      icon: Shield,
      settings: [
        { label: "Autenticação em Duas Etapas", value: true, type: "toggle" },
        { label: "Logs de Acesso", value: "Ver Histórico", type: "button" },
        { label: "Chave API (Master)", value: "pk_live_********************", type: "key" }
      ]
    },
    {
      title: "Notificações",
      icon: Bell,
      settings: [
        { label: "Alertas de Vendas (Telegram)", value: true, type: "toggle" },
        { label: "Relatórios Diários por Email", value: true, type: "toggle" },
        { label: "Alertas de Estoque Baixo", value: false, type: "toggle" }
      ]
    }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Configurações</h1>
          <p className="text-slate-500 font-bold">Gerenciamento global do ecossistema PUB ECOM.</p>
        </div>
        <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 shadow-xl shadow-primary/20">
          Salvar Alterações <Check className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm bg-white overflow-hidden p-2">
            {[
              { label: 'Geral', icon: Globe, active: true },
              { label: 'Faturamento', icon: CreditCard },
              { label: 'Equipe', icon: Database },
              { label: 'Integrações', icon: Zap },
              { label: 'Segurança', icon: Lock }
            ].map((item, i) => (
              <button 
                key={i} 
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                  item.active ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-500"
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={cn("h-5 w-5", item.active ? "text-primary" : "text-slate-400")} />
                  <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                </div>
                {!item.active && <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-slate-400" />}
              </button>
            ))}
          </Card>

          <Card className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm bg-slate-900 text-white p-8">
            <h4 className="text-lg font-black tracking-tighter uppercase mb-2">Plano Enterprise</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 leading-relaxed">
              Sua operação está rodando na versão mais completa do ecossistema.
            </p>
            <Button variant="outline" className="w-full rounded-xl border-white/10 text-white hover:bg-white/5 font-black text-[10px] uppercase tracking-widest h-10">
              Ver Faturas
            </Button>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-8">
          {sections.map((section, i) => (
            <Card key={i} className="rounded-[32px] border-none ring-1 ring-slate-100 shadow-sm bg-white overflow-hidden">
              <CardHeader className="px-10 py-8 border-b border-slate-50 flex flex-row items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                  <section.icon className="h-5 w-5 text-slate-900" />
                </div>
                <CardTitle className="text-lg font-black tracking-tighter text-slate-900 uppercase">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {section.settings.map((setting, j) => (
                    <div key={j} className="px-10 py-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{setting.label}</p>
                        {typeof setting.value === 'string' && (
                          <p className="text-xs font-bold text-slate-400 mt-1">{setting.value}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        {setting.type === 'toggle' ? (
                          <Switch defaultChecked={setting.value as boolean} className="data-[state=checked]:bg-primary" />
                        ) : setting.type === 'button' ? (
                          <Button variant="outline" className="rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest h-10">
                            {setting.value}
                          </Button>
                        ) : setting.type === 'key' ? (
                          <div className="bg-slate-50 px-4 py-2 rounded-xl font-mono text-[10px] text-slate-500 border border-slate-100">
                            {setting.value}
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-50">
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

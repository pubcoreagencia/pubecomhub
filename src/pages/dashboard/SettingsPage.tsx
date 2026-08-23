import * as React from 'react';
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
  ChevronRight,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useServerFn } from '@tanstack/react-start';
import { updateMasterPassword } from '@/lib/api/auth-admin.functions';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('Geral');
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);

  const updatePasswordFn = useServerFn(updateMasterPassword);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setIsUpdating(true);
    try {
      await updatePasswordFn({ data: { newPassword } });
      toast.success("Senha alterada com sucesso!");
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Update password error:', error);
      toast.error(error.message || "Erro ao alterar a senha.");
    } finally {
      setIsUpdating(false);
    }
  };

  const sections = [
    {
      id: 'Geral',
      title: "Geral",
      icon: Globe,
      settings: [
        { label: "Nome da Operação", value: "PUB ECOM - OFFICIAL", type: "text" },
        { label: "Moeda Base", value: "BRL (R$)", type: "select" },
        { label: "Fuso Horário", value: "America/Sao_Paulo (UTC-3)", type: "select" }
      ]
    },
    {
      id: 'Segurança',
      title: "Segurança & API",
      icon: Shield,
      settings: [
        { label: "Autenticação em Duas Etapas", value: true, type: "toggle" },
        { label: "Logs de Acesso", value: "Ver Histórico", type: "button" },
        { label: "Chave API (Master)", value: "pk_live_********************", type: "key" }
      ]
    },
    {
      id: 'Notificações',
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
    <Shell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Configurações</h2>
            <p className="text-[var(--hub-muted)] text-[9px] font-bold uppercase tracking-[0.3em]">Gerenciamento Global do Ecossistema</p>
          </div>
          <Button className="h-10 hub-bg-primary hover:opacity-90 text-black text-[10px] font-black uppercase tracking-[0.2em] px-8 shadow-lg shadow-[var(--hub-primary)]/20 rounded-xl">
            <Check className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="hub-card hub-gradient-border p-2 bg-black/20">
              {[
                { id: 'Geral', label: 'Geral', icon: Globe },
                { id: 'Faturamento', label: 'Faturamento', icon: CreditCard },
                { id: 'Equipe', label: 'Equipe', icon: Database },
                { id: 'Integrações', label: 'Integrações', icon: Zap },
                { id: 'Segurança', label: 'Segurança', icon: Lock }
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl transition-all group",
                    activeTab === item.id ? "bg-white/5 text-white border border-white/10" : "hover:bg-white/5 text-[var(--hub-muted)]"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className={cn("h-4 w-4", activeTab === item.id ? "text-[var(--hub-primary)]" : "opacity-40")} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                  </div>
                  {activeTab !== item.id && <ChevronRight className="h-4 w-4 opacity-10 group-hover:opacity-40" />}
                </button>
              ))}
            </div>

            <div className="hub-card hub-gradient-border bg-black/40 border-[var(--hub-primary)]/20 p-8">
              <h4 className="text-lg font-black text-white tracking-tighter uppercase mb-2 italic">Enterprise</h4>
              <p className="text-[9px] font-bold text-[var(--hub-muted)] uppercase tracking-widest mb-6 leading-relaxed italic">
                Sua operação está rodando na versão mais completa do ecossistema PUB ECOM.
              </p>
              <Button variant="outline" className="w-full rounded-xl border-white/10 text-white hover:bg-white/5 font-black text-[9px] uppercase tracking-[0.2em] h-10 italic">
                Ver Faturas
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'Segurança' && (
              <div className="hub-card hub-gradient-border overflow-hidden bg-black/20">
                <div className="px-10 py-6 border-b border-[var(--hub-border)] bg-black/40 flex items-center gap-4">
                  <div className="h-8 w-8 rounded-lg bg-black/40 border border-[var(--hub-border)] flex items-center justify-center">
                    <Lock className="h-4 w-4 text-[var(--hub-muted)]" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic">Alterar Senha Master</h3>
                </div>
                <div className="p-10">
                  <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white uppercase tracking-tighter italic">Nova Senha</label>
                      <div className="relative">
                        <Input 
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Mínimo 8 caracteres"
                          className="bg-black/40 border-[var(--hub-border)] text-white h-12 rounded-xl"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--hub-muted)] hover:text-white transition-colors"
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white uppercase tracking-tighter italic">Confirmar Nova Senha</label>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repita a nova senha"
                          className="bg-black/40 border-[var(--hub-border)] text-white h-12 rounded-xl"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--hub-muted)] hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isUpdating}
                      className="w-full h-12 hub-bg-primary hover:opacity-90 text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[var(--hub-primary)]/20 rounded-xl"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Atualizando...
                        </>
                      ) : (
                        "Atualizar Senha Definitiva"
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {sections.filter(s => activeTab === 'Geral' ? s.id === 'Geral' : (activeTab === 'Segurança' ? s.id === 'Segurança' : s.id === activeTab)).map((section, i) => (
              <div key={i} className="hub-card hub-gradient-border overflow-hidden bg-black/20">
                <div className="px-10 py-6 border-b border-[var(--hub-border)] bg-black/40 flex items-center gap-4">
                  <div className="h-8 w-8 rounded-lg bg-black/40 border border-[var(--hub-border)] flex items-center justify-center">
                    <section.icon className="h-4 w-4 text-[var(--hub-muted)]" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic">{section.title}</h3>
                </div>
                <div className="divide-y divide-[var(--hub-border)]">
                  {section.settings.map((setting, j) => (
                    <div key={j} className="px-10 py-6 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-tighter italic">{setting.label}</p>
                        {typeof setting.value === 'string' && (
                          <p className="text-[10px] font-bold text-[var(--hub-muted)] mt-1 uppercase tracking-widest opacity-40">{setting.value}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        {setting.type === 'toggle' ? (
                          <Switch defaultChecked={setting.value as boolean} className="data-[state=checked]:bg-[var(--hub-primary)]" />
                        ) : setting.type === 'button' ? (
                          <Button variant="outline" className="rounded-lg border-[var(--hub-border)] bg-black/40 text-white font-black text-[9px] uppercase tracking-[0.2em] h-9 hover:bg-white/5">
                            {setting.value}
                          </Button>
                        ) : setting.type === 'key' ? (
                          <div className="bg-black/40 px-4 py-2 rounded-lg font-mono text-[9px] text-[var(--hub-muted)] border border-[var(--hub-border)] border-dashed">
                            {setting.value}
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white/5">
                            <ChevronRight className="h-4 w-4 opacity-20" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

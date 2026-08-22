import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Loader2, AlertCircle, CircleDollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    supabase.auth.getSession().then(({ data }) => {
      if (data?.session && isMounted) {
        setReady(true);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'PASSWORD_RECOVERY' || session) && isMounted) {
        setReady(true);
      }
    });
    authSubscription = listener?.subscription ?? null;

    const timer = setTimeout(() => {
      if (isMounted) setReady(true);
    }, 1500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      authSubscription?.unsubscribe();
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setErrorMsg('Preencha a nova senha e a confirmação.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setErrorMsg(error.message || 'Falha ao redefinir a senha.');
        toast.error('Erro ao redefinir senha.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast.success('Senha atualizada com sucesso!');
      setTimeout(() => {
        navigate({ to: '/dashboard' });
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro inesperado ao redefinir senha.');
      toast.error('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center p-4 selection:bg-emerald-500/30">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 mb-2">
            <CircleDollarSign className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">PUB ECOM</h1>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Redefinição de Senha
          </p>
        </div>

        <Card className="bg-[#0a0f1d] border-emerald-500/20 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-black uppercase tracking-wider text-white">Criar Nova Senha</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Digite e confirme sua nova senha de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4 py-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">Senha Redefinida!</h3>
                <p className="text-xs text-slate-400">Redirecionando para o painel principal em instantes...</p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nova Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <Input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={loading}
                      className="pl-10 bg-black/50 border-slate-800 text-white focus:border-emerald-500 h-11"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirmar Nova Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <Input
                      type="password"
                      placeholder="Repita a nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      className="pl-10 bg-black/50 border-slate-800 text-white focus:border-emerald-500 h-11"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-lg text-xs text-red-400 font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/10 mt-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      Salvar Nova Senha
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

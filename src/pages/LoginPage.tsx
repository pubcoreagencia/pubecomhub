import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Mail, Loader2, AlertCircle, CircleDollarSign, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if session already exists
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        navigate({ to: '/dashboard' });
      } else {
        setCheckingSession(false);
      }
    }).catch(() => {
      setCheckingSession(false);
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message);
        toast.error('Falha na autenticação.');
        setLoading(false);
        return;
      }

      if (data?.session) {
        toast.success('Login realizado com sucesso!');
        navigate({ to: '/dashboard' });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro inesperado ao realizar login.');
      toast.error('Erro de conexão ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
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
            Acesso Operacional Master
          </p>
        </div>

        <Card className="bg-[#0a0f1d] border-emerald-500/20 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-black uppercase tracking-wider text-white">Entrar no Sistema</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Informe suas credenciais para acessar o painel administrativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <Input
                    type="email"
                    placeholder="admin@pubecom.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="pl-10 bg-black/50 border-slate-800 text-white focus:border-emerald-500 h-11"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pl-10 bg-black/50 border-slate-800 text-white focus:border-emerald-500 h-11"
                    autoComplete="current-password"
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
                    Autenticando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase font-mono">
            Origem Segura: {typeof window !== 'undefined' ? window.location.hostname : 'Cloudflare Workers'}
          </p>
        </div>
      </div>
    </div>
  );
};

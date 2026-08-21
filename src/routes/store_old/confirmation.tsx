import { createFileRoute, Link } from '@tanstack/react-router';
import { CheckCircle2, Package, ArrowRight, Share2, Zap, Smartphone, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';

export const Route = createFileRoute('/store_old/confirmation')({
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Limpar o carrinho apenas quando a confirmação for exibida com sucesso
    clearCart();
  }, []);
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary selection:text-white flex flex-col items-center justify-center p-6 text-center">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-[600px] w-full space-y-16 relative z-10">
        <div className="space-y-8">
          <div className="relative inline-flex">
             <div className="h-28 w-28 rounded-[3rem] bg-emerald-500 flex items-center justify-center text-white shadow-[0_20px_50px_rgba(16,185,129,0.3)] animate-in zoom-in-50 duration-700">
               <CheckCircle2 className="h-14 w-14 stroke-[3px]" />
             </div>
             <div className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-white shadow-2xl flex items-center justify-center animate-bounce duration-[2000ms] border-4 border-emerald-50">
                <Zap className="h-6 w-6 text-primary fill-primary" />
             </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-[0.85]">
              VALEU PELA <br/> <span className="text-emerald-500 uppercase tracking-tight">CONFIANÇA.</span>
            </h1>
            <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.3em] pt-2">
              Pedido #ORD-99231 • Confirmado com Sucesso
            </p>
          </div>
        </div>

        <div className="bg-white p-10 lg:p-12 rounded-[3.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.06)] border border-slate-100 text-left space-y-10 relative overflow-hidden group hover:shadow-[0_40px_80px_rgba(16,185,129,0.1)] transition-all duration-700">
          <div className="flex items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
               <Package className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status da Operação</p>
              <p className="text-xl font-black text-slate-900 tracking-tight">Preparando para envio</p>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Entrega Estimada</p>
               <p className="text-base font-black text-slate-900">2 a 5 dias úteis</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="h-4 bg-slate-50 rounded-full overflow-hidden p-1 shadow-inner">
              <div className="h-full w-1/4 bg-emerald-500 rounded-full animate-in slide-in-from-left duration-1500 ease-out shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
               <span className="text-emerald-500">Confirmado</span>
               <span>Processando</span>
               <span>Em Trânsito</span>
               <span>Entregue</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link to="/store">
            <Button variant="outline" className="w-full rounded-full h-20 font-black uppercase tracking-[0.2em] text-[11px] border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-900 transition-all">
              Voltar para Home
            </Button>
          </Link>
          <Button className="w-full rounded-full h-20 font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_20px_40px_rgba(var(--primary),0.2)] hover:scale-[1.02] hover:shadow-[0_25px_50px_rgba(var(--primary),0.3)] transition-all gap-3 group">
            <Share2 className="h-4 w-4" /> 
            Compartilhar Compra
          </Button>
        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-wrap items-center justify-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
           <div className="flex items-center gap-3 hover:text-emerald-500 transition-colors cursor-default">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              Compra Protegida
           </div>
           <div className="flex items-center gap-3 hover:text-primary transition-colors cursor-default">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Tech Store Oficial
           </div>
        </div>

      </div>
    </div>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

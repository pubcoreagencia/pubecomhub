import { createFileRoute, Link } from '@tanstack/react-router';
import { CheckCircle2, Package, ArrowRight, Share2, Zap, Smartphone, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/store/confirmation')({
  component: ConfirmationPage,
});

function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary selection:text-white flex flex-col items-center justify-center p-6 text-center">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-[560px] w-full space-y-12 relative z-10">
        <div className="space-y-6">
          <div className="relative inline-flex">
             <div className="h-24 w-24 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 animate-in zoom-in-50 duration-500">
               <CheckCircle2 className="h-12 w-12 stroke-[3px]" />
             </div>
             <div className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-white shadow-xl flex items-center justify-center animate-bounce duration-[2000ms]">
                <Zap className="h-5 w-5 text-primary fill-primary" />
             </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 leading-[0.9]">
              VALEU PELA <br/> <span className="text-emerald-500 uppercase tracking-tight">CONFIANÇA!</span>
            </h1>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.2em] pt-2">
              Pedido #ORD-99231 confirmado com sucesso.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 text-left space-y-8 relative overflow-hidden group hover:shadow-emerald-500/10 transition-shadow duration-500">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
               <Package className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status do Envio</p>
              <p className="text-base font-black text-slate-900">Preparando para envio</p>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Previsão</p>
               <p className="text-sm font-bold text-slate-900 text-nowrap">2 a 5 dias úteis</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div className="h-full w-1/4 bg-emerald-500 rounded-full animate-in slide-in-from-left duration-1000 ease-out" />
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span className="text-emerald-500">Confirmado</span>
               <span>Processando</span>
               <span>Enviado</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/store">
            <Button variant="outline" className="w-full rounded-full h-16 font-black uppercase tracking-widest text-xs border-slate-200 hover:bg-slate-50 transition-all">
              Voltar para Home
            </Button>
          </Link>
          <Button className="w-full rounded-full h-16 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all gap-2 group">
            <Share2 className="h-4 w-4" /> 
            Compartilhar Compra
          </Button>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
           <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Compra Protegida
           </div>
           <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" />
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

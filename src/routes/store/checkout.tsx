import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, CreditCard, Lock, Zap, ChevronLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export const Route = createFileRoute('/store/checkout')({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, totalPrice, isHydrated, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-primary selection:text-white">
      {/* Mini Header */}
      <header className="bg-white border-b sticky top-0 z-50">
         <div className="container px-6 mx-auto h-20 flex items-center justify-between max-w-[1200px]">
            <Link to="/store" className="flex items-center gap-2">
               <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                  <Zap className="h-5 w-5 fill-primary text-primary" />
               </div>
               <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Tech Store</span>
            </Link>
            <div className="flex items-center gap-2 text-slate-400">
               <ShieldCheck className="h-4 w-4 text-emerald-500" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Pagamento 100% Seguro</span>
            </div>
         </div>
      </header>

      <div className="container px-6 mx-auto max-w-[1200px] py-12 lg:py-20">
        <Link to="/store" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-12">
           <ChevronLeft className="h-4 w-4" />
           Voltar para a Loja
        </Link>

        <div className="flex flex-col lg:flex-row gap-16 lg:items-start">
          {/* Checkout Steps */}
          <div className="flex-[1.5] space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">1</div>
                 <h2 className="text-2xl font-black tracking-tight text-slate-900">IDENTIFICAÇÃO & ENTREGA</h2>
              </div>
              <div className="bg-white p-10 lg:p-12 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">E-mail para Contato</Label>
                    <Input placeholder="seu@email.com" className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-bold" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Celular (WhatsApp)</Label>
                    <Input placeholder="(00) 00000-0000" className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-bold" />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nome Completo</Label>
                    <Input placeholder="Como no documento" className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-bold" />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Endereço de Entrega</Label>
                    <Input placeholder="Rua, Número, Bairro e Cidade" className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-bold" />
                  </div>
                </div>
              </div>

            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">2</div>
                 <h2 className="text-2xl font-black tracking-tight text-slate-900">FORMA DE PAGAMENTO</h2>
              </div>
              <div className="bg-white p-10 lg:p-12 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                   <div className="p-6 border-4 border-primary bg-primary/5 rounded-[2rem] cursor-pointer flex flex-col items-center gap-3 group transition-all shadow-lg shadow-primary/5">
                      <CreditCard className="h-8 w-8 text-primary" />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Cartão</span>
                   </div>
                   <div className="p-6 border-4 border-slate-50 bg-slate-50/50 rounded-[2rem] cursor-pointer flex flex-col items-center gap-3 group transition-all hover:border-primary/20">
                      <Zap className="h-8 w-8 text-slate-300 group-hover:text-primary transition-colors" />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-600 transition-colors">Pix</span>
                   </div>
                   <div className="p-6 border-4 border-slate-50 bg-slate-50/50 rounded-[2rem] cursor-pointer flex flex-col items-center gap-3 group transition-all hover:border-primary/20">
                      <ShoppingBag className="h-8 w-8 text-slate-300 group-hover:text-primary transition-colors" />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-600 transition-colors">Boleto</span>
                   </div>
                </div>

                <div className="space-y-8 pt-4">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Número do Cartão</Label>
                    <Input placeholder="0000 0000 0000 0000" className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Validade</Label>
                      <Input placeholder="MM/AA" className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-bold" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">CVV</Label>
                      <Input placeholder="123" className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-bold" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="pt-4">
              <Link to="/store/confirmation">
                <Button className="w-full h-20 text-lg font-black uppercase tracking-[0.2em] rounded-full shadow-2xl shadow-primary/20 hover:scale-[1.01] transition-all gap-3 group">
                  Finalizar Pagamento <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <div className="mt-8 flex items-center justify-center gap-6">
                 <div className="h-10 w-16 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-[8px] font-black grayscale opacity-50 uppercase tracking-tighter">Visa</div>
                 <div className="h-10 w-16 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-[8px] font-black grayscale opacity-50 uppercase tracking-tighter">Master</div>
                 <div className="h-10 w-16 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-[8px] font-black grayscale opacity-50 uppercase tracking-tighter">Pix</div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="flex-1 lg:sticky lg:top-32">
            <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 space-y-10">
              <h2 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-4 text-slate-900">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                Resumo
              </h2>
              <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2 scrollbar-hide">
                {isHydrated && items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-5 group">
                      <div className="h-24 w-24 rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden shrink-0 shadow-sm">
                        <img src={item.image} className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                      </div>
                      <div className="flex-1 space-y-1 py-1">
                        <p className="text-base font-black text-slate-900 line-clamp-1 leading-tight tracking-tight">{item.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qtd: {item.quantity}</p>
                        <p className="text-lg font-black text-slate-900 mt-2 tracking-tighter">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm font-bold text-slate-400 text-center py-10 uppercase tracking-widest">Seu carrinho está vazio.</p>
                )}
              </div>
              <div className="border-t border-slate-100 pt-10 space-y-5">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em]">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-slate-900">R$ {isHydrated ? totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}</span>
                </div>
                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em]">
                  <span className="text-slate-400">Frete</span>
                  <span className="text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Grátis</span>
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-slate-100">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Total Final</span>
                     <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">R$ {isHydrated ? totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

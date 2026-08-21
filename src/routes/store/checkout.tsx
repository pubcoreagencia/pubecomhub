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
              <div className="bg-white p-8 lg:p-10 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">E-mail para Contato</Label>
                    <Input placeholder="seu@email.com" className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Celular (WhatsApp)</Label>
                    <Input placeholder="(00) 00000-0000" className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nome Completo</Label>
                    <Input placeholder="Como no documento" className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Endereço de Entrega</Label>
                    <Input placeholder="Rua, Número, Bairro e Cidade" className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">2</div>
                 <h2 className="text-2xl font-black tracking-tight text-slate-900">FORMA DE PAGAMENTO</h2>
              </div>
              <div className="bg-white p-8 lg:p-10 rounded-[2rem] shadow-sm border border-slate-100 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   <div className="p-4 border-2 border-primary bg-primary/5 rounded-2xl cursor-pointer flex flex-col items-center gap-2 group transition-all">
                      <CreditCard className="h-6 w-6 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Cartão</span>
                   </div>
                   <div className="p-4 border-2 border-slate-100 rounded-2xl cursor-pointer flex flex-col items-center gap-2 group transition-all hover:border-primary/20">
                      <Zap className="h-6 w-6 text-slate-300 group-hover:text-primary/40" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pix</span>
                   </div>
                   <div className="p-4 border-2 border-slate-100 rounded-2xl cursor-pointer flex flex-col items-center gap-2 group transition-all hover:border-primary/20">
                      <ShoppingBag className="h-6 w-6 text-slate-300 group-hover:text-primary/40" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Boleto</span>
                   </div>
                </div>

                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Número do Cartão</Label>
                    <Input placeholder="0000 0000 0000 0000" className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Validade</Label>
                      <Input placeholder="MM/AA" className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">CVV</Label>
                      <Input placeholder="123" className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Link to="/store/confirmation" onClick={() => clearCart()}>
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
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
              <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-primary" /> Carrinho
              </h2>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {isHydrated && items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="h-20 w-20 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                        <img src={item.image} className="object-cover h-full w-full group-hover:scale-110 transition-transform" alt={item.name} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-black text-slate-900 line-clamp-1 leading-tight">{item.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Qtd: {item.quantity}</p>
                        <p className="text-sm font-black text-slate-900 mt-1">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm font-medium text-slate-400 text-center py-8 italic">Seu carrinho está vazio.</p>
                )}
              </div>
              <div className="border-t border-slate-50 pt-8 space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-slate-900">R$ {isHydrated ? totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-slate-400">Frete</span>
                  <span className="text-emerald-500">Grátis</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total à pagar</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">R$ {isHydrated ? totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

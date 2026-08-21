import { createFileRoute, Link } from '@tanstack/react-router';
import { ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, ChevronRight, Zap, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockProducts } from '@/data/mock';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/store_old/product')({
  component: ProductPage,
});

function ProductPage() {
  const product = mockProducts[0];
  const { addToCart } = useCart();

  if (!product) return <div>Produto não encontrado</div>;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary selection:text-white pb-24">
      {/* Navbar Simple */}
      <header className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex h-20 items-center justify-between px-6 mx-auto max-w-[1400px]">
          <Link to="/store" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
               <Zap className="h-5 w-5 fill-primary text-primary" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Tech Store</span>
          </Link>
          <div className="flex items-center gap-4">
             <Link to="/store/checkout">
                <Button variant="ghost" size="icon" className="rounded-full">
                   <ShoppingCart className="h-5 w-5" />
                </Button>
             </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container px-6 mx-auto py-8 max-w-[1400px]">
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-8">
          <Link to="/store" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/store" className="hover:text-primary transition-colors">Smartphones</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-900">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16 lg:items-start">
          {/* Images Section */}
          <div className="flex-1 space-y-6">
            <div className="aspect-square rounded-[3.5rem] overflow-hidden bg-slate-50 border-8 border-white shadow-2xl group cursor-zoom-in relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            </div>
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={cn(
                  "aspect-square rounded-3xl border-4 transition-all overflow-hidden cursor-pointer shadow-sm hover:shadow-md",
                  i === 1 ? "border-primary" : "border-white hover:border-slate-200"
                )}>
                  <img src={product.image} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>

          </div>

          {/* Product Info Section */}
          <div className="flex-1 space-y-10 lg:sticky lg:top-32">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 font-black text-[10px] uppercase tracking-widest">
                    Lançamento Premium
                 </Badge>
                 <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-rose-500">
                    <Heart className="h-5 w-5" />
                 </Button>
              </div>
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.85]">{product.name}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-amber-500">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-4.5 w-4.5 fill-current" />)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">128 Review Verificadas</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-base font-bold text-slate-400 line-through">R$ 3.499,00</p>
              <div className="flex items-center gap-5">
                <span className="text-6xl font-black text-slate-900 tracking-tighter">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <Badge className="bg-emerald-500 text-white border-none rounded-full px-5 py-2 font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-200">15% OFF</Badge>
              </div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">ou 12x de R$ {(product.price / 12).toFixed(2)} sem juros</p>
            </div>

            <div className="space-y-8 pt-10 border-t border-slate-100">
              <p className="text-lg text-slate-500 font-bold leading-relaxed opacity-80">
                Experimente o futuro da tecnologia com o novo {product.name}. Equipado com o processador mais rápido do mercado, câmera de nível profissional e bateria que dura o dia todo. O design elegante encontra a performance extrema.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <Link to="/store/checkout" className="flex-[2]" onClick={() => addToCart(product)}>
                  <Button className="w-full h-20 text-base font-black uppercase tracking-[0.2em] rounded-full shadow-[0_20px_40px_rgba(var(--primary),0.2)] hover:scale-[1.02] hover:shadow-[0_25px_50px_rgba(var(--primary),0.3)] transition-all gap-3 group">
                    Comprar Agora <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="h-20 w-20 rounded-full border-2 border-slate-200 hover:bg-white hover:border-slate-900 transition-all shrink-0 group"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="h-6 w-6 text-slate-700 group-hover:scale-110 transition-transform" />
                </Button>
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-slate-100">
              {[
                 { icon: Truck, text: 'Frete Grátis Express' },
                 { icon: ShieldCheck, text: 'Garantia de 2 Anos' },
                 { icon: RotateCcw, text: 'Devolução Grátis' }
              ].map((b, i) => (
                <div key={i} className="flex flex-col gap-3 items-center text-center">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-tight">{b.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from '@tanstack/react-router';
import { ShoppingCart, Search, Menu, Star, ChevronRight, Zap, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { mockProducts } from '@/data/mock';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/store/')({
  component: StoreHome,
});

function StoreHome() {
  const { totalItems, isHydrated } = useCart();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary selection:text-white">
      {/* Top Banner */}
      <div className="bg-primary text-[10px] font-bold uppercase tracking-[0.2em] text-white py-2 text-center">
        Frete Grátis em compras acima de R$ 500,00 • Parcelamento em até 12x
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl transition-all duration-300">
        <div className="container flex h-20 items-center justify-between px-6 mx-auto max-w-[1400px]">
          <div className="flex items-center gap-12">
            <Link to="/store" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white transition-transform group-hover:scale-110">
                 <Zap className="h-6 w-6 fill-primary text-primary" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">TECH STORE</span>
            </Link>
            <nav className="hidden lg:flex gap-8 text-[13px] font-bold uppercase tracking-wider text-slate-500">
              <Link to="/store" className="transition-colors hover:text-primary border-b-2 border-transparent hover:border-primary pb-1">Lançamentos</Link>
              <Link to="/store" className="transition-colors hover:text-primary border-b-2 border-transparent hover:border-primary pb-1">Smartphones</Link>
              <Link to="/store" className="transition-colors hover:text-primary border-b-2 border-transparent hover:border-primary pb-1">Acessórios</Link>
              <Link to="/store" className="transition-colors hover:text-primary border-b-2 border-transparent hover:border-primary pb-1">Ofertas</Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="search" 
                placeholder="O que você procura hoje?" 
                className="h-11 w-64 rounded-full border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all border" 
              />
            </div>
            
            <Link to="/store/checkout">
              <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-full hover:bg-slate-50 transition-colors">
                <ShoppingCart className="h-5 w-5 text-slate-700" />
                {isHydrated && totalItems > 0 && (
                  <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-lg ring-2 ring-white animate-in zoom-in-50 duration-300">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="lg:hidden rounded-full h-11 w-11">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-slate-50">
        <div className="container px-6 mx-auto max-w-[1400px] flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100">
               <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Novo Smartphone Pro Disponível</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9]">
              TECNOLOGIA <br/> 
              <span className="text-primary">SEM LIMITES.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-[600px] font-medium leading-relaxed">
              Explore o futuro com dispositivos que redefinem o possível. Performance bruta e design impecável em suas mãos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all gap-2 group">
                Explorar Coleção <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-base font-bold border-slate-200 hover:bg-white transition-all">
                Ver Vídeo
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full relative animate-in fade-in slide-in-from-right-8 duration-1000">
             <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl opacity-50" />
             <Link to="/store/product" className="relative block group">
               <div className="overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white transition-transform duration-500 group-hover:scale-[1.02]">
                  <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200" alt="Featured" className="object-cover w-full h-[600px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-12">
                     <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl w-full text-white border border-white/20">
                        <p className="text-xs font-bold uppercase tracking-widest mb-1">Destaque da Semana</p>
                        <h3 className="text-2xl font-black">Smartphone Pro Titanium</h3>
                     </div>
                  </div>
               </div>
             </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 border-y border-slate-100 bg-white">
         <div className="container px-6 mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
               { icon: Truck, title: 'Entrega Expressa', desc: 'Em todo o Brasil' },
               { icon: ShieldCheck, title: 'Garantia Oficial', desc: 'Segurança total' },
               { icon: RotateCcw, title: 'Troca Fácil', desc: 'Até 7 dias úteis' }
            ].map((b, i) => (
               <div key={i} className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-all">
                     <b.icon className="h-6 w-6" />
                  </div>
                  <div>
                     <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">{b.title}</h4>
                     <p className="text-xs text-slate-500 font-medium">{b.desc}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 lg:py-32 container px-6 mx-auto max-w-[1400px]">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">CURADORIA TECH.</h2>
            <p className="text-slate-500 font-medium text-lg">Produtos selecionados para máxima performance.</p>
          </div>
          <Button variant="ghost" className="rounded-full font-bold text-primary hover:bg-primary/5 px-6">Ver Todos <ChevronRight className="h-4 w-4 ml-1" /></Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {mockProducts.map((p) => (
            <Card key={p.id} className="group border-none shadow-none bg-transparent">
              <Link to="/store/product">
                <CardContent className="p-0 overflow-hidden rounded-[2rem] aspect-[4/5] mb-6 bg-slate-100 relative shadow-sm transition-shadow hover:shadow-xl duration-500">
                  <img src={p.image} alt={p.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                     <Button className="w-full rounded-full h-12 font-bold shadow-lg shadow-primary/20 bg-white text-slate-900 hover:bg-white hover:scale-[1.02] transition-all">
                       Detalhes do Produto
                     </Button>
                  </div>
                  {p.price > 1000 && (
                     <Badge className="absolute top-6 left-6 bg-primary text-white border-none rounded-full px-4 py-1.5 font-black text-[10px] uppercase shadow-lg">
                        Best Seller
                     </Badge>
                  )}
                </CardContent>
              </Link>
              <CardFooter className="flex flex-col items-start p-0 gap-2">
                <div className="flex items-center gap-1.5 text-amber-500">
                   {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-3 w-3 fill-current" />)}
                   <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">(48)</span>
                </div>
                <Link to="/store/product" className="block w-full">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors truncate">{p.name}</h3>
                </Link>
                <p className="text-2xl font-black text-slate-900 tracking-tight">R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA / Newsletter */}
      <section className="container px-6 mx-auto max-w-[1400px] mb-24 lg:mb-32">
         <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-24 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-10">
               <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9]">ENTRE PARA O CLUB.</h2>
               <p className="text-slate-400 text-lg font-medium">Receba acessos antecipados, ofertas exclusivas e conteúdos de tecnologia diretamente no seu e-mail.</p>
               <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                 <input 
                  type="email" 
                  placeholder="Seu melhor e-mail" 
                  className="flex-1 rounded-full px-8 h-14 bg-white/10 border-none text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-slate-500 font-bold" 
                 />
                 <Button className="rounded-full h-14 px-10 font-bold text-base hover:scale-[1.02] transition-all">Assinar Agora</Button>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
         <div className="container px-6 mx-auto max-w-[1400px]">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-24 text-center md:text-left">
               <div className="col-span-2 space-y-6">
                  <Link to="/store" className="flex items-center gap-2 justify-center md:justify-start">
                    <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                       <Zap className="h-5 w-5 fill-primary text-primary" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Tech Store</span>
                  </Link>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                     A melhor curadoria de tecnologia do Brasil. Qualidade garantida e entrega em tempo recorde.
                  </p>
               </div>
               <div className="space-y-6">
                  <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em]">Shop</h4>
                  <ul className="space-y-4 text-sm font-bold text-slate-500">
                     <li><Link to="/store" className="hover:text-primary transition-colors">Novidades</Link></li>
                     <li><Link to="/store" className="hover:text-primary transition-colors">Smartphones</Link></li>
                     <li><Link to="/store" className="hover:text-primary transition-colors">Áudio</Link></li>
                     <li><Link to="/store" className="hover:text-primary transition-colors">Ofertas</Link></li>
                  </ul>
               </div>
               <div className="space-y-6">
                  <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em]">Suporte</h4>
                  <ul className="space-y-4 text-sm font-bold text-slate-500">
                     <li><Link to="/store" className="hover:text-primary transition-colors">Rastreio</Link></li>
                     <li><Link to="/store" className="hover:text-primary transition-colors">Garantia</Link></li>
                     <li><Link to="/store" className="hover:text-primary transition-colors">FAQ</Link></li>
                     <li><Link to="/store" className="hover:text-primary transition-colors">Fale Conosco</Link></li>
                  </ul>
               </div>
               <div className="col-span-2 lg:col-span-2 flex flex-col items-center md:items-end justify-between py-1">
                  <div className="flex gap-4">
                     {['TW', 'IG', 'FB', 'YT'].map(s => (
                        <div key={s} className="h-10 w-10 rounded-full border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors">{s}</div>
                     ))}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-8 md:mt-0">© 2026 Tech Store • PUB ECOM</p>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}

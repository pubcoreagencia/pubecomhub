import { createFileRoute } from '@tanstack/react-router';
import { ShellB } from '@/prototype-b/components/ShellB';
import { ShoppingBag, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/store/')({
  component: () => <StorefrontB />,
});

function StorefrontB() {
  const products = [
    { id: 'p1', name: 'Premium Wireless Headphones', price: 'R$ 899,90', oldPrice: 'R$ 1.299,00', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', tag: 'MAIS VENDIDO' },
    { id: 'p2', name: 'Smart Fitness Watch Pro', price: 'R$ 459,00', oldPrice: 'R$ 699,00', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', tag: 'LANÇAMENTO' },
    { id: 'p3', name: 'Ultra HD Camera System', price: 'R$ 2.400,00', oldPrice: 'R$ 3.100,00', img: 'https://images.unsplash.com/photo-1526170315876-db60ad51f67e?w=800' },
    { id: 'p4', name: 'Minimalist Mechanical Keyboard', price: 'R$ 650,00', oldPrice: 'R$ 850,00', img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800' }
  ];

  return (
    <div className="prototype-b min-h-screen">
      {/* Dark Navbar */}
      <nav className="h-20 border-b border-[var(--hub-border)] bg-black/40 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-10">
         <div className="flex items-center gap-3">
            <div className="h-8 w-8 hub-bg-primary rounded flex items-center justify-center">
               <ShoppingBag className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">PUB STORE</span>
         </div>
         
         <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-[var(--hub-muted)]">
            <a href="#" className="hover:text-white transition-colors">Novidades</a>
            <a href="#" className="hover:text-white transition-colors">Categorias</a>
            <a href="#" className="hover:text-white transition-colors">Ofertas</a>
            <a href="#" className="hover:text-white transition-colors text-[var(--hub-primary)]">Live Shop</a>
         </div>

         <div className="flex items-center gap-6">
            <Button variant="ghost" className="text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest px-4">
               Minha Conta
            </Button>
            <Button className="hub-bg-primary text-black hover:bg-[var(--hub-primary)]/90 rounded-none h-10 px-8 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[var(--hub-primary)]/20">
               Carrinho (0)
            </Button>
         </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center px-10 border-b border-[var(--hub-border)] overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
         <img 
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-50"
         />
         
         <div className="relative z-20 max-w-2xl space-y-8 animate-in slide-in-from-left duration-1000">
            <div className="flex items-center gap-2">
               <div className="h-[1px] w-8 hub-bg-primary" />
               <span className="text-[10px] font-black hub-text-primary uppercase tracking-[0.3em]">Coleção 2026 Titanium</span>
            </div>
            <h1 className="text-8xl font-black text-white tracking-tighter leading-[0.85]">
               SOUND<br/>OF THE<br/><span className="hub-text-primary">FUTURE.</span>
            </h1>
            <p className="text-lg text-[var(--hub-muted)] font-medium max-w-lg leading-relaxed">
               Performance inigualável e design minimalista. A tecnologia que você precisa, com a estética que você deseja.
            </p>
            <div className="flex items-center gap-4">
               <Button className="hub-bg-primary text-black rounded-none h-14 px-10 text-xs font-black uppercase tracking-widest group">
                  Comprar Agora <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
               </Button>
               <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-none h-14 px-10 text-xs font-black uppercase tracking-widest">
                  Ver Detalhes
               </Button>
            </div>
         </div>
      </section>

      {/* Featured Grid */}
      <section className="py-24 px-10 bg-black/20">
         <div className="flex items-center justify-between mb-16">
            <div className="space-y-1">
               <h2 className="text-4xl font-black text-white tracking-tight uppercase">Destaques</h2>
               <div className="h-1 w-20 hub-bg-primary" />
            </div>
            <Button variant="link" className="hub-text-primary text-[10px] font-black uppercase tracking-widest group">
               Ver Coleção Completa <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
               <div key={product.id} className="group cursor-pointer">
                  <div className="relative aspect-[4/5] bg-black border border-[var(--hub-border)] overflow-hidden">
                     {product.tag && (
                        <div className="absolute top-4 left-4 z-20 bg-white text-black text-[8px] font-black px-2 py-1 tracking-widest">
                           {product.tag}
                        </div>
                     )}
                     <img 
                        src={product.img} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                     <div className="absolute bottom-0 inset-x-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Button className="w-full hub-bg-primary text-black rounded-none h-12 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                           Adicionar ao Carrinho
                        </Button>
                     </div>
                  </div>
                  <div className="mt-6 space-y-2">
                     <div className="flex items-center gap-1 text-[8px] hub-text-primary">
                        <Star className="h-2 w-2 fill-current" />
                        <Star className="h-2 w-2 fill-current" />
                        <Star className="h-2 w-2 fill-current" />
                        <Star className="h-2 w-2 fill-current" />
                        <Star className="h-2 w-2 fill-current" />
                     </div>
                     <h3 className="text-sm font-black text-white uppercase tracking-tight">{product.name}</h3>
                     <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-[var(--hub-primary)]">{product.price}</span>
                        <span className="text-xs text-[var(--hub-muted)] line-through decoration-[var(--hub-border)]">{product.oldPrice}</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-10 border-t border-[var(--hub-border)] bg-black/40">
         <div className="grid grid-cols-4 gap-16">
            <div className="col-span-1 space-y-6">
               <div className="flex items-center gap-3">
                  <div className="h-6 w-6 hub-bg-primary rounded flex items-center justify-center">
                     <ShoppingBag className="h-4 w-4 text-black" />
                  </div>
                  <span className="text-lg font-black tracking-tighter text-white">PUB STORE</span>
               </div>
               <p className="text-[11px] text-[var(--hub-muted)] leading-relaxed font-medium uppercase tracking-wider">
                  A plataforma definitiva para lojistas e influencers. O futuro do e-commerce é agora.
               </p>
            </div>
            
            {[
               { title: 'Shop', links: ['Lançamentos', 'Best Sellers', 'Categorias', 'Ofertas'] },
               { title: 'Empresa', links: ['Sobre nós', 'Termos de uso', 'Privacidade', 'Contato'] },
               { title: 'Social', links: ['Instagram', 'TikTok', 'Twitter', 'YouTube'] }
            ].map(col => (
               <div key={col.title} className="col-span-1 space-y-6">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{col.title}</h4>
                  <ul className="space-y-3">
                     {col.links.map(link => (
                        <li key={link}>
                           <a href="#" className="text-[10px] font-bold text-[var(--hub-muted)] hover:text-white transition-colors uppercase tracking-widest">{link}</a>
                        </li>
                     ))}
                  </ul>
               </div>
            ))}
         </div>
         <div className="mt-20 pt-10 border-t border-[var(--hub-border)] flex items-center justify-between text-[8px] font-black text-[var(--hub-muted)] uppercase tracking-[0.4em]">
            <span>© 2026 PUB ECOM GROUP — ALL RIGHTS RESERVED</span>
            <div className="flex gap-10">
               <span>PAGAMENTOS SEGUROS</span>
               <span>RASTREAMENTO GLOBAL</span>
            </div>
         </div>
      </footer>
    </div>
  );
}

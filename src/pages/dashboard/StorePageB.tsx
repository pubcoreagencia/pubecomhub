import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { 
  ShoppingBag, Search, Menu, User, ChevronRight, 
  Star, Truck, ShieldCheck, Zap, ArrowRight,
  Facebook, Instagram, Twitter, Youtube
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const products = [
  { id: 1, name: "Premium Wireless Headphones", price: "R$ 899,90", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60", category: "Eletrônicos", rating: 4.8 },
  { id: 2, name: "Smart Fitness Watch Pro", price: "R$ 459,00", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60", category: "Wearables", rating: 4.9 },
  { id: 3, name: "Ultra HD Camera 4K", price: "R$ 2.400,00", image: "https://images.unsplash.com/photo-1526170315870-ef6d82f58326?w=800&auto=format&fit=crop&q=60", category: "Fotografia", rating: 4.7 },
  { id: 4, name: "Minimalist Leather Backpack", price: "R$ 320,00", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60", category: "Acessórios", rating: 4.6 },
];

export default function StorePage() {
  return (
    <div className="pub-ecom min-h-screen flex flex-col selection:bg-[var(--hub-primary)] selection:text-black">
      {/* Premium Hub Store Header */}
      <header className="h-20 hub-glass border-b border-[var(--hub-border)] sticky top-0 z-50 px-6 lg:px-20 flex items-center justify-between">
        <Link to="/store" className="flex items-center gap-3">
           <div className="h-10 w-10 hub-bg-primary rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-[var(--hub-primary)]/20">
              <ShoppingBag className="h-6 w-6 text-black" />
           </div>
           <span className="text-2xl font-black text-white italic tracking-tighter uppercase">PUB ECOM <span className="text-[var(--hub-primary)]">STORE</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {['Coleções', 'Novidades', 'Mais Vendidos', 'Ofertas'].map(item => (
            <a key={item} href="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--hub-muted)] hover:text-white transition-colors">{item}</a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
           <button className="text-[var(--hub-muted)] hover:text-white transition-colors">
              <Search className="h-5 w-5" />
           </button>
           <button className="text-[var(--hub-muted)] hover:text-white transition-colors relative group">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-[var(--hub-primary)] text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-[var(--hub-primary)]/40 group-hover:scale-110 transition-transform">0</span>
           </button>
           <div className="h-6 w-[1px] bg-[var(--hub-border)] mx-2" />
           <Button variant="ghost" className="hidden sm:flex text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/5 border border-[var(--hub-border)] px-6 h-10 rounded-xl">
              Entrar
           </Button>
        </div>
      </header>

      {/* Hero Section - Elevated Minimalism */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-[var(--hub-border)]">
         <div className="absolute inset-0 bg-gradient-to-t from-[var(--hub-bg)] via-transparent to-transparent z-10" />
         <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center" />
         
         <div className="relative z-20 text-center space-y-8 max-w-4xl px-6 animate-in fade-in zoom-in duration-1000">
            <Badge className="bg-[var(--hub-primary)]/10 text-[var(--hub-primary)] border-[var(--hub-primary)]/20 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">New Era of E-Commerce</Badge>
            <h1 className="text-6xl lg:text-8xl font-black text-white italic tracking-tighter leading-[0.9] uppercase">
               Elevate your <br /> <span className="text-transparent border-t-text outline-text-emerald" style={{ WebkitTextStroke: '1px var(--hub-primary)' }}>Lifestyle</span>
            </h1>
            <p className="text-[var(--hub-muted)] text-sm font-bold uppercase tracking-[0.3em] max-w-xl mx-auto italic">Curadoria exclusiva dos melhores produtos globais com fulfillment de alta performance.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
               <Button className="h-14 px-12 hub-bg-primary text-black text-[12px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-[var(--hub-primary)]/30 hover:scale-105 transition-all w-full sm:w-auto">
                  Ver Coleção
                  <ArrowRight className="ml-3 h-5 w-5" />
               </Button>
               <Button variant="outline" className="h-14 px-12 border-[var(--hub-border)] text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white/5 w-full sm:w-auto">
                  Nossas Lojas
               </Button>
            </div>
         </div>
      </section>

      {/* Product Grid - Hub Card Style */}
      <main className="flex-1 px-6 lg:px-20 py-24 space-y-20">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--hub-border)] pb-8">
            <div className="space-y-2">
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Featured Gear</h2>
               <p className="text-[var(--hub-muted)] text-[11px] font-bold uppercase tracking-[0.3em]">Produtos em destaque nesta semana</p>
            </div>
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
               {['Todos', 'Eletrônicos', 'Wearables', 'Acessórios'].map((cat, i) => (
                 <button 
                  key={cat} 
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl border transition-all whitespace-nowrap",
                    i === 0 ? "bg-[var(--hub-primary)] text-black border-[var(--hub-primary)] shadow-lg shadow-[var(--hub-primary)]/20" : "bg-black/20 text-[var(--hub-muted)] border-[var(--hub-border)] hover:text-white hover:border-white/20"
                  )}
                 >
                   {cat}
                 </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {products.map(prod => (
              <div key={prod.id} className="hub-card hub-gradient-border group cursor-pointer overflow-hidden p-0 rounded-2xl flex flex-col h-full">
                 <div className="relative aspect-[4/5] overflow-hidden">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                       <Button className="h-12 w-12 rounded-full hub-bg-primary text-black shadow-xl">
                          <ShoppingBag className="h-5 w-5" />
                       </Button>
                       <Button variant="outline" className="h-12 w-12 rounded-full border-white/20 bg-black/60 text-white backdrop-blur-md">
                          <ChevronRight className="h-5 w-5" />
                       </Button>
                    </div>
                    <Badge className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border-[var(--hub-border)] text-[9px] font-black uppercase tracking-widest px-3 py-1">
                       {prod.category}
                    </Badge>
                 </div>
                 <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-[10px] font-black text-[var(--hub-muted)] uppercase tracking-widest">
                       <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-[var(--hub-primary)] text-[var(--hub-primary)]" />
                          <span>{prod.rating}</span>
                       </div>
                       <span>Disponível</span>
                    </div>
                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-tight group-hover:text-[var(--hub-primary)] transition-colors">{prod.name}</h3>
                    <div className="pt-4 flex items-center justify-between mt-auto">
                       <span className="text-2xl font-black text-white italic tracking-tighter">{prod.price}</span>
                       <span className="text-[10px] font-black text-[var(--hub-primary)] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Add to cart +</span>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </main>

      {/* Footer - Hub Style */}
      <footer className="bg-black/40 border-t border-[var(--hub-border)] py-20 px-6 lg:px-20 mt-20">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6 col-span-1 md:col-span-2">
               <Link to="/store" className="flex items-center gap-3">
                  <div className="h-8 w-8 hub-bg-primary rounded-lg flex items-center justify-center rotate-3">
                     <ShoppingBag className="h-4 w-4 text-black" />
                  </div>
                  <span className="text-xl font-black text-white italic tracking-tighter uppercase">PUB ECOM</span>
               </Link>
               <p className="text-[var(--hub-muted)] text-[12px] font-bold uppercase tracking-widest max-w-sm leading-relaxed italic">A maior plataforma centralizada de e-commerce e parcerias com foco em performance e escala real.</p>
               <div className="flex items-center gap-4 pt-4">
                  {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                    <a key={i} href="#" className="h-10 w-10 rounded-full border border-[var(--hub-border)] flex items-center justify-center text-[var(--hub-muted)] hover:text-white hover:border-white/20 transition-all">
                       <Icon className="h-4 w-4" />
                    </a>
                  ))}
               </div>
            </div>
            
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Operação</h4>
               <ul className="space-y-4">
                  {['Dashboard Master', 'Nossas Lojas', 'Fornecedores', 'Fulfillment'].map(item => (
                    <li key={item}><a href="#" className="text-[11px] font-bold text-[var(--hub-muted)] hover:text-white transition-colors uppercase tracking-widest">{item}</a></li>
                  ))}
               </ul>
            </div>

            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Suporte</h4>
               <ul className="space-y-4">
                  {['Rastreamento', 'Políticas', 'Termos de Uso', 'Central de Ajuda'].map(item => (
                    <li key={item}><a href="#" className="text-[11px] font-bold text-[var(--hub-muted)] hover:text-white transition-colors uppercase tracking-widest">{item}</a></li>
                  ))}
               </ul>
            </div>
         </div>
         <div className="pt-20 mt-20 border-t border-[var(--hub-border)]/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[9px] font-black text-[var(--hub-muted)] uppercase tracking-[0.3em]">© 2026 PUB ECOM — PROTOTYPE B. POWERED BY PUB OPS HUB ARCHITECTURE.</p>
            <div className="flex items-center gap-8">
               <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-6 opacity-30 grayscale hover:grayscale-0 transition-all" />
               <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-6 opacity-30 grayscale hover:grayscale-0 transition-all" />
               <img src="https://img.icons8.com/color/48/amex.png" alt="Amex" className="h-6 opacity-30 grayscale hover:grayscale-0 transition-all" />
            </div>
         </div>
      </footer>
    </div>
  );
}

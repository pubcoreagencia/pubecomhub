import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { 
  ShoppingBag, 
  ArrowRight, 
  Star, 
  Zap, 
  ShieldCheck, 
  Truck,
  Search,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockProducts } from '../../../prototype-b/data/mock';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/prototype-b/store/')({
  component: StorefrontHomeB
});

function StorefrontHomeB() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/10 selection:text-primary">
      {/* Premium Navbar */}
      <nav className="h-24 border-b border-slate-50 flex items-center justify-between px-8 lg:px-16 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
        <Link to="/prototype-b/store" className="flex items-center gap-3 group">
          <div className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">PUB ECOM</span>
        </Link>

        <div className="hidden lg:flex items-center gap-12">
          {['Lançamentos', 'Categorias', 'Ofertas', 'Suporte'].map((item) => (
            <Link key={item} className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-50">
            <Search className="h-5 w-5 text-slate-900" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-50 relative">
            <ShoppingCart className="h-5 w-5 text-slate-900" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">2</span>
          </Button>
          <div className="h-6 w-[1px] bg-slate-100 mx-2" />
          <Button className="rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 shadow-xl shadow-primary/20">
            Minha Conta
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48 bg-slate-50">
        <div className="container px-8 mx-auto max-w-[1400px] flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 text-center lg:text-left space-y-12 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
               <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Coleção 2026 Titanium</span>
            </div>
            <h1 className="text-7xl md:text-8xl lg:text-[110px] font-black tracking-tighter text-slate-900 leading-[0.85] uppercase">
              EXPERIENCE <br/> 
              <span className="text-primary italic">FUTURE.</span>
            </h1>
            <p className="text-xl font-bold text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Performance inigualável, design minimalista e tecnologia de ponta para quem não aceita nada menos que o melhor.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button className="w-full sm:w-auto rounded-2xl font-black text-sm uppercase tracking-widest px-12 h-16 shadow-2xl shadow-primary/30 text-lg">
                Comprar Agora
              </Button>
              <Button variant="outline" className="w-full sm:w-auto rounded-2xl font-black text-sm uppercase tracking-widest px-12 h-16 border-slate-200 text-slate-900 text-lg hover:bg-white hover:shadow-lg transition-all">
                Ver Detalhes
              </Button>
            </div>
          </div>
          <div className="flex-1 relative animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="relative z-10 rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] transform lg:rotate-6 transition-transform hover:rotate-0 duration-700">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200" 
                alt="Product" 
                className="w-full h-full object-cover aspect-[4/5]"
              />
            </div>
            {/* Abstract elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10" />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 px-8 lg:px-16 container mx-auto max-w-[1400px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">Destaques</h2>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
          </div>
          <Button variant="ghost" className="rounded-2xl font-black text-xs uppercase tracking-widest text-primary hover:bg-primary/5 p-6 text-lg group">
            Ver Coleção Completa <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {mockProducts.map((product, i) => (
            <div key={product.id} className="group relative">
              <div className="relative rounded-[40px] overflow-hidden bg-slate-100 aspect-[16/10] transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-6 left-6">
                  <Badge className="bg-white text-slate-900 hover:bg-white rounded-full font-black px-4 py-2 uppercase tracking-widest text-[10px] shadow-lg">
                    Premium
                  </Badge>
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                  <Button className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 h-12 bg-white text-slate-900 hover:bg-slate-50 shadow-2xl">
                    Adicionar ao Carrinho
                  </Button>
                  <div className="flex items-center gap-1 text-white">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    <span className="text-sm font-black italic">4.9</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900 uppercase group-hover:text-primary transition-colors cursor-pointer">{product.name}</h3>
                  <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Tecnologia Avançada</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900 tracking-tighter italic">R$ {product.price.toLocaleString('pt-BR')}</p>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">12x Sem Juros</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-900 py-32">
        <div className="container px-8 mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: Zap, title: "Entrega Express", desc: "Receba seus produtos em tempo recorde com nossa logística exclusiva." },
              { icon: ShieldCheck, title: "Garantia Vitalícia", desc: "Qualidade garantida ou seu dinheiro de volta. Sem perguntas." },
              { icon: Truck, title: "Frete Inteligente", desc: "Rastreamento em tempo real com notificações diretas no seu WhatsApp." }
            ].map((feature, i) => (
              <div key={i} className="space-y-6 text-center md:text-left group">
                <div className="h-16 w-16 bg-white/5 rounded-[24px] flex items-center justify-center group-hover:bg-primary transition-colors duration-500 mx-auto md:mx-0">
                  <feature.icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-2xl font-black tracking-tighter text-white uppercase">{feature.title}</h4>
                <p className="text-slate-400 font-bold leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-32 pb-16 border-t border-slate-50">
        <div className="container px-8 mx-auto max-w-[1400px]">
          <div className="flex flex-col lg:flex-row justify-between gap-20 mb-24">
            <div className="max-w-sm space-y-8">
              <Link to="/prototype-b/store" className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">PUB ECOM</span>
              </Link>
              <p className="text-slate-500 font-bold leading-relaxed">
                Elevando o padrão do e-commerce brasileiro com tecnologia de ponta e experiência premium.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16 lg:gap-32">
              <div className="space-y-6">
                <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Loja</h5>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                  {['Produtos', 'Categorias', 'Ofertas', 'Gift Cards'].map(link => (
                    <li key={link} className="hover:text-primary transition-colors cursor-pointer">{link}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Empresa</h5>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                  {['Sobre', 'Carreiras', 'Blog', 'Contato'].map(link => (
                    <li key={link} className="hover:text-primary transition-colors cursor-pointer">{link}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6 hidden md:block">
                <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Social</h5>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                  {['Instagram', 'Twitter', 'LinkedIn', 'Facebook'].map(link => (
                    <li key={link} className="hover:text-primary transition-colors cursor-pointer">{link}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-16 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              © 2026 PUB ECOM Prototype B. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <span className="cursor-pointer hover:text-primary transition-colors">Privacidade</span>
              <span className="cursor-pointer hover:text-primary transition-colors">Termos</span>
              <span className="cursor-pointer hover:text-primary transition-colors">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

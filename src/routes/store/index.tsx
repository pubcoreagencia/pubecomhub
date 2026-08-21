import { createFileRoute, Link } from '@tanstack/react-router';
import { ShoppingCart, Search, Menu, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { mockProducts } from '@/data/mock';
import { useCart } from '@/hooks/useCart';

export const Route = createFileRoute('/store/')({
  component: StoreHome,
});

function StoreHome() {
  const { totalItems, isHydrated } = useCart();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-6">
            <Link to="/store" className="text-2xl font-black tracking-tighter">TECH STORE</Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link to="/store" className="transition-colors hover:text-primary">Lançamentos</Link>
              <Link to="/store" className="transition-colors hover:text-primary">Ofertas</Link>
              <Link to="/store" className="transition-colors hover:text-primary">Categorias</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input type="search" placeholder="Buscar produtos..." className="h-9 w-64 rounded-full border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {isHydrated && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 bg-slate-50">
        <div className="container px-4 mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
              Tecnologia de ponta ao seu alcance.
            </h1>
            <p className="text-lg text-slate-600 max-w-[600px]">
              Os melhores dispositivos, acessórios e gadgets com garantia oficial e entrega expressa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" className="rounded-full px-8">Comprar Agora</Button>
              <Button size="lg" variant="outline" className="rounded-full px-8">Saiba Mais</Button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-[500px]">
             <Link to="/store/product">
               <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800" alt="Featured" className="rounded-3xl shadow-2xl cursor-pointer hover:opacity-90 transition-opacity" />
             </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 container px-4 mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Destaques</h2>
            <p className="text-muted-foreground">Os produtos mais desejados da semana.</p>
          </div>
          <Button variant="ghost">Ver todos</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockProducts.map((p) => (
            <Card key={p.id} className="group border-none shadow-none">
              <Link to="/store/product">
                <CardContent className="p-0 overflow-hidden rounded-2xl aspect-square mb-4 bg-slate-100 relative">
                  <img src={p.image} alt={p.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                  <Button className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg translate-y-2 group-hover:translate-y-0 duration-300">
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Link>
              <CardFooter className="flex flex-col items-start p-0 gap-1">
                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                   {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-3 w-3 fill-current" />)}
                   <span className="text-[10px] text-muted-foreground ml-1">(48 avaliações)</span>
                </div>
                <Link to="/store/product">
                  <h3 className="font-semibold text-slate-900 hover:text-primary transition-colors">{p.name}</h3>
                </Link>
                <p className="text-primary font-bold">R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-slate-900 py-24 text-white text-center">
        <div className="container px-4 mx-auto max-w-[600px] space-y-6">
           <h2 className="text-3xl font-bold">Inscreva-se na nossa newsletter</h2>
           <p className="text-slate-400">Receba ofertas exclusivas e novidades em primeira mão.</p>
           <div className="flex gap-2">
             <input type="email" placeholder="Seu melhor e-mail" className="flex-1 rounded-full px-6 bg-white/10 border-none text-white focus:outline-none focus:ring-2 focus:ring-primary" />
             <Button className="rounded-full px-8">Assinar</Button>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t text-sm text-center text-muted-foreground">
         <p>© 2026 Tech Store. Operado por PUB ECOM.</p>
      </footer>
    </div>
  );
}

import { createFileRoute, Link } from '@tanstack/react-router';
import { ShoppingCart, Star, ShieldCheck, Truck, RefreshCcw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockProducts } from '@/data/mock';

export const Route = createFileRoute('/store/product')({
  component: ProductPage,
});

function ProductPage() {
  const product = mockProducts[0];
  
  if (!product) return <div>Produto não encontrado</div>;


  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Simple */}
      <div className="container px-4 mx-auto py-4 text-xs text-muted-foreground flex items-center gap-2">
        <Link to="/store">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/store">Smartphones</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-900 font-medium">{product.name}</span>
      </div>

      <main className="container px-4 mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Images */}
          <div className="flex-1 space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 border">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square rounded-xl bg-slate-100 border cursor-pointer hover:border-primary transition-colors overflow-hidden">
                  <img src={product.image} className="w-full h-full object-cover opacity-60" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-none">Lançamento 2026</Badge>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="text-sm text-muted-foreground font-medium">(128 avaliações de clientes)</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground line-through">R$ 3.499,00</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-primary">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <span className="text-sm font-bold text-green-600">15% OFF</span>
              </div>
              <p className="text-xs text-muted-foreground italic">em até 12x de R$ {(product.price / 12).toFixed(2)} sem juros</p>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <p className="text-sm text-slate-600 leading-relaxed">
                Experimente o futuro da tecnologia com o novo {product.name}. Equipado com o processador mais rápido do mercado, câmera de nível profissional e bateria que dura o dia todo. O design elegante encontra a performance extrema.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/store/checkout" className="flex-1">
                  <Button className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20">
                    Comprar Agora
                  </Button>
                </Link>
                <Button variant="outline" className="h-14 px-8 rounded-2xl">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-primary">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="text-[10px] leading-tight font-bold uppercase tracking-wider text-slate-500">Frete Grátis Todo Brasil</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-[10px] leading-tight font-bold uppercase tracking-wider text-slate-500">2 Anos de Garantia</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-primary">
                  <RefreshCcw className="h-5 w-5" />
                </div>
                <div className="text-[10px] leading-tight font-bold uppercase tracking-wider text-slate-500">7 Dias para Troca</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

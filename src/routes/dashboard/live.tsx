import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockOrders } from '@/data/mock';
import { Activity, ShoppingCart, UserCheck, CreditCard, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/dashboard/live')({
  component: LiveShopPage,
});

function LiveShopPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Simulando eventos em tempo real baseados nos pedidos
  const events = [
    { type: 'sale', label: 'Venda Realizada', store: 'Loja Tech', time: 'Agora mesmo', icon: CheckCircle2, color: 'text-green-500' },
    { type: 'checkout', label: 'Checkout Ativo', store: 'Moda Fashion', time: '2 min atrás', icon: CreditCard, color: 'text-blue-500' },
    { type: 'cart', label: 'Carrinho Aberto', store: 'Loja Tech', time: '5 min atrás', icon: ShoppingCart, color: 'text-orange-500' },
    { type: 'visitor', label: 'Novo Visitante', store: 'Moda Fashion', time: '8 min atrás', icon: UserCheck, color: 'text-slate-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Live Shop</h2>
          <p className="text-muted-foreground">Monitoramento em tempo real do funil de vendas.</p>
        </div>
        {!loading && (
          <Badge variant="outline" className="animate-pulse bg-red-50 text-red-700 border-red-200">
            <Activity className="mr-1 h-3 w-3" /> Ao Vivo
          </Badge>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase text-muted-foreground">
                {loading ? <Skeleton className="h-3 w-16" /> : ['Visitantes', 'Carrinhos', 'Checkouts', 'Pagamentos', 'Vendas'][i]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{[128, 24, 12, 8, 5][i]}</div>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Eventos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))
            ) : (
              events.map((event, i) => (
                <div key={i} className="flex items-center">
                  <div className={i !== events.length - 1 ? "relative pb-8" : ""}>
                    {i !== events.length - 1 && <span className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />}
                    <div className="relative flex items-center space-x-3">
                      <div className={cn("h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center", event.color)}>
                        <event.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm">
                            <span className="font-bold text-slate-900">{event.label}</span> na <span className="font-semibold text-primary">{event.store}</span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">{event.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

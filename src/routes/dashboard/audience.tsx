import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Filter, ArrowRight, UserPlus, ShoppingCart, CreditCard, ShoppingBag, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/dashboard/audience')({
  component: AudiencePage,
});

function AudiencePage() {
  const levels = [
    { level: 'L1', name: 'Page View', icon: Users, count: '12,450', color: 'bg-slate-100 text-slate-700' },
    { level: 'L2', name: 'Add to Cart', icon: MousePointer2, count: '2,840', color: 'bg-orange-50 text-orange-700' },
    { level: 'L3', name: 'Add Payment Info', icon: CreditCard, count: '950', color: 'bg-blue-50 text-blue-700' },
    { level: 'L4', name: 'Purchase', icon: ShoppingBag, count: '480', color: 'bg-green-50 text-green-700' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Audience Engine</h2>
        <p className="text-muted-foreground">Gestão de públicos personalizados e remarketing por nível de funil.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {levels.map((l) => (
          <Card key={l.level}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Badge className={l.color}>{l.level}</Badge>
              <l.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{l.count}</div>
              <p className="text-sm font-medium text-slate-900">{l.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração de Públicos</CardTitle>
          <CardDescription>Defina janelas de retenção e exclusões automáticas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Janela de Retenção</label>
                <div className="flex gap-2">
                   {['1D', '3D', '7D', '14D', '30D'].map(d => (
                     <Button key={d} variant={d === '7D' ? 'default' : 'outline'} size="sm" className="flex-1">{d}</Button>
                   ))}
                </div>
             </div>
             <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Exclusões Automáticas</label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-slate-50">
                   <div className="h-2 w-2 rounded-full bg-green-500" />
                   <span className="text-sm">Excluir compradores (L4) de campanhas de recuperação (L1/L2)</span>
                </div>
             </div>
           </div>
           
           <div className="rounded-xl border bg-slate-900 p-6 text-white overflow-hidden relative">
              <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-2">
                   <h3 className="text-lg font-bold">Gerar Público Meta/Google</h3>
                   <p className="text-sm text-slate-400">Sincronização em tempo real com Pixel e API de Conversões.</p>
                </div>
                <Button className="bg-white text-slate-900 hover:bg-white/90 font-bold px-8 rounded-full">Sincronizar</Button>
              </div>
              <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
           </div>
        </CardContent>
      </Card>
    </div>
  );
}

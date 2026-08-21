import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Filter, ArrowRight, UserPlus, ShoppingCart, CreditCard, ShoppingBag, MousePointer2, ShieldCheck, Zap } from 'lucide-react';
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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 leading-none">Audience Engine</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Gestão de públicos personalizados e remarketing por nível de funil.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="rounded-full border-slate-200 font-bold text-[10px] uppercase tracking-widest px-6 h-10">
              Exportar Base
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {levels.map((l) => (
          <Card key={l.level} className="group shadow-sm border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-6 px-6">
              <Badge className={cn("rounded-full px-3 py-1 font-black text-[10px] border-none shadow-sm", l.color)}>{l.level}</Badge>
              <div className="p-2 rounded-xl bg-slate-50 text-slate-400 transition-colors group-hover:text-primary group-hover:bg-primary/5">
                {React.createElement(l.icon, { className: "h-4.5 w-4.5" })}
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-3xl font-black text-slate-900 tracking-tighter">{l.count}</div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{l.name}</p>
            </CardContent>
            {/* Visual Bar at bottom */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-slate-50">
               <div className={cn("h-full transition-all duration-700 delay-300", 
                 l.level === 'L1' ? 'w-full bg-slate-200' : 
                 l.level === 'L2' ? 'w-2/3 bg-orange-400' : 
                 l.level === 'L3' ? 'w-1/3 bg-blue-500' : 'w-1/4 bg-emerald-500'
               )} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-slate-100 rounded-[2.5rem] bg-white overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <CardHeader className="px-8 py-8 border-b border-slate-50">
          <CardTitle className="text-xl font-black tracking-tight text-slate-900">Configuração de Públicos</CardTitle>
          <CardDescription className="font-medium text-slate-500">Defina janelas de retenção e exclusões automáticas.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Janela de Retenção</label>
                <div className="flex gap-3 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                   {['1D', '3D', '7D', '14D', '30D'].map(d => (
                     <Button 
                      key={d} 
                      variant={d === '7D' ? 'default' : 'ghost'} 
                      size="sm" 
                      className={cn(
                        "flex-1 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all",
                        d === '7D' ? "shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-white hover:text-primary"
                      )}
                     >
                       {d}
                     </Button>
                   ))}
                </div>
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Exclusões Inteligentes</label>
                <div className="flex items-center gap-4 p-4 border border-emerald-100 rounded-2xl bg-emerald-50/30 group cursor-pointer hover:bg-emerald-50 transition-all">
                   <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200">
                      <ShieldCheck className="h-5 w-5" />
                   </div>
                   <div>
                      <span className="text-sm font-black text-slate-900 block leading-tight">Exclusão L4 Ativa</span>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1 block">Compradores excluídos do remarketing</span>
                   </div>
                </div>
             </div>
           </div>
           
           <div className="rounded-[2.5rem] border-none bg-slate-900 p-8 text-white overflow-hidden relative group">
              {/* Animated background decoration */}
              <div className="absolute top-0 right-0 h-full w-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none transition-opacity duration-1000 group-hover:opacity-30" />
              <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3 text-center md:text-left">
                   <h3 className="text-2xl font-black tracking-tight leading-none">Sincronização Meta & Google</h3>
                   <p className="text-sm text-slate-400 font-medium max-w-md">Envie seus públicos L1-L4 automaticamente para o Gerenciador de Anúncios via CAPI e Pixel.</p>
                </div>
                <Button className="bg-white text-slate-900 hover:bg-slate-100 font-black px-10 h-14 rounded-full shadow-2xl transition-all hover:scale-[1.05] text-sm uppercase tracking-widest group">
                  Sincronizar Agora 
                  <Zap className="ml-2 h-4 w-4 fill-primary text-primary transition-transform group-hover:scale-125" />
                </Button>
              </div>
           </div>
        </CardContent>
      </Card>
    </div>

  );
}

import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Target, BarChart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/dashboard/marketing')({
  component: MarketingPage,
});

function MarketingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Marketing & Ads</h2>
        <p className="text-muted-foreground">Monitoramento de campanhas Meta, Google e Influenciadores.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
             <div>
                <CardTitle>Meta Ads</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Status: Conectado</p>
             </div>
             <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">∞</div>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                   <p className="text-xs text-muted-foreground uppercase">Gastos (7D)</p>
                   <p className="text-lg font-bold text-slate-900">R$ 1.240,00</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                   <p className="text-xs text-muted-foreground uppercase">ROAS</p>
                   <p className="text-lg font-bold text-green-600">4.2x</p>
                </div>
             </div>
             <Button variant="outline" className="w-full gap-2">Gerenciar Campanhas <ExternalLink className="h-3 w-3" /></Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
             <div>
                <CardTitle>Influenciadores</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Repasse: 50% Lucro Líquido</p>
             </div>
             <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                   <span className="font-medium">@influencer_top</span>
                   <span className="text-green-600 font-bold">+R$ 450,00</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                   <span className="font-medium">@tech_review</span>
                   <span className="text-green-600 font-bold">+R$ 280,00</span>
                </div>
             </div>
             <Button variant="outline" className="w-full gap-2">Painel de Repasses</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
           <CardTitle>Rastreamento UTM & UTMify</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="p-4 border border-dashed rounded-lg bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-md"><Target className="h-4 w-4 text-primary" /></div>
                 <div>
                    <p className="text-sm font-semibold">Configuração UTMify ativa</p>
                    <p className="text-xs text-muted-foreground">Todos os links da loja pública estão sendo rastreados.</p>
                 </div>
              </div>
              <Badge>Ativo</Badge>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}

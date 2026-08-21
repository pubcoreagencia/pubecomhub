import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Route = createFileRoute('/dashboard_old/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerencie sua conta e as preferências da plataforma.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="finance">Financeiro</TabsTrigger>
          <TabsTrigger value="api">API / Integrações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>Dados do Operador Central.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome da Operação</Label>
                <Input id="name" defaultValue="PUB ECOM Central" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail de Suporte</Label>
                <Input id="email" defaultValue="contato@pubecom.com.br" />
              </div>
              <Button>Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle>Configurações Financeiras</CardTitle>
              <CardDescription>Taxas e comissões padrão.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="fee">Taxa de Pagamento Padrão (%)</Label>
                <Input id="fee" type="number" defaultValue="5" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="inf">Repasse Influenciador (Lucro Líquido %)</Label>
                <Input id="inf" type="number" defaultValue="50" />
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle>Tokens de Integração</CardTitle>
              <CardDescription>Chaves para conexão com serviços externos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-100 rounded-md font-mono text-xs break-all">
                pb_ecom_live_test_51Mz...
              </div>
              <Button variant="outline">Gerar Novo Token</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

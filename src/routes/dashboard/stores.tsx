import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockStores } from '@/data/mock';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/dashboard/stores')({
  component: StoresPage,
});

function StoresPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lojas</h2>
          <p className="text-muted-foreground">Gerencie as lojas sob sua operação central.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Nova Loja
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Nome da Loja</TableHead>
                <TableHead>Subdomínio</TableHead>
                <TableHead>Dono</TableHead>
                <TableHead>Criada em</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6"><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="text-right pr-6"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                mockStores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium pl-6">{store.name}</TableCell>
                    <TableCell className="text-muted-foreground">{store.subdomain}.pubecom.com.br</TableCell>
                    <TableCell>Lojista Alpha</TableCell>
                    <TableCell>{new Date(store.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={store.status === 'active' ? 'secondary' : 'outline'} className={store.status === 'active' ? 'bg-green-50 text-green-700' : ''}>
                        {store.status === 'active' ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="sm">Configurar</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

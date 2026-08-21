import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockStores } from '@/data/mock';
import { Plus, Search, Filter, MoreHorizontal, Store as StoreIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/dashboard_old/stores')({
  component: StoresPage,
});

function StoresPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Gestão de Lojas</h2>
          <p className="text-slate-500 text-sm">Controle e acompanhamento das lojas da operação.</p>
        </div>
        <Button className="gap-2 rounded-full px-6 shadow-sm">
          <Plus className="h-4 w-4" /> Nova Loja
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Buscar loja pelo nome..." className="pl-9 bg-white border-slate-200 rounded-full h-10" />
         </div>
         <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 rounded-full border-slate-200">
               <Filter className="h-3.5 w-3.5 text-slate-400" />
               <span>Filtros</span>
            </Button>
         </div>
      </div>

      <Card className="shadow-sm border-slate-100 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-b-slate-100">
                <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">Nome da Loja</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Subdomínio</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Dono / Lojista</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Criada em</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                <TableHead className="text-right pr-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i} className="border-b-slate-50">
                    <TableCell className="pl-6"><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                mockStores.map((store) => (
                  <TableRow key={store.id} className="hover:bg-slate-50/50 transition-colors border-b-slate-50 last:border-0">
                    <TableCell className="pl-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                             {React.createElement(StoreIcon, { className: "h-5 w-5" })}
                          </div>
                          <span className="font-bold text-slate-900">{store.name}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-slate-500 font-medium">
                       {store.subdomain}.pubecom.com.br
                       <Badge variant="outline" className="ml-2 text-[8px] h-4 px-1 text-slate-400 border-slate-200">PRO</Badge>
                    </TableCell>
                    <TableCell className="text-slate-900 font-medium">Lojista Alpha</TableCell>
                    <TableCell className="text-slate-500 text-xs">{new Date(store.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-[10px] font-bold uppercase px-2 py-0.5 border-none",
                          store.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        {store.status === 'active' ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 transition-colors">
                         <MoreHorizontal className="h-4 w-4" />
                      </Button>
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

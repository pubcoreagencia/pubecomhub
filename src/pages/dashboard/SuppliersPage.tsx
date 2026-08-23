import * as React from 'react';
import { Shell } from '@/components/layout/Shell';
import { HubTable } from '@/components/ui-b';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SuppliersPage() {
  const suppliers = [
    { name: "Global Tech Hub", category: "Eletrônicos", status: "Ativo", products: 1240 },
    { name: "Nordic Design Co.", category: "Mobiliário", status: "Ativo", products: 850 }
  ];

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Fornecedores</h2>
          <Button className="hub-bg-primary text-black font-black uppercase tracking-widest text-[10px]">
            <Plus className="h-4 w-4 mr-2" /> Novo Fornecedor
          </Button>
        </div>

        <HubTable headers={['Fornecedor', 'Categoria', 'Status', 'Produtos', 'Ações']}>
          {suppliers.map((s, i) => (
            <tr key={i}>
              <td className="px-5 py-4 font-bold text-white">{s.name}</td>
              <td className="px-5 py-4 text-[var(--hub-muted)]">{s.category}</td>
              <td className="px-5 py-4 text-red-500 font-bold">{s.status}</td>
              <td className="px-5 py-4 text-white">{s.products}</td>
              <td className="px-5 py-4 text-[var(--hub-primary)]">Gerenciar</td>
            </tr>
          ))}
        </HubTable>
      </div>
    </Shell>
  );
}

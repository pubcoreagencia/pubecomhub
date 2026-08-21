import { createFileRoute } from '@tanstack/react-router';
import { ShellB } from '@/prototype-b/components/ShellB';
import { HubTable } from '@/prototype-b/components/ui-b';
import { Box, Package, Truck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/prototype-b/dashboard/products')({
  component: () => <ProductsB />,
});

function ProductsB() {
  return (
    <ShellB>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-sm font-black text-white uppercase tracking-widest">Catálogo de Produtos</h2>
           <Button className="h-9 bg-[var(--hub-primary)] hover:bg-[var(--hub-primary)]/80 text-black text-[10px] font-black uppercase tracking-wider px-6">
              Adicionar Novo Produto
           </Button>
        </div>

        <HubTable headers={['SKU', 'Produto', 'Fornecedor', 'Estoque', 'Custo', 'Venda', 'Margem', 'Ações']}>
          {[
            { sku: 'PUB-SVC-001', nome: 'Premium Wireless Headphones', sup: 'FastShip Logistics', stock: 150, cost: 'R$ 450', price: 'R$ 899', margin: '50%' },
            { sku: 'PUB-SVC-002', nome: 'Smart Fitness Watch Pro', sup: 'Tech Source Pro', stock: 85, cost: 'R$ 210', price: 'R$ 459', margin: '54%' },
            { sku: 'PUB-SVC-003', nome: 'Ultra HD Camera', sup: 'FastShip Logistics', stock: 12, cost: 'R$ 1.200', price: 'R$ 2.400', margin: '50%' },
          ].map(prod => (
            <tr key={prod.sku}>
              <td className="px-5 py-4 font-black text-[var(--hub-muted)]">{prod.sku}</td>
              <td className="px-5 py-4 font-bold text-white uppercase tracking-tight">{prod.nome}</td>
              <td className="px-5 py-4 text-[var(--hub-muted)]">{prod.sup}</td>
              <td className="px-5 py-4 text-white font-bold">
                 <div className="flex items-center gap-2">
                    {prod.stock < 20 && <AlertTriangle className="h-3 w-3 text-orange-500" />}
                    {prod.stock}
                 </div>
              </td>
              <td className="px-5 py-4 text-red-400">{prod.cost}</td>
              <td className="px-5 py-4 text-white font-black">{prod.price}</td>
              <td className="px-5 py-4 text-[var(--hub-primary)] font-black">{prod.margin}</td>
              <td className="px-5 py-4 text-right">
                 <Button variant="ghost" className="text-[var(--hub-muted)] hover:text-white text-[9px] font-black uppercase">Editar</Button>
              </td>
            </tr>
          ))}
        </HubTable>
      </div>
    </ShellB>
  );
}

import { createFileRoute } from '@tanstack/react-router';
import { ShellB } from '@/prototype-b/components/ShellB';
import { HubTable, CardMetric } from '@/prototype-b/components/ui-b';

export const Route = createFileRoute('/prototype-b/dashboard/finance')({
  component: () => <FinanceB />,
});

function FinanceB() {
  return (
    <ShellB>
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-6">
          <CardMetric label="Faturamento Total" value="R$ 1.842.900" trend="+15% vs mês ant." trendType="up" />
          <CardMetric label="Lucro Líquido" value="R$ 536.800" trend="29.1% margem" trendType="neutral" />
          <CardMetric label="Comissões Influencers" value="R$ 268.400" subtext="50% do lucro" />
          <CardMetric label="Resultado Líquido PUB" value="R$ 268.400" trendType="up" />
        </div>

        <div className="grid grid-cols-3 gap-6">
           <div className="col-span-2">
              <HubTable headers={['ID', 'Data', 'Loja', 'Venda', 'Custo', 'Frete', 'Taxas', 'Lucro Lq.']}>
                {[
                  { id: '#10942', data: '21/08/2026', loja: 'Elite Dropshipping', venda: 'R$ 899,90', custo: 'R$ 450,00', frete: 'R$ 25,00', taxas: 'R$ 45,00', lucro: 'R$ 379,90' },
                  { id: '#10941', data: '21/08/2026', loja: 'Glow Up Store', venda: 'R$ 459,00', custo: 'R$ 210,00', frete: 'R$ 15,00', taxas: 'R$ 22,95', lucro: 'R$ 211,05' },
                  { id: '#10940', data: '20/08/2026', loja: 'Alpha Tech Hub', venda: 'R$ 1.200,00', custo: 'R$ 600,00', frete: 'R$ 40,00', taxas: 'R$ 60,00', lucro: 'R$ 500,00' },
                ].map((row) => (
                  <tr key={row.id}>
                    <td className="px-5 py-4 font-black">{row.id}</td>
                    <td className="px-5 py-4 text-[var(--hub-muted)]">{row.data}</td>
                    <td className="px-5 py-4 font-bold text-white">{row.loja}</td>
                    <td className="px-5 py-4 text-white">{row.venda}</td>
                    <td className="px-5 py-4 text-red-400">{row.custo}</td>
                    <td className="px-5 py-4 text-red-400">{row.frete}</td>
                    <td className="px-5 py-4 text-red-400">{row.taxas}</td>
                    <td className="px-5 py-4 font-black text-[var(--hub-primary)]">{row.lucro}</td>
                  </tr>
                ))}
              </HubTable>
           </div>
           <div className="col-span-1 space-y-6">
              <div className="hub-card p-6">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-6">Repasse Influencers</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[11px]">
                       <span className="text-[var(--hub-muted)]">Lucro Total</span>
                       <span className="text-white font-bold">R$ 536.800,00</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                       <span className="text-[var(--hub-muted)]">Comissão (50%)</span>
                       <span className="text-[var(--hub-primary)] font-black">R$ 268.400,00</span>
                    </div>
                    <div className="h-[1px] bg-[var(--hub-border)]" />
                    <div className="flex justify-between items-center text-[11px]">
                       <span className="text-white font-black uppercase">Saldo Disponível</span>
                       <span className="text-white font-black">R$ 124.200,00</span>
                    </div>
                 </div>
              </div>

              <div className="hub-card p-6">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-6">Custos Operacionais</h4>
                 <div className="h-[150px] flex items-center justify-center border border-dashed border-[var(--hub-border)] rounded">
                    <span className="text-[10px] text-[var(--hub-muted)] uppercase tracking-widest">Gráfico de Custos</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </ShellB>
  );
}

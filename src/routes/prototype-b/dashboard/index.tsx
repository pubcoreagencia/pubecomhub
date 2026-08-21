import { createFileRoute } from '@tanstack/react-router';
import { ShellB } from '../../components/ShellB';
import { CardMetric, AcquisitionFunnel, HubTable } from '../../components/ui-b';

export const Route = createFileRoute('/prototype-b/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  return (
    <ShellB>
      <div className="grid grid-cols-4 gap-6">
        {/* Metric Cards */}
        <div className="col-span-1">
          <CardMetric label="Faturamento Hoje" value="R$ 42.890,2" trend="+12,4% vs ontem" trendType="up" />
        </div>
        <div className="col-span-1">
          <CardMetric label="Faturamento do Mês" value="R$ 1,8 mi" subtext="Projeção: R$ 2,4 mi" />
        </div>
        <div className="col-span-1">
          <CardMetric label="Pedidos Hoje" value="482" subtext="22 em processamento" />
        </div>
        <div className="col-span-1">
          <CardMetric label="Lucro Estimado" value="R$ 336,8 mil" trend="Margem: 29,1%" trendType="neutral" />
        </div>

        {/* Middle Content */}
        <div className="col-span-3 space-y-6">
           <div className="hub-card p-6 h-[300px] flex items-center justify-center">
             <span className="text-[11px] text-[var(--hub-muted)] uppercase tracking-widest font-black">Gráfico de Faturamento por hora</span>
           </div>
           
           <HubTable headers={['Pos.', 'Loja', 'Mentor', 'Pedidos', 'Conversão', 'Lucro']}>
              {[
                { pos: '#01', loja: 'Elite Dropshipping', mentor: 'Marcus Silva', pedidos: '124', conv: '4,21%', lucro: 'R$ 4.290,00' },
                { pos: '#02', loja: 'Glow Up Store', mentor: 'Amanda Rebouças', pedidos: '98', conv: '3,84%', lucro: 'R$ 3.120,00' },
              ].map(row => (
                <tr key={row.pos}>
                   <td className="px-5 py-4 font-black">{row.pos}</td>
                   <td className="px-5 py-4 font-bold">{row.loja}</td>
                   <td className="px-5 py-4 text-[var(--hub-muted)]">{row.mentor}</td>
                   <td className="px-5 py-4">{row.pedidos}</td>
                   <td className="px-5 py-4">{row.conv}</td>
                   <td className="px-5 py-4 font-bold text-[var(--hub-primary)]">{row.lucro}</td>
                </tr>
              ))}
           </HubTable>
        </div>

        {/* Sidebar Widgets */}
        <div className="col-span-1 space-y-6">
          <AcquisitionFunnel />
          <div className="hub-card p-6 h-[300px]">
             <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-6">Eventos em tempo real</h4>
             <div className="space-y-4">
               {['Pedido #10942 aprovado', 'Cliente iniciou checkout', 'Pagamento processado'].map((evt, i) => (
                 <div key={i} className="text-[10px] p-3 rounded bg-black/20 border border-[var(--hub-border)]">
                    <p className="font-bold text-white">{evt}</p>
                    <p className="text-[var(--hub-muted)]">há {i * 10 + 5}s</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </ShellB>
  );
}

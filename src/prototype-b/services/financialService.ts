import { Order, FinancialSummary } from '../types';
import { orderRepository } from '../repositories/orderRepository';

export class FinancialService {
  async calculateSummary(orders: Order[]): Promise<FinancialSummary> {
    const summary: FinancialSummary = {
      totalRevenue: 0,
      totalCost: 0,
      totalShipping: 0,
      totalTax: 0,
      totalDiscount: 0,
      netProfit: 0,
      pubResult: 0,
      commissions: {
        influencers: 0,
        afiliados: 0
      }
    };

    orders.forEach(order => {
      summary.totalRevenue += order.amount;
      summary.totalCost += order.cost;
      summary.totalShipping += order.shipping;
      summary.totalTax += order.tax;
      summary.totalDiscount += order.discount;

      // Lucro Líquido = Venda - Custo - Frete - Taxas - Descontos
      const orderNetProfit = order.amount - order.cost - order.shipping - order.tax - order.discount;
      summary.netProfit += orderNetProfit;

      // Regra Influencer: 50% do lucro líquido
      if (order.influencerId) {
        const influencerCommission = orderNetProfit * 0.5;
        summary.commissions.influencers += influencerCommission;
      }

      // Regra Afiliado: Simulado 10% da venda (configurável)
      if (order.afiliadoId) {
        const afiliadoCommission = order.amount * 0.1;
        summary.commissions.afiliados += afiliadoCommission;
      }
    });

    // Resultado PUB = Lucro Líquido - Comissões
    summary.pubResult = summary.netProfit - summary.commissions.influencers - summary.commissions.afiliados;

    return summary;
  }
}

export const financialService = new FinancialService();

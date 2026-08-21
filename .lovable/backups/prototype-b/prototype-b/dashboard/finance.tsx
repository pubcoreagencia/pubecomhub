import FinancePageB from '@/prototype-b/pages/FinancePageB';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/prototype-b/dashboard/finance')({
  component: FinancePageB
});

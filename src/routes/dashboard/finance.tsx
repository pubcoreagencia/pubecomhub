import FinancePageB from '@/prototype-b/pages/FinancePageB';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/finance')({
  component: FinancePageB
});

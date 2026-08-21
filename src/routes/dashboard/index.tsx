import DashboardPageB from '@/prototype-b/pages/DashboardPageB';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPageB
});


import DashboardPageB from '@/prototype-b/pages/DashboardPageB';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/prototype-b/dashboard/')({
  component: DashboardPageB
});


import DashboardPageB from '@/pages/dashboard/DashboardPageB';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPageB
});


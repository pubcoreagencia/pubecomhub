import StorePage from '@/pages/dashboard/StorePageB';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/store/')({
  component: StorePage
});

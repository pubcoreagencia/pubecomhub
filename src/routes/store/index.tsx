import StorePageB from '@/prototype-b/pages/StorePageB';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/prototype-b/store/')({
  component: StorePageB
});

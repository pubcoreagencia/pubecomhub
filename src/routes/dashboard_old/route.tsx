import { createFileRoute, Outlet } from '@tanstack/react-router';
import DashboardLayout from '@/layouts/DashboardLayout';

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <DashboardLayout />
  ),
});


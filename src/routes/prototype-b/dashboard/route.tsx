import * as React from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { DashboardLayoutB } from '../../../prototype-b/layouts/DashboardLayoutB';

export const Route = createFileRoute('/prototype-b/dashboard')({
  component: DashboardLayoutB
});

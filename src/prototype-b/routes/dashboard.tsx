import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayoutB } from '../layouts/DashboardLayoutB';

export const Route = createFileRoute('/prototype-b/dashboard')({
  component: DashboardLayoutB
});

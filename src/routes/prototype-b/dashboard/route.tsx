import * as React from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/prototype-b/dashboard')({
  component: () => <Outlet />
});


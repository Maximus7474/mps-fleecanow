import React from 'react';

export interface NavItem {
  icon: React.ReactNode;
  tooltip: string | undefined;
  path: string;
  requiresAuth: boolean;
}

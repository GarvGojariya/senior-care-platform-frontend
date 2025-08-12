import React from 'react';
import { useAppSelector } from '../store/hooks';
import type { Role } from '../types/auth';

interface RoleBasedComponentProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}

const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({ 
  children, 
  allowedRoles, 
  fallback = null 
}) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleBasedComponent;

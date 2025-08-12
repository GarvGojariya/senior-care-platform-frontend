import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import type { Role } from '../types/auth';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallbackPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallbackPath = '/dashboard' 
}) => {
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
